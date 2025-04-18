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
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({});

  const [modoEliminar, setModoEliminar] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const { gastos, loading } = useGastos({
    tipo: tipoSeleccionado,
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
    .filter((g) => esMismoDia(new Date(g.fecha)))
    .reduce((acc, g) => acc + Number(g.precio), 0);
  const totalSemana = gastos
    .filter((g) => esMismaSemana(new Date(g.fecha)))
    .reduce((acc, g) => acc + Number(g.precio), 0);
  const totalMes = gastos
    .filter((g) => esMismoMes(new Date(g.fecha)))
    .reduce((acc, g) => acc + Number(g.precio), 0);

  const toggleSeleccionado = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSeleccionados([]);
    } else {
      const todosIDs = gastos.map((g) => g._id);
      setSeleccionados(todosIDs);
    }
    setSelectAll(!selectAll);
  };

  const eliminarSeleccionados = async () => {
    if (seleccionados.length === 0) return alert("Nada seleccionado");

    const res = await fetch("/api/gastos", {
      method: "DELETE",
      body: JSON.stringify({ ids: seleccionados }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Gastos eliminados");
      setSeleccionados([]);
      setSelectAll(false);
      setModoEliminar(false);
      window.location.reload();
    } else {
      alert("Error al eliminar");
    }
  };

  const handleGuardar = async () => {
    const payload = {
      ...edited,
      precio: Number(edited.precio),
    };

    const res = await fetch(`/api/gastos/${gastoSeleccionado._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Gasto actualizado");
      setGastoSeleccionado(null);
      setIsEditing(false);
      window.location.reload();
    } else {
      alert("Error al guardar");
    }
  };

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

      {/* Filtros */}
      <div className="space-y-2">
        <select
          className="p-2 w-full bg-black rounded"
          value={tipoSeleccionado}
          onChange={(e) => setTipoSeleccionado(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="materiaPrima">Materia Prima</option>
          <option value="gastoVario">Gastos Varios</option>
          <option value="sueldos">Sueldos</option>
        </select>

        <div className="flex gap-2">
          <DatePicker
            selected={fechaDesde}
            onChange={(date) => setFechaDesde(date)}
            dateFormat="d/M/yyyy"
            placeholderText="Desde"
            className="w-full p-2 bg-black text-white rounded"
          />
          <DatePicker
            selected={fechaHasta}
            onChange={(date) => setFechaHasta(date)}
            dateFormat="d/M/yyyy"
            placeholderText="Hasta"
            className="w-full p-2 bg-black text-white rounded"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Precio mín"
              className="p-2 flex-1 bg-black text-white rounded"
              value={minPrecio}
              onChange={(e) => setMinPrecio(e.target.value)}
            />
            <input
              type="number"
              placeholder="Precio máx"
              className="p-2 flex-1 bg-black text-white rounded"
              value={maxPrecio}
              onChange={(e) => setMaxPrecio(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setModoEliminar(!modoEliminar);
              setSeleccionados([]);
              setSelectAll(false);
              setGastoSeleccionado(null);
              setIsEditing(false);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            {modoEliminar ? "Cancelar selección" : "Seleccionar para eliminar"}
          </button>

          {modoEliminar && (
            <button
              onClick={eliminarSeleccionados}
              disabled={seleccionados.length === 0}
              className={`px-4 py-2 rounded font-semibold transition-all ${
                seleccionados.length === 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-red-700 hover:bg-red-800 text-white"
              }`}
            >
              Eliminar seleccionados ({seleccionados.length})
            </button>
          )}
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
        ) : gastos.length === 0 ? (
          <p>No hay gastos para mostrar.</p>
        ) : (
          <div className="space-y-2">
            {gastos.map((gasto) => (
              <div
                key={gasto._id}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  modoEliminar && seleccionados.includes(gasto._id)
                    ? "bg-red-800"
                    : "bg-black bg-opacity-60 hover:bg-gray-600"
                }`}
                onClick={() =>
                  modoEliminar
                    ? toggleSeleccionado(gasto._id)
                    : (setGastoSeleccionado(gasto), setEdited(gasto))
                }
              >
                <p className="font-bold">
                  {gasto.tipo === "sueldos"
                    ? `Empleado: ${gasto.empleado}`
                    : gasto.descripcion}
                </p>
                {gasto.tipo === "sueldos" && (
                  <p className="text-sm">
                    Días: {gasto.diasDeTrabajo?.join(", ") || "-"}
                  </p>
                )}
                {gasto.tipo !== "sueldos" && (
                  <p className="text-sm">{gasto.lugar}</p>
                )}
                <p className="text-sm">Precio: ${gasto.precio}</p>
                <p className="text-sm">
                  Fecha: {new Date(gasto.fecha).toLocaleDateString("es-AR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsGasto;
