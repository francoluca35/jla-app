"use client";
import { useState, useEffect } from "react";

function useIngresos() {
  const [data, setData] = useState(null);
  const [filtro, setFiltro] = useState("todos");
  const [subFiltro, setSubFiltro] = useState("todos");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/ingresos");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error al cargar ingresos", err);
    }
  };

  useEffect(() => {
    fetchData();
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

  const obtenerFiltrados = () => {
    if (!data) return [];

    return data.clientes.filter((cliente) => {
      if (filtro === "todos") return true;
      if (filtro === "arreglo") return cliente.problemType === "arreglo";
      if (filtro === "presupuesto") {
        if (subFiltro === "todos") return cliente.problemType === "presupuesto";
        return (
          cliente.problemType === "presupuesto" &&
          cliente.paymentOption === subFiltro
        );
      }
      return false;
    });
  };

  const eliminarIngreso = async (ids) => {
    try {
      const res = await fetch("/api/ingresos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) throw new Error("Error al eliminar");

      // ✅ Solo intenta parsear si hay contenido
      const text = await res.text();
      if (text) {
        const json = JSON.parse(text);
        console.log("Respuesta eliminación:", json);
      }

      fetchData(); // actualiza la data
    } catch (error) {
      console.error("Error al eliminar ingresos:", error);
    }
  };

  const editarIngreso = async (id, dataEditada) => {
    try {
      const res = await fetch("/api/ingresos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, data: dataEditada }),
      });
      const json = await res.json();
      if (res.ok) fetchData(); // actualiza datos
    } catch (err) {
      console.error("Error al editar ingreso:", err);
    }
  };

  return {
    calcularTotal,
    obtenerFiltrados,
    setFiltro,
    filtro,
    setSubFiltro,
    subFiltro,
    eliminarIngreso,
    editarIngreso, // <-- ¡No te olvides de exportarla!
  };
}

export default useIngresos;
