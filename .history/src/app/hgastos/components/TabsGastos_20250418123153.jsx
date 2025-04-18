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

  const handleGuardar = async () => {
    const res = await fetch(`/api/gastos/${gastoSeleccionado._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edited),
    });
    if (res.ok) {
      alert("Gasto actualizado");
      setGastoSeleccionado(null);
      setIsEditing(false);
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

      {/* filtros y formulario omitido para brevedad */}

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
                  onClick={() => {
                    setIsEditing(true);
                    setEdited(gastoSeleccionado);
                  }}
                >
                  Editar
                </button>
              </>
            ) : (
              <>
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
                    <div className="mb-2">
                      <p className="font-semibold">Días de trabajo:</p>
                      {[
                        "Lunes",
                        "Martes",
                        "Miércoles",
                        "Jueves",
                        "Viernes",
                        "Sábado",
                      ].map((dia) => (
                        <label key={dia} className="block text-sm">
                          <input
                            type="checkbox"
                            checked={
                              edited.diasDeTrabajo?.includes(dia) || false
                            }
                            onChange={() => {
                              const nuevosDias = edited.diasDeTrabajo || [];
                              setEdited({
                                ...edited,
                                diasDeTrabajo: nuevosDias.includes(dia)
                                  ? nuevosDias.filter((d) => d !== dia)
                                  : [...nuevosDias, dia],
                              });
                            }}
                          />{" "}
                          {dia}
                        </label>
                      ))}
                    </div>
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
