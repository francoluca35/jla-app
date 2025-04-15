import { useEffect, useState } from "react";

function useIngresos() {
  const [data, setData] = useState(null);
  const [filtro, setFiltro] = useState("todos");

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

  return { calcularTotal, setFiltro, filtro };
}

export default useIngresos;
