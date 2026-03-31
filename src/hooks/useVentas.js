import { useEffect, useState } from "react";

export default function useVentas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ventas");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al obtener ventas");
      setVentas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al obtener ventas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  return { ventas, loading, error, refetch: fetchVentas };
}
