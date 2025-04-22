// /pages/api/login.js
import { Fido2Lib } from "fido2-lib";
import clientPromise from "../../../../lib/mongodb";

const fido2 = new Fido2Lib();

export async function POST(req) {
  try {
    const { username, password, credential } = await req.json();

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

    if (password) {
      // Verifica la contraseña si es proporcionada
      if (user.password !== password) {
        return new Response(
          JSON.stringify({ error: "Contraseña incorrecta" }),
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
    }

    if (credential) {
      // Verificación de WebAuthn si se proporciona un credential
      const verificationResult = await fido2.attestationResult(
        credential,
        user.registrationOptions
      );

      if (verificationResult.valid) {
        return new Response(
          JSON.stringify({ username: user.username, role: user.role }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(
          JSON.stringify({ error: "Autenticación fallida" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
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
