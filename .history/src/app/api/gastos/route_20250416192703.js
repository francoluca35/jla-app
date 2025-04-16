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

    return NextResponse.json(gastos);
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    return NextResponse.json(
      { error: "Error al obtener gastos" },
      { status: 500 }
    );
  }
}
