// Ejemplo del backend en /api/authenticate-fingerprint
const { username, credential } = await req.json();

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

const user = await usersCollection.findOne({ username });

if (!user) {
  return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

// Aquí debe ser generado un challenge válido para la autenticación
const challenge = user.registrationOptions.challenge;
if (!challenge) {
  return new Response(JSON.stringify({ error: "Challenge no recibido" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}
console.log("Challenge generado: ", challenge);
return new Response(JSON.stringify({ challenge }), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});
