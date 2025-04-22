import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  const { username, credential } = await req.json();

  // Validar que se haya recibido la credencial
  if (!credential) {
    return new Response(JSON.stringify({ error: "Credencial no recibida" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

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

  // Guardar la credencial WebAuthn en la base de datos
  await usersCollection.updateOne(
    { username },
    { $set: { webAuthnCredential: credential } }
  );

  return new Response(
    JSON.stringify({
      success: true,
      message: "Credencial guardada exitosamente",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
