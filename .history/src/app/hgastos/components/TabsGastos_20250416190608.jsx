"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGastos } from "@/hooks/UseGastos";

const TabsGasto = () => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [minPrecio, setMinPrecio] = useState("");
  const [maxPrecio, setMaxPrecio] = useState("");
  const [gastoSeleccionado, setGastoSeleccionado] = useState(null);

  const { gastos, loading } = useGastos({
    tipo: tipoSeleccionado,
    min: minPrecio,
    max: maxPrecio,
  });

  // Filtrar por rango
  const gastosFiltrados = gastos.filter((g) => {
    const fechaGasto = new Date(g.fecha);
    const dentroDeRango =
      (!fechaDesde || fechaGasto >= fechaDesde) &&
      (!fechaHasta || fechaGasto <= fechaHasta);
    return dentroDeRango;
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

  const totalDia = gastosFiltrados
    .filter((g) => esMismoDia(new Date(g.fecha)))
    .reduce((acc, g) => acc + Number(g.precio), 0);
  const totalSemana = gastosFiltrados
    .filter((g) => esMismaSemana(new Date(g.fecha)))
    .reduce((acc, g) => acc + Number(g.precio), 0);
  const totalMes = gastosFiltrados
    .filter((g) => esMismoMes(new Date(g.fecha)))
    .reduce((acc, g) => acc + Number(g.precio), 0);

  return (
    <div
      className="min-h-screen p-6 text-white space-y-4"
      style={{
        backgroundImage: "url('/Assets/formclient.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-3xl font-bold mb-4 text-center tracking-wider">
        VISUALIZAR GASTOS
      </h2>

      <div className="space-y-2">
        <select
          className="p-2 w-full bg-black rounded"
          value={tipoSeleccionado}
          onChange={(e) => setTipoSeleccionado(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="materiaPrima">Materia Prima</option>
          <option value="gastoVario">Gastos Varios</option>
        </select>

        <div className="flex gap-2 items-center text-center">
          <DatePicker
            selected={fechaDesde}
            onChange={(date) => setFechaDesde(date)}
            dateFormat="d/M/yyyy"
            placeholderText="Desde"
            className="p-2 w-full bg-black text-white rounded"
          />
          <DatePicker
            selected={fechaHasta}
            onChange={(date) => setFechaHasta(date)}
            dateFormat="d/M/yyyy"
            placeholderText="Hasta"
            className="p-2 w-full bg-black text-white rounded"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Precio mín"
            className="p-2 w-full bg-black rounded"
            value={minPrecio}
            onChange={(e) => setMinPrecio(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio máx"
            className="p-2 w-full bg-black rounded"
            value={maxPrecio}
            onChange={(e) => setMaxPrecio(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <p>Total del día: ${totalDia}</p>
        <p>Total de la semana: ${totalSemana}</p>
        <p>Total del mes: ${totalMes}</p>
      </div>

      <div className="mt-4 space-y-2">
        {loading ? (
          <p>Cargando...</p>
        ) : gastosFiltrados.length === 0 ? (
          <p>No hay gastos para mostrar.</p>
        ) : (
          gastosFiltrados.map((gasto) => (
            <div
              key={gasto._id}
              className="p-3 bg-black bg-opacity-60 rounded cursor-pointer hover:bg-gray-600"
              onClick={() => setGastoSeleccionado(gasto)}
            >
              <p className="font-bold">{gasto.descripcion}</p>
              <p className="text-sm">{gasto.lugar}</p>
              <p className="text-sm">Precio: ${gasto.precio}</p>
              <p className="text-sm">
                Fecha: {new Date(gasto.fecha).toLocaleDateString("es-AR")}
              </p>
            </div>
          ))
        )}
      </div>

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
              {new Date(gastoSeleccionado.fecha).toLocaleDateString("es-AR")}
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
