import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/mongodb";

const secretKey = process.env.JWT_SECRET_KEY || "your_secret_key"; // Usa la misma clave secreta

export async function POST(req) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1]; // Obtén el token de la cabecera

    if (!token) {
      return new Response(JSON.stringify({ error: "Token no proporcionado" }), {
        status: 401,
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, secretKey);
    if (!decoded) {
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 401,
      });
    }

    const { username, actual, nueva } = await req.json();
    const client = await clientPromise;
    const db = client.db("jlapp");
    const collection = db.collection("users");

    const user = await collection.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
        status: 404,
      });
    }

    // Comparar la contraseña actual con la almacenada en la base de datos
    const match = await bcrypt.compare(actual, user.password);
    if (!match) {
      return new Response(
        JSON.stringify({ error: "Contraseña actual incorrecta" }),
        {
          status: 401,
        }
      );
    }

    // Encriptar la nueva contraseña
    const hashed = await bcrypt.hash(nueva, 10);

    // Actualizar la contraseña en la base de datos
    await collection.updateOne({ username }, { $set: { password: hashed } });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error cambiando contraseña:", err);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
