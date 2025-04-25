"use client";
import React, { useEffect, useState } from "react";
import useClientes from "@/hooks/useClient";
import { useGastos } from "../../../hooks/UseGastos";
import useIngresos from "@/hooks/useIngresos";

function TabsEstadisticas() {
  const { clientes, calcularClientesNuevos, calcularGastosEIngresos } =
    useClientes();
  const { data } = useIngresos();

  const getPrimerYUltimoDiaDelMes = (fecha) => {
    const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    primerDia.setHours(0, 0, 0, 0);
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    ultimoDia.setHours(23, 59, 59, 999);
    return { primerDia, ultimoDia };
  };

  const getRangoDeSemana = (fecha) => {
    const inicioSemana = fecha.getDate() - fecha.getDay() + 1;
    const finSemana = inicioSemana + 6;
    const primerDiaSemana = new Date(fecha.setDate(inicioSemana));
    primerDiaSemana.setHours(0, 0, 0, 0);
    const ultimoDiaSemana = new Date(fecha.setDate(finSemana));
    ultimoDiaSemana.setHours(23, 59, 59, 999);
    return { primerDiaSemana, ultimoDiaSemana };
  };

  const hoy = new Date();

  const { primerDia, ultimoDia } = getPrimerYUltimoDiaDelMes(hoy);
  const { primerDiaSemana, ultimoDiaSemana } = getRangoDeSemana(hoy);

  const [clientesNuevos, setClientesNuevos] = useState({
    semanal: 0,
    mensual: 0,
  });
  const [gastos, setGastos] = useState({ semanal: 0, mensual: 0 });
  const [ingresos, setIngresos] = useState({ semanal: 0, mensual: 0 });

  useEffect(() => {
    if (!data || !clientes) return;

    const { nuevosPorSemana, nuevosPorMes } = calcularClientesNuevos(
      primerDiaSemana,
      ultimoDiaSemana,
      primerDia,
      ultimoDia
    );
    setClientesNuevos({ semanal: nuevosPorSemana, mensual: nuevosPorMes });

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
