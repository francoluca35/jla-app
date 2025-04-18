// app/api/gastos/[id]/route.js
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "jlapp";

export async function PUT(req, context) {
  try {
    const { id } = context.params;
    const data = await req.json();

    // Evitar modificar el campo _id
    delete data._id;

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("gastos");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No se encontró el gasto o no hubo cambios" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Gasto actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar gasto:", error);
    return NextResponse.json(
      { error: "Error al actualizar gasto" },
      { status: 500 }
    );
  }
}
