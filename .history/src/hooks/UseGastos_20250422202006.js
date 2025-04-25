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

  const calcularGastosPorSemanaYMes = () => {
    const ahora = new Date();
    const semanaInicio = new Date(ahora);
    semanaInicio.setDate(ahora.getDate() - ahora.getDay()); // Lunes de la semana actual
    const mesInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1); // Primer día del mes actual

    const gastosPorSemana = gastos.filter((gasto) => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto >= semanaInicio;
    });

    const gastosPorMes = gastos.filter((gasto) => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto >= mesInicio;
    });

    // Sumar los gastos por semana y por mes
    const totalGastosSemana = gastosPorSemana.reduce(
      (acc, gasto) => acc + gasto.monto,
      0
    );
    const totalGastosMes = gastosPorMes.reduce(
      (acc, gasto) => acc + gasto.monto,
      0
    );

    return {
      totalPorSemana: totalGastosSemana,
      totalPorMes: totalGastosMes,
    };
  };

  return { gastos, loading, calcularGastosPorSemanaYMes }; // Devuelve los cálculos
};
