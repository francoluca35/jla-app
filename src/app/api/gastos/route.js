// app/api/gastos/route.js
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "jlapp";

// POST: insertar gasto
export async function POST(req) {
  try {
    const data = await req.json();
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("gastos");

    const result = await collection.insertOne(data);
    return NextResponse.json({
      message: "Gasto guardado",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error al guardar gasto:", error);
    return NextResponse.json(
      { error: "Error al guardar gasto" },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    const { ids } = await req.json();
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("gastos");

    const objectIds = ids.map((id) => new ObjectId(id));
    await collection.deleteMany({ _id: { $in: objectIds } });

    return NextResponse.json({ message: "Eliminados correctamente" });
  } catch (error) {
    console.error("Error al eliminar gastos:", error);
    return NextResponse.json(
      { error: "Error al eliminar gastos" },
      { status: 500 }
    );
  }
}

// GET: obtener gastos con filtros
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo");
    const fecha = searchParams.get("fecha");
    const min = parseInt(searchParams.get("min") || 0);
    const max = parseInt(searchParams.get("max") || Number.MAX_SAFE_INTEGER);

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("gastos");

    const query = {
      precio: { $gte: min, $lte: max },
    };

    if (tipo) query.tipo = tipo;
    if (fecha) {
      // Solo gastos del día
      const start = new Date(fecha);
      const end = new Date(fecha);
      end.setHours(23, 59, 59, 999);
      query.fecha = { $gte: start, $lte: end };
    }

    const gastos = await collection.find(query).toArray();

    // Compatibilidad: incluir gastos de MP derivados de presupuestos (aunque no exista
    // el registro físico en "gastos"), para que siempre se vean en historial.
    const clientesCollection = db.collection("clientes");
    const presupuestos = await clientesCollection
      .find({ problemType: "presupuesto" })
      .toArray();

    const existingMpIds = new Set(
      gastos
        .filter((g) => g?.tipo === "materiaPrimaPresupuesto" && g?.presupuestoClienteId)
        .map((g) => String(g.presupuestoClienteId))
    );

    const extraDesdePresupuesto = presupuestos
      .map((c) => {
        const presupuestoId = String(c._id);
        if (existingMpIds.has(presupuestoId)) return null;

        const totalMP = Number(
          c?.presupuestoGanancia?.totalMateriaPrima ??
            (Array.isArray(c?.materiaPrimaDetalle)
              ? c.materiaPrimaDetalle.reduce((acc, item) => {
                  const precio = Number(item?.precio) || 0;
                  const cantidad = Number(item?.cantidad);
                  const qty = Number.isFinite(cantidad) && cantidad > 0 ? cantidad : 1;
                  return acc + precio * qty;
                }, 0)
              : 0)
        );

        if (!Number.isFinite(totalMP) || totalMP <= 0) return null;

        return {
          _id: `virtual-${presupuestoId}`,
          tipo: "materiaPrimaPresupuesto",
          cliente: c?.clientName || "",
          sucursal: c?.branch || "",
          fecha: c?.date ? new Date(c.date) : new Date(),
          precio: totalMP,
          montoMateriaPrima: totalMP,
          gastoTotal: totalMP,
          descripcion: `Materia prima presupuesto - ${c?.clientName || "cliente"}`,
          presupuestoClienteId: c._id,
          virtual: true,
          materiaPrimaDetalle: Array.isArray(c?.materiaPrimaDetalle)
            ? c.materiaPrimaDetalle
            : [],
        };
      })
      .filter(Boolean)
      .filter((g) => {
        if (tipo && g.tipo !== tipo) return false;
        const precioNum = Number(g.precio) || 0;
        if (precioNum < min || precioNum > max) return false;
        if (fecha) {
          const start = new Date(fecha);
          const end = new Date(fecha);
          end.setHours(23, 59, 59, 999);
          const f = new Date(g.fecha);
          if (f < start || f > end) return false;
        }
        return true;
      });

    return NextResponse.json([...gastos, ...extraDesdePresupuesto]);
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    return NextResponse.json(
      { error: "Error al obtener gastos" },
      { status: 500 }
    );
  }
}
