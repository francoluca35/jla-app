"use client";
import { useState, useEffect } from "react";

function useIngresos() {
  const [data, setData] = useState(null);
  const [filtro, setFiltro] = useState("todos");
  const [subFiltro, setSubFiltro] = useState("todos");

  useEffect(() => {
    fetch("/api/ingresos")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => console.error("Error al cargar ingresos", err));
  }, []);

  const calcularTotal = () => {
    if (!data) return 0;
    if (filtro === "todos") return data.totalTodos;
    if (filtro === "arreglo") return data.totalArreglo;
    if (filtro === "presupuesto") {
      if (subFiltro === "todos") return data.totalPresupuesto;
      if (subFiltro === "seña") return data.totalPresupuestoSeña;
      if (subFiltro === "pago total") return data.totalPresupuestoPagoTotal;
    }
    return 0;
  };

  return { calcularTotal, setFiltro, filtro, setSubFiltro, subFiltro };
}

export default useIngresos;
