import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/mongodb";

const secretKey = process.env.JWT_SECRET_KEY || "HTMK02#402332Ñ#"; // Asegúrate de poner tu clave secreta aquí

export async function POST(req) {
  const { username, password } = await req.json();

  const client = await clientPromise;
  const db = client.db("jlapp");
  const collection = db.collection("users");

  // Buscar el usuario en la base de datos
  const user = await collection.findOne({ username });
  if (!user) {
    return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
      status: 404,
    });
  }

  // Comparar la contraseña encriptada con la que se ingresó
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
      status: 401,
    });
  }

  // Generar un token JWT
  const token = jwt.sign(
    { username: user.username, role: user.role },
    secretKey,
    { expiresIn: "1h" }
  );

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
