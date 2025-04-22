"use client";
import { useState } from "react";

export default function RegisterFingerprint() {
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");

  const handleRegisterFingerprint = async () => {
    try {
      // Solicita el challenge al backend
      const response = await fetch("/api/register-fingerprint", {
        method: "POST",
        body: JSON.stringify({ username }),
        headers: { "Content-Type": "application/json" },
      });

      const { challenge } = await response.json();

      if (!challenge) throw new Error("Challenge no recibido");

      // Solicita al navegador que registre la huella digital con el challenge
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new TextEncoder().encode(challenge),
          rp: {
            name: "JLA WebAuthn",
          },
          user: {
            id: new TextEncoder().encode(username),
            name: username,
            displayName: username,
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        },
      });

      // Enviar la credencial al backend para guardarla
      await saveFingerprintCredential(username, credential);

      alert("Huella digital registrada correctamente!");
    } catch (err) {
      setError("Error al registrar huella digital: " + err.message);
    }
  };

  // Guardar la credencial en el backend
  const saveFingerprintCredential = async (username, credential) => {
    const response = await fetch("/api/save-fingerprint-credential", {
      method: "POST",
      body: JSON.stringify({ username, credential }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error("No se pudo guardar la credencial");
    }
  };

  return (
    <div className="register-fingerprint">
      <input
        type="text"
        placeholder="Ingrese su nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleRegisterFingerprint}>
        Registrar huella digital
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
