// hooks/useGastos.js
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

        const url = `/api/gastos${query.length ? "?" + query.join("&") : ""}`;

        const res = await fetch(url);
        const data = await res.json();
        // Convertir fechas de string a Date
        const gastosConFechas = data.map((g) => ({
          ...g,
          fecha: new Date(g.fecha),
        }));
        setGastos(gastosConFechas);
      } catch (error) {
        console.error("Error fetching gastos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, [tipo, fecha, min, max]);

  return { gastos, loading };
};
