import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    const match = await bcrypt.compare(actual, user.password);
    if (!match) {
      return NextResponse.json(
        { error: "Contraseña actual incorrecta" },
        { status: 401 }
      );
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(nueva, 10);

    // Actualizar la contraseña en la base de datos
    await collection.updateOne(
      { username },
      { $set: { password: hashedPassword } }
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
