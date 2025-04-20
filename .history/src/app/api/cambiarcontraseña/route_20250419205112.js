import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { actual, nueva } = await req.json();
    const client = await clientPromise;
    const db = client.db("jlapp");
    const adminCollection = db.collection("users");

    const admin = await adminCollection.updateOne(
      { username: "jlatec" }, // ✅ este es tu usuario real
      { $set: { password: hashed } }
    );

    if (!admin) {
      return NextResponse.json(
        { error: "Administrador no encontrado" },
        { status: 404 }
      );
    }

    // 🔍 Verificar contraseña actual
    const match = await bcrypt.compare(actual, admin.password);
    if (!match) {
      return NextResponse.json(
        { error: "Contraseña actual incorrecta" },
        { status: 401 }
      );
    }

    // 🔐 Hashear nueva contraseña
    const hashed = await bcrypt.hash(nueva, 10);

    await adminCollection.updateOne(
      { username: "admin" },
      { $set: { password: hashed } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error actualizando contraseña:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
