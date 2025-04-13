import clientPromise from "../../../../lib/mongodb.js";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const client = await clientPromise;
    const db = client.db("jla-app");
    const usersCollection = db.collection("users");

    // Buscar usuario directamente como documento (estructura recomendada)
    const user = await usersCollection.findOne({ username, password });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Usuario o contraseña incorrectos" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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
