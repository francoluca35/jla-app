export async function POST(req) {
  try {
    const { username, credential } = await req.json();

    // Verifica que la credencial tenga los campos necesarios
    if (
      !credential ||
      !credential.id ||
      !credential.rawId ||
      !credential.response
    ) {
      return new Response(JSON.stringify({ error: "Credential incompleta" }), {
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

    // Verificación del challenge
    const challenge = user.registrationOptions?.challenge;
    if (!challenge) {
      return new Response(JSON.stringify({ error: "Challenge no recibido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Challenge recibido desde el backend:", challenge);

    // Verificar la autenticación del credential
    const verificationResult = await fido2.assertionResult(
      credential,
      user.webAuthnCredential,
      { expectedFactor: "either" }
    );

    if (verificationResult.valid) {
      return new Response(
        JSON.stringify({ username: user.username, role: user.role }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(JSON.stringify({ error: "Autenticación fallida" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("🚨 Error al autenticar huella digital:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
