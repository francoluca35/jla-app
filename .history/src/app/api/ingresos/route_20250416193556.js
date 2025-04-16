import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "jlapp";

export async function POST(req) {
  try {
    const data = await req.json();
    await client.connect();
    const db = client.db(dbName);
    const result = await db.collection("clientes").insertOne(data);

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
    const objectIds = ids.map((id) => new ObjectId(id));

    await client.connect();
    const db = client.db(dbName);
    await db.collection("clientes").deleteMany({ _id: { $in: objectIds } });

    return NextResponse.json({ message: "Eliminados correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, data } = await req.json();

    await client.connect();
    const db = client.db(dbName);
    await db
      .collection("clientes")
      .updateOne({ _id: new ObjectId(id) }, { $set: data });

    return NextResponse.json({ message: "Ingreso actualizado" });
  } catch (error) {
    console.error("Error al actualizar ingreso:", error);
    return NextResponse.json(
      { error: "Error al actualizar ingreso" },
      { status: 500 }
    );
  }
}
