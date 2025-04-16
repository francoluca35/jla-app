import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("jlapp");
  const clientes = await db.collection("clientes").find().toArray();
  return NextResponse.json(clientes);
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("jlapp");
    const result = await db
      .collection("clientes")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "No se encontró cliente" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error eliminando cliente:", error);
    return NextResponse.json(
      { success: false, error: "Error eliminando cliente" },
      { status: 500 }
    );
  }
}
