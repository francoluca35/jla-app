"use client";
import React, { useState } from "react";
import { useGastos } from "@/hooks/UseGastos";

const TabsGasto = () => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState("materiaPrima");
  const { gastos, loading } = useGastos({ tipo: tipoSeleccionado });

  const hoy = new Date();
  const esMismoDia = (fecha) => fecha.toDateString() === hoy.toDateString();

  const esMismaSemana = (fecha) => {
    const semanaActual = getNumeroSemana(hoy);
    return getNumeroSemana(fecha) === semanaActual;
  };

  const esMismoMes = (fecha) =>
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear();

  const getNumeroSemana = (fecha) => {
    const start = new Date(fecha.getFullYear(), 0, 1);
    const diff = fecha - start;
    return Math.ceil((diff / (1000 * 60 * 60 * 24) + start.getDay() + 1) / 7);
  };

  const totalDia = gastos
    .filter((g) => esMismoDia(g.fecha))
    .reduce((acc, g) => acc + Number(g.precio), 0);

  const totalSemana = gastos
    .filter((g) => esMismaSemana(g.fecha))
    .reduce((acc, g) => acc + Number(g.precio), 0);

  const totalMes = gastos
    .filter((g) => esMismoMes(g.fecha))
    .reduce((acc, g) => acc + Number(g.precio), 0);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-xl">
      <h2 className="text-lg font-bold mb-4">Visualizar Gastos</h2>

      <select
        className="mb-4 p-2 bg-gray-700 rounded w-full"
        value={tipoSeleccionado}
        onChange={(e) => setTipoSeleccionado(e.target.value)}
      >
        <option value="materiaPrima">Gastos de materia prima</option>
        <option value="gastoVario">Gastos varios</option>
      </select>

      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <div className="space-y-2">
          <p>Total del día: ${totalDia}</p>
          <p>Total de la semana: ${totalSemana}</p>
          <p>Total del mes: ${totalMes}</p>
        </div>
      )}
    </div>
  );
};

export default TabsGasto;
