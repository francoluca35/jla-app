"use client";
import React, { useEffect, useState } from "react";
import { useClientes } from "@/hooks/useClient";
import { useGastos } from "../../../hooks/UseGastos";
import useIngresos from "@/hooks/useIngresos";

function TabsEstadisticas() {
  const { clientes, calcularClientesNuevos } = useClientes();
  const { calcularGastosPorSemanaYMes } = useGastos({});
  const { data } = useIngresos(); // Usamos el estado 'data' de 'useIngresos'

  // Función para obtener el primer día del mes y el último día del mes
  const getPrimerYUltimoDiaDelMes = (fecha) => {
    const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    return { primerDia, ultimoDia };
  };

  // Función para obtener el rango de fechas de la semana (Lunes - Domingo)
  const getRangoDeSemana = (fecha) => {
    const inicioSemana = fecha.getDate() - fecha.getDay() + 1; // Lunes de la semana
    const finSemana = inicioSemana + 5; // Domingo de la semana
    const primerDiaSemana = new Date(fecha.setDate(inicioSemana));
    const ultimoDiaSemana = new Date(fecha.setDate(finSemana));
    return { primerDiaSemana, ultimoDiaSemana };
  };

  // Fecha actual
  const hoy = new Date();

  const { primerDia, ultimoDia } = getPrimerYUltimoDiaDelMes(hoy);
  const { primerDiaSemana, ultimoDiaSemana } = getRangoDeSemana(hoy);

  const [ingresos, setIngresos] = useState({ semanal: 0, mensual: 0 });
  const [clientesNuevos, setClientesNuevos] = useState({
    semanal: 0,
    mensual: 0,
  });
  const [gastos, setGastos] = useState({ semanal: 0, mensual: 0 });

  useEffect(() => {
    if (!data || !data.clientes) return;

    const { nuevosPorSemana, nuevosPorMes } = calcularClientesNuevos(
      primerDiaSemana,
      ultimoDiaSemana,
      primerDia,
      ultimoDia
    );
    const { totalPorSemana: totalGastosSemana, totalPorMes: totalGastosMes } =
      calcularGastosPorSemanaYMes(
        primerDiaSemana,
        ultimoDiaSemana,
        primerDia,
        ultimoDia
      );

    // Calcular ingresos por semana y mes
    const calcularIngresosPorSemanaYMes = () => {
      // Para la semana actual
      const ingresosPorSemana = data.clientes
        .filter((cliente) => {
          const date = new Date(cliente.fecha); // Filtramos por fecha
          return date >= primerDiaSemana && date <= ultimoDiaSemana;
        })
        .reduce((acc, curr) => acc + (curr.amount || 0), 0);

      const ingresosPorMes = data.clientes
        .filter((cliente) => {
          const date = new Date(cliente.fecha);
          return date >= primerDia && date <= ultimoDia;
        })
        .reduce((acc, curr) => acc + (curr.amount || 0), 0);

      return { ingresosPorSemana, ingresosPorMes };
    };

    const { ingresosPorSemana, ingresosPorMes } =
      calcularIngresosPorSemanaYMes();

    setClientesNuevos({
      semanal: nuevosPorSemana || 0,
      mensual: nuevosPorMes || 0,
    });
    setGastos({
      semanal: totalGastosSemana || 0,
      mensual: totalGastosMes || 0,
    });
    setIngresos({
      semanal: ingresosPorSemana || 0,
      mensual: ingresosPorMes || 0,
    });
  }, [calcularClientesNuevos, calcularGastosPorSemanaYMes, data]);

  return (
    <div>
      {/* Tabla */}
      <div className="bg-verdefluor bg-opacity-90 rounded-lg p-6 backdrop-blur-md shadow-lg text-sm w-full max-w-xs text-white">
        <table className="table-auto border-collapse w-full text-center">
          <thead>
            <tr>
              <th className="p-2 border border-white/30">Datos</th>
              <th className="p-2 border border-white/30">Semanal</th>
              <th className="p-2 border border-white/30">Mensual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-white/30">Clientes</td>
              <td className="p-2 border border-white/30">
                {clientesNuevos.semanal || "No hay datos"}
              </td>
              <td className="p-2 border border-white/30">
                {clientesNuevos.mensual || "No hay datos"}
              </td>
            </tr>
            <tr>
              <td className="p-2 border border-white/30">Gastos</td>
              <td className="p-2 border border-white/30">
                {gastos.semanal || "No hay datos"}
              </td>
              <td className="p-2 border border-white/30">
                {gastos.mensual || "No hay datos"}
              </td>
            </tr>
            <tr>
              <td className="p-2 border border-white/30">Ingresos</td>
              <td className="p-2 border border-white/30">
                {ingresos.semanal || "No hay datos"}
              </td>
              <td className="p-2 border border-white/30">
                {ingresos.mensual || "No hay datos"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabsEstadisticas;
