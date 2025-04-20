// /src/app/api/login/route.js
import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/mongodb"; // Solo para el backend

export async function POST(req) {
  const { username, password } = await req.json();

  const client = await clientPromise; // Este código solo debe ejecutarse en el servidor
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

  // Código para crear una sesión y devolver una respuesta
  return new Response(JSON.stringify({ username: user.username }), {
    status: 200,
  });
}
