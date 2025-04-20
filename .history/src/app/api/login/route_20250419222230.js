// /src/app/api/login/route.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/mongodb";

// Clave secreta para firmar el JWT
const secretKey = process.env.JWT_SECRET_KEY;

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

  // /src/app/api/login/route.js
  const token = jwt.sign(
    { username: user.username, role: user.role },
    secretKey,
    { expiresIn: "1h" }
  );
  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
