import { useState } from "react";

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para hacer login con nombre de usuario y contraseña
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      return data; // Retorna los datos si el login fue exitoso
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para hacer login con huella digital
  const loginWithFingerprint = async (username, credential) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/authenticate-fingerprint", {
        method: "POST",
        body: JSON.stringify({ username, credential }), // Enviar la credencial al backend
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al autenticar con huella digital");
      }

      return data; // Retorna los datos si la autenticación fue exitosa
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loginWithFingerprint, loading, error };
}
