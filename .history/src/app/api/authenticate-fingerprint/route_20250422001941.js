// /api/authenticate-fingerprint

import { Fido2Lib } from "fido2-lib";
import clientPromise from "../../../../lib/mongodb";
const fido2 = new Fido2Lib();

export async function POST(req) {
  try {
    const { username, credential } = await req.json();

    if (!credential || !credential.id || !credential.rawId || !credential.response) {
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

    // El challenge debe ser proporcionado a partir de las opciones de registro del usuario
    const challenge = user.registrationOptions.challenge;
    if (!challenge) {
      return new Response(JSON.stringify({ error: "No se recibió un challenge" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Aquí podrías agregar el paso de la validación de la huella digital
    // Verificar si el credential es válido

    return new Response(
      JSON.stringify({ challenge }),
      { status: 200, headers: { "Content-Type": "application
