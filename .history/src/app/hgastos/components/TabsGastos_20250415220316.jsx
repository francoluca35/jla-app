"use client";
import React, { useState } from "react";
import { useGastos } from "@/hooks/UseGastos";

const TabsGasto = () => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [minPrecio, setMinPrecio] = useState("");
  const [maxPrecio, setMaxPrecio] = useState("");
  const [gastoSeleccionado, setGastoSeleccionado] = useState(null);

  const { gastos, loading } = useGastos({
    tipo: tipoSeleccionado,
    fecha: fechaFiltro,
    min: minPrecio,
    max: maxPrecio,
  });

  const hoy = new Date();
  const getNumeroSemana = (fecha) => {
    const start = new Date(fecha.getFullYear(), 0, 1);
    const diff = fecha - start;
    return Math.ceil((diff / (1000 * 60 * 60 * 24) + start.getDay() + 1) / 7);
  };

  const esMismoDia = (fecha) => fecha.toDateString() === hoy.toDateString();
  const esMismaSemana = (fecha) =>
    getNumeroSemana(fecha) === getNumeroSemana(hoy);
  const esMismoMes = (fecha) =>
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear();

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
    <div className="p-4 bg-verdefluort text-white rounded-xl space-y-4">
      <h2 className="text-lg font-bold">Visualizar Gastos</h2>

      <div className="space-y-2">
        <select
          className="p-2 w-full bg-gray-700 rounded"
          value={tipoSeleccionado}
          onChange={(e) => setTipoSeleccionado(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="materiaPrima">Materia Prima</option>
          <option value="gastoVario">Gastos Varios</option>
        </select>

        <input
          type="date"
          className="p-2 w-full bg-gray-700 rounded"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
        />

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Precio mín"
            className="p-2 w-full bg-gray-700 rounded"
            value={minPrecio}
            onChange={(e) => setMinPrecio(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio máx"
            className="p-2 w-full bg-gray-700 rounded"
            value={maxPrecio}
            onChange={(e) => setMaxPrecio(e.target.value)}
          />
        </div>
      </div>

      {/* Totales */}
      <div className="space-y-1">
        <p>Total del día: ${totalDia}</p>
        <p>Total de la semana: ${totalSemana}</p>
        <p>Total del mes: ${totalMes}</p>
      </div>

      {/* Lista de gastos */}
      <div className="mt-4 space-y-2">
        {loading ? (
          <p>Cargando...</p>
        ) : gastos.length === 0 ? (
          <p>No hay gastos para mostrar.</p>
        ) : (
          gastos.map((gasto) => (
            <div
              key={gasto._id}
              className="p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
              onClick={() => setGastoSeleccionado(gasto)}
            >
              <p className="font-bold">{gasto.descripcion}</p>
              <p className="text-sm">{gasto.lugar}</p>
              <p className="text-sm">Precio: ${gasto.precio}</p>
              <p className="text-sm">
                Fecha: {new Date(gasto.fecha).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {gastoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl w-96 relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => setGastoSeleccionado(null)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Detalle del Gasto</h3>
            <p>
              <strong>Tipo:</strong> {gastoSeleccionado.tipo}
            </p>
            <p>
              <strong>Descripción:</strong> {gastoSeleccionado.descripcion}
            </p>
            <p>
              <strong>Lugar:</strong> {gastoSeleccionado.lugar}
            </p>
            <p>
              <strong>Precio:</strong> ${gastoSeleccionado.precio}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(gastoSeleccionado.fecha).toLocaleString()}
            </p>
            <p>
              <strong>ID:</strong> {gastoSeleccionado._id}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabsGasto;
