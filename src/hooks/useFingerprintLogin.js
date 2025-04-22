import { useState } from "react";

export default function useFingerprintLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authenticateFingerprint = async (username) => {
    setLoading(true);
    setError(null);

    try {
      // Solicitar el challenge desde el backend
      const response = await fetch("/api/authenticate-fingerprint", {
        method: "POST",
        body: JSON.stringify({ username }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("Challenge recibido del backend:", data);

      if (!data.challenge) throw new Error("No se recibió un challenge");

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new TextEncoder().encode(data.challenge),
          allowCredentials: [
            {
              type: "public-key",
              id: new TextEncoder().encode(data.webAuthnCredential.id),
            },
          ],
          timeout: 60000,
        },
      });

      console.log("Credential creada:", credential);

      // Enviar la credencial al backend para autenticarla
      const authResponse = await fetch("/api/authenticate-fingerprint", {
        method: "POST",
        body: JSON.stringify({
          username,
          credential,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const authData = await authResponse.json();
      console.log("Resultado de la autenticación:", authData);

      if (authData.username) {
        return { success: true, user: authData };
      } else {
        throw new Error("Autenticación con huella fallida");
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    authenticateFingerprint,
    loading,
    error,
  };
}
