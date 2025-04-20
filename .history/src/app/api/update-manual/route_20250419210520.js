import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("jlapp");
    const users = db.collection("users");

    const nuevaPassword = "1234"; // contraseña actual que querés usar
    const hash = await bcrypt.hash(nuevaPassword, 10);

    const result = await users.updateOne(
      { username: "jlatec" },
      { $set: { password: hash } }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error actualizando manualmente:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
