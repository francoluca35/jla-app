// /hooks/useCambiarPassword.js
import { useState } from "react";

export default function useCambiarPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const cambiarPassword = async (nueva) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("authToken"); // Obtener el token de localStorage

    try {
      const res = await fetch("/api/cambiar-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el header
        },
        body: JSON.stringify({ nueva }),
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
