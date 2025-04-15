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
        const data = await res.json();
        const gastosConFechas = data.map((g) => ({
          ...g,
          fecha: new Date(g.fecha),
        }));
        setGastos(gastosConFechas);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, [tipo, fecha, min, max]);

  return { gastos, loading };
};
