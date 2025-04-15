// app/api/gastos/route.js
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "jlapp";

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
