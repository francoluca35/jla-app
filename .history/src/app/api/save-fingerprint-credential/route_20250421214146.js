import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  const { username, credential } = await req.json();

  // Guardar la credencial WebAuthn en la base de datos
  const client = await clientPromise;
  const db = client.db("jlapp");
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ username });

  if (!user) {
    return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  await usersCollection.updateOne(
    { username },
    { $set: { webAuthnCredential: credential } }
  );

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
