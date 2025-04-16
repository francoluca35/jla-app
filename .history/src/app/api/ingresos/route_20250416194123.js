import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "jlapp";

// MÉTODO GET
export async function GET() {
  try {
    const clientConn = await client.connect();
    const db = clientConn.db(dbName);
    const clientes = await db.collection("clientes").find().toArray();

    let totalTodos = 0;
    let totalArreglo = 0;
    let totalPresupuesto = 0;
    let totalPresupuestoSeña = 0;
    let totalPresupuestoPagoTotal = 0;

    clientes.forEach((cliente) => {
      if (cliente.amount) totalTodos += cliente.amount;
      if (cliente.problemType === "arreglo") {
        totalArreglo += cliente.amount || 0;
      } else if (cliente.problemType === "presupuesto") {
        if (cliente.paymentOption === "seña") {
          totalPresupuestoSeña += cliente.amount || 0;
        } else if (cliente.paymentOption === "pago total") {
          totalPresupuestoPagoTotal += cliente.amount || 0;
        }
        if (
          cliente.paymentOption === "seña" ||
          cliente.paymentOption === "pago total"
        ) {
          totalPresupuesto += cliente.amount || 0;
        }
      }
    });

    return NextResponse.json({
      clientes,
      totalTodos,
      totalArreglo,
      totalPresupuesto,
      totalPresupuestoSeña,
      totalPresupuestoPagoTotal,
    });
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// MÉTODO DELETE
export async function DELETE(req) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);

    const objectIds = ids.map((id) => new ObjectId(id));
    const result = await db.collection("clientes").deleteMany({
      _id: { $in: objectIds },
    });

    return NextResponse.json({
      message: "Eliminados correctamente",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error al eliminar ingresos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
