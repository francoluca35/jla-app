"use client";
import { useState, useEffect } from "react";

export const useGastos = ({ tipo, fecha, min, max }) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        let query = [];
        if (tipo) query.push(`tipo=${tipo}`);
        if (fecha) query.push(`fecha=${fecha}`);
        if (min !== undefined) query.push(`min=${min}`);
        if (max !== undefined) query.push(`max=${max}`);

        const res = await fetch(`/api/gastos?${query.join("&")}`);
        const json = await res.json();
        const data = Array.isArray(json) ? json : json.data || [];

        const gastosConFechas = data.map((g) => ({
          ...g,
          fecha: new Date(g.fecha),
        }));

        setGastos(gastosConFechas);
      } catch (err) {
        console.error("Error al obtener gastos:", err);
        setGastos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, [tipo, fecha, min, max]);

  return { gastos, loading };
};
