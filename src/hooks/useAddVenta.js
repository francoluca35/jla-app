import { useState } from "react";

export default function useAddVenta() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addVenta = async (venta) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venta),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Error al guardar la venta");
      }

      setSuccess(true);
      return { success: true, data };
    } catch (err) {
      setError(err.message || "Error al guardar la venta");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { addVenta, loading, error, success };
}
