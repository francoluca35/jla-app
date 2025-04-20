// 📁 /hooks/useCambiarPassword.js
import { useState } from "react";

export default function useCambiarPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const cambiarPassword = async (actual, nueva) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actual, nueva }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error inesperado");
        return false;
      }

      setSuccess(true);
      return true;
    } catch (err) {
      setError("Error al conectar con el servidor");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { cambiarPassword, loading, error, success };
}
