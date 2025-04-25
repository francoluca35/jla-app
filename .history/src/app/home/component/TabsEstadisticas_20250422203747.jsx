"use client";
import React, { useEffect, useState } from "react";
import useClientes from "@/hooks/useClient";
import { useGastos } from "../../../hooks/UseGastos";
import useIngresos from "@/hooks/useIngresos";

function TabsEstadisticas() {
  const { clientes, calcularClientesNuevos, calcularGastosEIngresos } =
    useClientes();
  const { data } = useIngresos(); // Usamos el estado 'data' de 'useIngresos'

  // Función para obtener el primer y último día del mes
  const getPrimerYUltimoDiaDelMes = (fecha) => {
    const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    primerDia.setHours(0, 0, 0, 0); // Aseguramos que la hora sea 00:00:00
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    ultimoDia.setHours(23, 59, 59, 999); // Aseguramos que la hora sea 23:59:59
    return { primerDia, ultimoDia };
  };

  // Función para obtener el rango de fechas de la semana (Lunes - Domingo)
  const getRangoDeSemana = (fecha) => {
    const inicioSemana = fecha.getDate() - fecha.getDay() + 1; // Lunes de la semana
    const finSemana = inicioSemana + 6; // Domingo de la semana
    const primerDiaSemana = new Date(fecha.setDate(inicioSemana));
    primerDiaSemana.setHours(0, 0, 0, 0); // Aseguramos que la hora sea 00:00:00
    const ultimoDiaSemana = new Date(fecha.setDate(finSemana));
    ultimoDiaSemana.setHours(23, 59, 59, 999); // Aseguramos que la hora sea 23:59:59
    return { primerDiaSemana, ultimoDiaSemana };
  };

  // Fecha actual
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
