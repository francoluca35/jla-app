"use client";
import { useState, useEffect } from "react";

function useIngresos() {
  const [data, setData] = useState({ clientes: [] });
  const [filtro, setFiltro] = useState("todos");
  const [subFiltro, setSubFiltro] = useState("todos");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/ingresos");
      const json = await res.json();
      setData(json || { clientes: [] });
    } catch (err) {
      console.error("Error al cargar ingresos", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calcularTotal = () => {
    if (!data) return 0;

    // Para "arreglo", siempre se suman los montos, sin importar el estado
    if (filtro === "arreglo") {
      return data.clientes
        .filter((cliente) => cliente.problemType === "arreglo")
        .reduce((total, cliente) => total + cliente.amount, 0);
    }

    // Para "presupuesto", solo se suman aquellos con estado "terminado"
    if (filtro === "presupuesto") {
      if (subFiltro === "todos") {
        return data.clientes
          .filter(
            (cliente) =>
              cliente.problemType === "presupuesto" &&
              cliente.estado === "terminado"
          )
          .reduce((total, cliente) => total + cliente.amount, 0);
      }

      if (subFiltro === "seña") {
        return data.clientes
          .filter(
            (cliente) =>
              cliente.problemType === "presupuesto" &&
              cliente.paymentOption === "seña" &&
              cliente.estado === "terminado"
          )
          .reduce((total, cliente) => total + cliente.amount, 0);
      }

      if (subFiltro === "pago total") {
        return data.clientes
          .filter(
            (cliente) =>
              cliente.problemType === "presupuesto" &&
              cliente.paymentOption === "pago total" &&
              cliente.estado === "terminado"
          )
          .reduce((total, cliente) => total + cliente.amount, 0);
      }
    }

    return 0;
  };

  const obtenerFiltrados = () => {
    if (!data?.clientes || !Array.isArray(data.clientes)) return [];

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

      const text = await res.text();
      if (text) {
        const json = JSON.parse(text);
        console.log("Respuesta eliminación:", json);
      }

      fetchData(); // refrescar
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
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Error al editar ingreso:", err);
    }
  };

  const calcularTotalCombinado = () => {
    if (!data || !data.clientes) return 0;

    // Calcular total de "arreglos"
    const totalArreglos = data.clientes
      .filter((cliente) => cliente.problemType === "arreglo")
      .reduce((total, cliente) => total + cliente.amount, 0);

    // Calcular total de "presupuestos" con estado "terminado"
    const totalPresupuestos = data.clientes
      .filter(
        (cliente) =>
          cliente.problemType === "presupuesto" &&
          cliente.estado === "terminado"
      )
      .reduce((total, cliente) => total + cliente.amount, 0);

    // Retornar el total combinado
    return totalArreglos + totalPresupuestos;
  };

  return {
    calcularTotal,
    calcularTotalCombinado,
    obtenerFiltrados,
    setFiltro,
    filtro,
    setSubFiltro,
    subFiltro,
    eliminarIngreso,
    editarIngreso,
  };
}

export default useIngresos;
