// /api/authenticate-fingerprint
export async function POST(req) {
  try {
    const { username } = await req.json(); // Obtener el username del frontend

    // Verificar que el usuario existe en la base de datos
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Obtener el challenge del usuario en la base de datos
    const challenge = user.registrationOptions.challenge;
    console.log("Challenge generado en el backend: ", challenge); // Asegúrate de que el challenge esté aquí

    if (!challenge) {
      return new Response(JSON.stringify({ error: "Challenge no recibido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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
