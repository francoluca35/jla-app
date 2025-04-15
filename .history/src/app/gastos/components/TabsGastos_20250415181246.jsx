"use client";
import React, { useState, useEffect } from "react";

const gastosEjemplo = [
  {
    tipo: "materiaPrima",
    descripcion: "Harina",
    lugar: "Mayorista",
    precio: 3000,
    fecha: new Date(),
  },
  {
    tipo: "gastoVario",
    descripcion: "Limpieza",
    lugar: "Supermercado",
    precio: 1500,
    fecha: new Date(),
  },
  // Agregar más gastos con diferentes fechas si querés probar
];

const TabsGasto = () => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState("materiaPrima");
  const [gastos, setGastos] = useState([]);

  useEffect(() => {
    // Acá podés traer tus datos desde tu base de datos
    setGastos(gastosEjemplo);
  }, []);

  const filtrarPorTipo = gastos.filter((g) => g.tipo === tipoSeleccionado);

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

  const totalDia = filtrarPorTipo
    .filter((g) => esMismoDia(g.fecha))
    .reduce((acc, g) => acc + Number(g.precio), 0);

  const totalSemana = filtrarPorTipo
    .filter((g) => esMismaSemana(g.fecha))
    .reduce((acc, g) => acc + Number(g.precio), 0);

  const totalMes = filtrarPorTipo
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

      <div className="space-y-2">
        <p>Total del día: ${totalDia}</p>
        <p>Total de la semana: ${totalSemana}</p>
        <p>Total del mes: ${totalMes}</p>
      </div>
    </div>
  );
};

export default TabsGasto;
