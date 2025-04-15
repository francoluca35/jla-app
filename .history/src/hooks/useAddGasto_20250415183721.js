import { useState } from "react";

const useAddGasto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addGasto = async (gasto) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/gastos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gasto),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al guardar gasto");

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addGasto, loading, error, success };
};

export default useAddGasto;
