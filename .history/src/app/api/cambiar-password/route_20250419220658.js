// /src/app/api/cambiar-password/route.js
import { parse } from "cookie";
import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/mongodb"; // Asegúrate de que MongoDB esté en el backend

export async function POST(req) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const sessionId = cookies.sessionId;

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "No autorizado, sesión no válida" }),
        { status: 401 }
      );
    }

    const client = await clientPromise; // Esto se conecta a MongoDB solo en el servidor
    const db = client.db("jlapp");
    const session = await db.collection("sessions").findOne({ sessionId });

    if (!session) {
      return new Response(JSON.stringify({ error: "Sesión no válida" }), {
        status: 401,
      });
    }

    const { username, actual, nueva } = await req.json();
    const user = await db.collection("users").findOne({ username });

    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
        status: 404,
      });
    }

    const match = await bcrypt.compare(actual, user.password);
    if (!match) {
      return new Response(
        JSON.stringify({ error: "Contraseña actual incorrecta" }),
        { status: 401 }
      );
    }

    const hashed = await bcrypt.hash(nueva, 10);
    await db
      .collection("users")
      .updateOne({ username }, { $set: { password: hashed } });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error cambiando contraseña:", err);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
