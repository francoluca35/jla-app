import React, { useState, useEffect } from "react";
import useClientes from "@/hooks/useClientes";
import { useGastos } from "@/hooks/UseGastos";
import useIngresos from "@/hooks/useIngresos";

function TabsEstadisticas() {
  const { calcularClientesNuevos } = useClientes();
  const { calcularGastosPorSemanaYMes } = useGastos({});
  const { calcularIngresosPorSemanaYMes } = useIngresos();

  const [clientesNuevos, setClientesNuevos] = useState({
    semanal: 0,
    mensual: 0,
  });
  const [gastos, setGastos] = useState({ semanal: 0, mensual: 0 });
  const [ingresos, setIngresos] = useState({ semanal: 0, mensual: 0 });

  useEffect(() => {
    // Llamamos a las funciones de cálculo
    const { nuevosPorSemana, nuevosPorMes } = calcularClientesNuevos();
    const { totalPorSemana: totalGastosSemana, totalPorMes: totalGastosMes } =
      calcularGastosPorSemanaYMes();
    const {
      totalPorSemana: totalIngresosSemana,
      totalPorMes: totalIngresosMes,
    } = calcularIngresosPorSemanaYMes();

    // Solo actualizamos el estado si los valores han cambiado
    setClientesNuevos({
      semanal: nuevosPorSemana || 0,
      mensual: nuevosPorMes || 0,
    });
    setGastos({
      semanal: totalGastosSemana || 0,
      mensual: totalGastosMes || 0,
    });
    setIngresos({
      semanal: totalIngresosSemana || 0,
      mensual: totalIngresosMes || 0,
    });
  }, [
    calcularClientesNuevos,
    calcularGastosPorSemanaYMes,
    calcularIngresosPorSemanaYMes,
  ]); // Agregar dependencias aquí

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
