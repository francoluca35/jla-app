import { useState, useEffect } from "react";

function useIngresos() {
  const [data, setData] = useState({
    totalTodos: 0,
    totalArreglo: 0,
    totalPresupuesto: 0,
  });
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    fetch("/api/ingresos")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error al cargar ingresos", err));
  }, []);

  const calcularTotal = () => {
    switch (filtro) {
      case "todos":
        return data.totalTodos;
      case "arreglo":
        return data.totalArreglo;
      case "presupuesto":
        return data.totalPresupuesto;
      default:
        return 0;
    }
  };

  return { data, calcularTotal, setFiltro, filtro };
}

export default useIngresos;
