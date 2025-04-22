// /api/authenticate-fingerprint
import { Fido2Lib } from "fido2-lib";
import clientPromise from "../../../../lib/mongodb";

const fido2 = new Fido2Lib();

export async function POST(req) {
  try {
    const { username } = await req.json(); // Obtener el username del frontend

    // Verificar que el usuario existe en la base de datos
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

    const challenge = user.registrationOptions.challenge;
    if (!challenge) {
      return new Response(JSON.stringify({ error: "Challenge no recibido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verificar si el challenge se generó correctamente
    console.log("Challenge generado en el backend:", challenge);

    return new Response(
      JSON.stringify({ challenge }), // Enviar el challenge al frontend
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al autenticar huella digital:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
