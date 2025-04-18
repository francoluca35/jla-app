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
    } else {
      alert("Error al eliminar");
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
            wrapperClassName="w-full"
          />
          <DatePicker
            selected={fechaHasta}
            onChange={(date) => setFechaHasta(date)}
            dateFormat="d/M/yyyy"
            placeholderText="Hasta"
            className="w-full p-2 bg-black text-white rounded"
            wrapperClassName="w-full"
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
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            {modoEliminar ? "Cancelar selección" : "Seleccionar para eliminar"}
          </button>
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
          <>
            {modoEliminar && (
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={toggleSelectAll}
                  className="bg-red-700 text-white px-4 py-1 rounded"
                >
                  {selectAll ? "Desmarcar todo" : "Seleccionar todo"}
                </button>
                <button
                  onClick={eliminarSeleccionados}
                  className="bg-red-600 text-white px-4 py-1 rounded"
                >
                  Eliminar seleccionados ({seleccionados.length})
                </button>
              </div>
            )}

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
                      : setGastoSeleccionado(gasto)
                  }
                >
                  {gasto.tipo === "sueldos" ? (
                    <>
                      <p className="font-bold">Empleado: {gasto.empleado}</p>
                      <p className="text-sm">
                        Días:{" "}
                        {gasto.diasDeTrabajo?.join(", ") || "No especificado"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold">{gasto.descripcion}</p>
                      <p className="text-sm">{gasto.lugar}</p>
                    </>
                  )}
                  <p className="text-sm">Precio: ${gasto.precio}</p>
                  <p className="text-sm">
                    Fecha: {new Date(gasto.fecha).toLocaleDateString("es-AR")}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {gastoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl w-96 relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => {
                setGastoSeleccionado(null);
                setIsEditing(false);
              }}
            >
              ×
            </button>

            <h3 className="text-lg font-bold mb-2">Detalle del Gasto</h3>

            {!isEditing ? (
              <>
                {gastoSeleccionado.tipo === "sueldos" ? (
                  <>
                    <p>
                      <strong>Tipo:</strong> Sueldos
                    </p>
                    <p>
                      <strong>Empleado:</strong> {gastoSeleccionado.empleado}
                    </p>
                    <p>
                      <strong>Días de trabajo:</strong>{" "}
                      {gastoSeleccionado.diasDeTrabajo?.join(", ") ||
                        "No especificado"}
                    </p>
                    <p>
                      <strong>Forma de pago:</strong>{" "}
                      {gastoSeleccionado.tipodepago?.join(" + ") ||
                        "No especificado"}
                    </p>
                    <p>
                      <strong>Importe:</strong> ${gastoSeleccionado.precio}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Tipo:</strong> {gastoSeleccionado.tipo}
                    </p>
                    <p>
                      <strong>Descripción:</strong>{" "}
                      {gastoSeleccionado.descripcion}
                    </p>
                    <p>
                      <strong>Lugar:</strong> {gastoSeleccionado.lugar}
                    </p>
                    <p>
                      <strong>Precio:</strong> ${gastoSeleccionado.precio}
                    </p>
                  </>
                )}
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(gastoSeleccionado.fecha).toLocaleDateString(
                    "es-AR"
                  )}
                </p>
                <p>
                  <strong>ID:</strong> {gastoSeleccionado._id}
                </p>

                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </button>
              </>
            ) : (
              <>
                {/* EDITABLE FORM */}
                {gastoSeleccionado.tipo === "sueldos" ? (
                  <>
                    <label className="block mb-2">
                      Empleado:
                      <input
                        className="w-full border p-1"
                        value={edited.empleado}
                        onChange={(e) =>
                          setEdited({ ...edited, empleado: e.target.value })
                        }
                      />
                    </label>
                    <label className="block mb-2">
                      Días de trabajo:
                      <input
                        className="w-full border p-1"
                        value={edited.diasDeTrabajo}
                        onChange={(e) =>
                          setEdited({
                            ...edited,
                            diasDeTrabajo: e.target.value.split(","),
                          })
                        }
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label className="block mb-2">
                      Descripción:
                      <input
                        className="w-full border p-1"
                        value={edited.descripcion}
                        onChange={(e) =>
                          setEdited({ ...edited, descripcion: e.target.value })
                        }
                      />
                    </label>
                    <label className="block mb-2">
                      Lugar:
                      <input
                        className="w-full border p-1"
                        value={edited.lugar}
                        onChange={(e) =>
                          setEdited({ ...edited, lugar: e.target.value })
                        }
                      />
                    </label>
                  </>
                )}
                <label className="block mb-2">
                  Precio:
                  <input
                    type="number"
                    className="w-full border p-1"
                    value={edited.precio}
                    onChange={(e) =>
                      setEdited({ ...edited, precio: e.target.value })
                    }
                  />
                </label>

                <button
                  onClick={handleGuardar}
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
                >
                  Guardar cambios
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabsGasto;
