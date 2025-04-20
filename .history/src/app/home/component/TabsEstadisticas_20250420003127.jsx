"use client";
import React, { useEffect, useState } from "react";
import useClientes from "@/hooks/useClient";
import { useGastos } from "../../../hooks/UseGastos";
import useIngresos from "@/hooks/useIngresos";

function TabsEstadisticas() {
  const { clientes, calcularClientesNuevos } = useClientes();
  const { calcularGastosPorSemanaYMes } = useGastos({});
  const { data } = useIngresos(); // Usamos el estado 'data' de 'useIngresos'

  // Agregamos el estado para los ingresos
  const [ingresos, setIngresos] = useState({ semanal: 0, mensual: 0 });
  const [clientesNuevos, setClientesNuevos] = useState({
    semanal: 0,
    mensual: 0,
  });
  const [gastos, setGastos] = useState({ semanal: 0, mensual: 0 });

  useEffect(() => {
    // Verifica que 'data' y 'data.clientes' estén definidos
    if (!data || !data.clientes) return;

    // Calcular clientes nuevos, gastos e ingresos
    const { nuevosPorSemana, nuevosPorMes } = calcularClientesNuevos();
    const { totalPorSemana: totalGastosSemana, totalPorMes: totalGastosMes } =
      calcularGastosPorSemanaYMes();

    // Calcular ingresos por semana y mes
    const calcularIngresosPorSemanaYMes = () => {
      const ingresosPorSemana = data.clientes
        .filter((cliente) => {
          const date = new Date(cliente.fecha); // Suponiendo que la fecha de ingreso está en 'fecha'
          const today = new Date();
          const diffTime = Math.abs(today - date);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7; // Filtro para la semana
        })
        .reduce((acc, curr) => acc + (curr.amount || 0), 0);

      const ingresosPorMes = data.clientes
        .filter((cliente) => {
          const date = new Date(cliente.fecha);
          const today = new Date();
          const diffTime = Math.abs(today - date);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 30; // Filtro para el mes
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
  }, [calcularClientesNuevos, calcularGastosPorSemanaYMes, data]); // Se agregan las dependencias necesarias

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
                {clientesNuevos.semanal}
              </td>
              <td className="p-2 border border-white/30">
                {clientesNuevos.mensual}
              </td>
            </tr>
            <tr>
              <td className="p-2 border border-white/30">Gastos</td>
              <td className="p-2 border border-white/30">{gastos.semanal}</td>
              <td className="p-2 border border-white/30">{gastos.mensual}</td>
            </tr>
            <tr>
              <td className="p-2 border border-white/30">Ingresos</td>
              <td className="p-2 border border-white/30">{ingresos.semanal}</td>
              <td className="p-2 border border-white/30">{ingresos.mensual}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabsEstadisticas;
