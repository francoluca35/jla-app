import React, { useEffect, useState } from "react";
import useClientes from "@/hooks/useClient"; // Asumiendo que este hook está disponible
import { useGastos } from "@/hooks/UseGastos";
import useIngresos from "@/hooks/useIngresos"; // Asumiendo que este hook está disponible

function TabsEstadisticas() {
  const { clientes, calcularClientesNuevos } = useClientes();
  const { calcularGastosPorSemanaYMes } = useGastos({});
  const { calcularIngresosPorSemanaYMes } = useIngresos();

  const [clientesNuevos, setClientesNuevos] = useState({
    semanal: 0,
    mensual: 0,
  });
  const [gastos, setGastos] = useState({ semanal: 0, mensual: 0 });
  const [ingresos, setIngresos] = useState({ semanal: 0, mensual: 0 });

  useEffect(() => {
    const { nuevosPorSemana, nuevosPorMes } = calcularClientesNuevos();
    setClientesNuevos({ semanal: nuevosPorSemana, mensual: nuevosPorMes });

    const { totalPorSemana: totalGastosSemana, totalPorMes: totalGastosMes } =
      calcularGastosPorSemanaYMes();
    setGastos({ semanal: totalGastosSemana, mensual: totalGastosMes });

    const {
      totalPorSemana: totalIngresosSemana,
      totalPorMes: totalIngresosMes,
    } = calcularIngresosPorSemanaYMes();
    setIngresos({ semanal: totalIngresosSemana, mensual: totalIngresosMes });
  }, [
    clientes,
    calcularClientesNuevos,
    calcularGastosPorSemanaYMes,
    calcularIngresosPorSemanaYMes,
  ]);

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
