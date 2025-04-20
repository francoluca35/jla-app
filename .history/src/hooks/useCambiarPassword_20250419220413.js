// hooks/useCambiarPassword.js
import { useState } from "react";

export default function useCambiarPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const cambiarPassword = async (username, actual, nueva) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/cambiar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, actual, nueva }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error inesperado");
        return { success: false, error: data.error };
      }

      setSuccess(true);
      return { success: true };
    } catch (err) {
      setError("Error al conectar con el servidor");
      return { success: false, error: "Error al conectar con el servidor" };
    } finally {
      setLoading(false);
    }
  };

  return { cambiarPassword, loading, error, success };
}
