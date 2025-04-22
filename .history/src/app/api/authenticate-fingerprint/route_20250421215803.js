import { Fido2Lib } from "fido2-lib";
import clientPromise from "../../../../lib/mongodb";

const fido2 = new Fido2Lib();

export async function POST(req, res) {
  try {
    const { username, credential } = await req.json();

    // Conexión a la base de datos
    const client = await clientPromise;
    const db = client.db("jlapp");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verifica si el usuario tiene credenciales de WebAuthn registradas
    if (!user.webAuthnCredential) {
      return res.status(404).json({ error: "Huella digital no registrada" });
    }

    // Verifica la credencial de la huella digital
    const verificationResult = await fido2.assertionResult(
      credential,
      user.webAuthnCredential
    );

    if (verificationResult.valid) {
      return res.status(200).json({ username: user.username, role: user.role });
    } else {
      return res.status(401).json({ error: "Autenticación fallida" });
    }
  } catch (error) {
    console.error("🚨 Error al autenticar huella digital:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
