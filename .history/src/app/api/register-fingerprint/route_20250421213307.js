// /pages/api/register-fingerprint.js
import { Fido2Lib } from "fido2-lib";
import clientPromise from "../../../../lib/mongodb";

const fido2 = new Fido2Lib();

export async function POST(req) {
  try {
    const { username } = await req.json();

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

    const registrationOptions = await fido2.attestationOptions();

    // Guardar las opciones de registro y el desafío en la base de datos
    await usersCollection.updateOne(
      { username },
      { $set: { registrationOptions } }
    );

    return new Response(JSON.stringify({ registrationOptions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al registrar huella", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
