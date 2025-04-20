"use client";
import { serialize } from "cookie";
import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  const { username, password } = await req.json();

  const client = await clientPromise;
  const db = client.db("jlapp");
  const collection = db.collection("users");

  const user = await collection.findOne({ username });
  if (!user) {
    return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
      status: 404,
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
      status: 401,
    });
  }

  // Crear un identificador de sesión único
  const sessionId = new Date().getTime().toString();

  // Guardar la sesión en la base de datos
  await db.collection("sessions").insertOne({ sessionId, username });

  // Crear la cookie de sesión
  const cookie = serialize("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Set-Cookie": cookie,
    },
  });
}
