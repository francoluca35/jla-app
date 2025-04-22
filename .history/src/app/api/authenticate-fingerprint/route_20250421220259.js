import { Fido2Lib } from "fido2-lib";
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

const fido2 = new Fido2Lib();

export async function POST(req) {
  try {
    const { username, credential } = await req.json();

    const client = await clientPromise;
    const db = client.db("jlapp");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (!user.webAuthnCredential) {
      return NextResponse.json(
        { error: "Huella digital no registrada" },
        { status: 404 }
      );
    }

    const verificationResult = await fido2.assertionResult(
      credential,
      user.webAuthnCredential
    );

    if (verificationResult.valid) {
      return NextResponse.json(
        { username: user.username, role: user.role },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Autenticación fallida" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("🚨 Error al autenticar huella digital:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
