import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const { username, actual, nueva } = await req.json();

    const client = await clientPromise;
    const db = client.db("jlapp");
    const collection = db.collection("users");

    // Buscar al usuario por su username
    const user = await collection.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si la contraseña actual es correcta (sin bcrypt)
    if (actual !== user.password) {
      return NextResponse.json(
        { error: "Contraseña actual incorrecta" },
        { status: 401 }
      );
    }

    // Actualizar la contraseña con la nueva
    await collection.updateOne(
      { username },
      { $set: { password: nueva } } // Guardar la nueva contraseña directamente
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    return NextResponse.json(
      { error: "Error al cambiar la contraseña" },
      { status: 500 }
    );
  }
}
