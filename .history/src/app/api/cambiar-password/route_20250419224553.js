import { parse } from "cookie";
import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const token = req.headers.get("Authorization")?.split(" ")[1]; // Obtener token del header

    if (!token) {
      return new Response(
        JSON.stringify({ error: "No autorizado, sesión no válida" }),
        { status: 401 }
      );
    }

    // Validar JWT token aquí, si usas JWT
    // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { username, actual, nueva } = await req.json();
    const client = await clientPromise;
    const db = client.db("jlapp");

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
