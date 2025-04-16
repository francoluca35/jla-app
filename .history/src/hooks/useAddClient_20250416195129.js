import { useState } from "react";

function useAddClient() {
  const [loading, setLoading] = useState(false);

  const addClient = async (formData) => {
    setLoading(true);

    try {
      const res = await fetch("/api/addclient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, error: data?.error || "Error al guardar" };
      }
    } catch (err) {
      return { success: false, error: "Error de conexión con el servidor" };
    } finally {
      setLoading(false);
    }
  };

  return { addClient, loading };
}

export default useAddClient;
