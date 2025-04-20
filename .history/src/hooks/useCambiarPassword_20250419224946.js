import { useState } from "react";

export default function useCambiarPassword() {
  const [loading, setLoading] = useState(false);

  const cambiarPassword = async (username, actual, nueva) => {
    setLoading(true);

    try {
      const response = await fetch("/api/cambiar-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, actual, nueva }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error desconocido");
      }

      return { success: true };
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { cambiarPassword, loading };
}
