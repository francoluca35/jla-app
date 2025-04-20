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

  const calcularIngresosPorSemanaYMes = () => {
    const ahora = new Date();
    const semanaInicio = new Date(ahora);
    semanaInicio.setDate(ahora.getDate() - ahora.getDay()); // Lunes de la semana actual
    const mesInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1); // Primer día del mes actual

    const ingresosPorSemana = data.clientes.filter((cliente) => {
      const fechaIngreso = new Date(cliente.fechaIngreso);
      return fechaIngreso >= semanaInicio;
    });

    const ingresosPorMes = data.clientes.filter((cliente) => {
      const fechaIngreso = new Date(cliente.fechaIngreso);
      return fechaIngreso >= mesInicio;
    });

    // Calcular ingresos por semana y mes
    const totalIngresosSemana = ingresosPorSemana.reduce(
      (acc, cliente) => acc + cliente.monto,
      0
    );
    const totalIngresosMes = ingresosPorMes.reduce(
      (acc, cliente) => acc + cliente.monto,
      0
    );

    return {
      totalPorSemana: totalIngresosSemana,
      totalPorMes: totalIngresosMes,
    };
  };

  return {
    calcularIngresosPorSemanaYMes,
    setFiltro,
    filtro,
    setSubFiltro,
    subFiltro,
  };
}

export default useIngresos;
