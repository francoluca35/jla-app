import { useEffect, useState } from "react";

const useIngresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [subFiltro, setSubFiltro] = useState("todos");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/ingresos");
      const data = await res.json();
      setIngresos(data.clientes || []);
    } catch (error) {
      console.error("Error al traer ingresos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const obtenerFiltrados = () => {
    let filtrados = ingresos;

    if (filtro === "arreglo") {
      filtrados = ingresos.filter((i) => i.problemType === "arreglo");
    } else if (filtro === "presupuesto") {
      filtrados = ingresos.filter((i) => i.problemType === "presupuesto");
      if (subFiltro !== "todos") {
        filtrados = filtrados.filter((i) => i.paymentOption === subFiltro);
      }
    }

    return filtrados;
  };

  const calcularTotal = () => {
    return obtenerFiltrados().reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0
    );
  };

  const eliminarIngreso = async (ids) => {
    try {
      const res = await fetch("/api/ingresos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (res.ok) fetchData(); // actualiza la lista
    } catch (error) {
      console.error("Error al eliminar ingresos:", error);
    }
  };

  const editarIngreso = async (id, data) => {
    try {
      const res = await fetch("/api/ingresos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, data }),
      });
      const json = await res.json();
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Error al editar ingreso:", err);
    }
  };

  return {
    ingresos,
    filtro,
    setFiltro,
    subFiltro,
    setSubFiltro,
    obtenerFiltrados,
    calcularTotal,
    eliminarIngreso,
    editarIngreso,
  };
};

export default useIngresos;
