"use client";
import React, { useEffect, useState } from "react";
import useClientes from "@/hooks/useClient";
import { useGastos } from "../../../hooks/UseGastos";
import useIngresos from "@/hooks/useIngresos";

function TabsEstadisticas() {
  const { clientes, calcularClientesNuevos, calcularGastosEIngresos } =
    useClientes();
  const { data } = useIngresos(); // Usamos el estado 'data' de 'useIngresos'

  const hoy = new Date();

  // Obtener fechas dinámicamente para el mes y la semana
  const { primerDia, ultimoDia } = getPrimerYUltimoDiaDelMes(hoy);
  const { primerDiaSemana, ultimoDiaSemana } = getRangoDeSemana(hoy);

  const [clientesNuevos, setClientesNuevos] = useState({
    semanal: 0,
    mensual: 0,
  });
  const [gastos, setGastos] = useState({ semanal: 0, mensual: 0 });
  const [ingresos, setIngresos] = useState({ semanal: 0, mensual: 0 });

  useEffect(() => {
    // Verifica que 'data' y 'clientes' estén definidos
    if (!data || !clientes) return;

    // Calcular clientes nuevos
    const { nuevosPorSemana, nuevosPorMes } = calcularClientesNuevos(
      primerDiaSemana,
      ultimoDiaSemana,
      primerDia,
      ultimoDia
    );
    setClientesNuevos({ semanal: nuevosPorSemana, mensual: nuevosPorMes });

    // Calcular gastos e ingresos
    const { ingresosPorSemana, ingresosPorMes } = calcularGastosEIngresos(
      primerDiaSemana,
      ultimoDiaSemana,
      primerDia,
      ultimoDia
    );
    setGastos({ semanal: ingresosPorSemana, mensual: ingresosPorMes });
    setIngresos({ semanal: ingresosPorSemana, mensual: ingresosPorMes });
  }, [clientes, data, calcularClientesNuevos, calcularGastosEIngresos]);

  return (
    <div>
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
