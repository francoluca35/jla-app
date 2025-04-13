// route.js
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const client = await clientPromise;
    const db = client.db("ventapasajes");
    const usersCollection = db.collection("users");

    const userData = await usersCollection.findOne({
      "users.username": username,
      "users.password": password,
    });

    if (!userData) {
      return new Response(
        JSON.stringify({ error: "Usuario o contraseña incorrectos" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = userData.users.find((u) => u.username === username);

    return new Response(
      JSON.stringify({ username: user.username, role: user.role }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("🚨 Error en autenticación:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
