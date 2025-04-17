// /app/api/nombres/route.js
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("jlapp");
    const collection = db.collection("clientes");

    const nombres = await collection.distinct("clientName");

    return NextResponse.json(nombres);
  } catch (error) {
    console.error("Error al obtener nombres:", error);
    return NextResponse.json([], { status: 500 });
  }
}
