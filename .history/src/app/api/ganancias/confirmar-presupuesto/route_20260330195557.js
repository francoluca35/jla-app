import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { clienteId } = await req.json();
    if (!clienteId) {
      return NextResponse.json({ error: "clienteId requerido." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("jlapp");

    const cliente = await db.collection("clientes").findOne({ _id: new ObjectId(clienteId) });
    if (!cliente) {
      return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 });
    }

    if (cliente.problemType !== "presupuesto") {
      return NextResponse.json({ error: "Solo aplica a presupuestos." }, { status: 400 });
    }

    if (cliente.paymentOption !== "seña" && cliente.paymentOption !== "pago total") {
      return NextResponse.json(
        { error: "Solo presupuestos con seña o pago total pueden confirmar materia prima." },
        { status: 400 }
      );
    }

    if (cliente.presupuestoGanancia?.materiaPrimaEstado === "calculado") {
      return NextResponse.json(
        { error: "La materia prima de este presupuesto ya fue calculada." },
        { status: 400 }
      );
    }

    const totalPresupuesto = Number(
      cliente.presupuestoGanancia?.totalPresupuesto ?? cliente.totalTrabajo ?? cliente.amount ?? 0
    );

    if (!Number.isFinite(totalPresupuesto) || totalPresupuesto <= 0) {
      return NextResponse.json(
        { error: "No se pudo determinar el total del presupuesto." },
        { status: 400 }
      );
    }

    const matchPresupuesto = ObjectId.isValid(clienteId)
      ? {
          tipo: "materiaPrima",
          $or: [
            { presupuestoClienteId: clienteId },
            { presupuestoClienteId: new ObjectId(clienteId) },
          ],
        }
      : { tipo: "materiaPrima", presupuestoClienteId: clienteId };

    const agg = await db
      .collection("gastos")
      .aggregate([{ $match: matchPresupuesto }, { $group: { _id: null, totalMateria: { $sum: "$precio" } } }])
      .toArray();

    const totalMateria = agg[0]?.totalMateria ?? 0;
    const gananciaNeta = Math.max(0, totalPresupuesto - totalMateria);

    await db.collection("clientes").updateOne(
      { _id: new ObjectId(clienteId) },
      {
        $set: {
          presupuestoGanancia: {
            ...(cliente.presupuestoGanancia && typeof cliente.presupuestoGanancia === "object"
              ? cliente.presupuestoGanancia
              : {}),
            totalPresupuesto,
            materiaPrimaEstado: "calculado",
            totalMateriaPrima: totalMateria,
            gananciaNeta,
          },
        },
      }
    );

    return NextResponse.json({
      ok: true,
      totalPresupuesto,
      totalMateriaPrima: totalMateria,
      gananciaNeta,
    });
  } catch (error) {
    console.error("confirmar-presupuesto:", error);
    return NextResponse.json({ error: "Error al confirmar cálculo." }, { status: 500 });
  }
}
