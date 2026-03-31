import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const { confirmacion } = await req.json();

    if (confirmacion !== "BORRAR TODO") {
      return NextResponse.json(
        { error: "Confirmación inválida." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("jlapp");

    const [clientesResult, gastosResult, ventasResult] = await Promise.all([
      db.collection("clientes").deleteMany({}),
      db.collection("gastos").deleteMany({}),
      db.collection("ventas").deleteMany({}),
    ]);

    return NextResponse.json({
      ok: true,
      mensaje:
        "Datos métricos reiniciados. Usuario y contraseña se mantienen.",
      clientesEliminados: clientesResult.deletedCount ?? 0,
      gastosEliminados: gastosResult.deletedCount ?? 0,
      ventasEliminadas: ventasResult.deletedCount ?? 0,
    });
  } catch (error) {
    console.error("Error al reiniciar datos:", error);
    return NextResponse.json(
      { error: "Error interno al reiniciar datos." },
      { status: 500 }
    );
  }
}
