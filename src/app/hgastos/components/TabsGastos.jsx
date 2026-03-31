"use client";
import React, { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGastos } from "@/hooks/UseGastos";
import Swal from "sweetalert2";

const formatMoneda = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const labelTipo = (tipo) => {
  if (tipo === "stockear") return "Stockear";
  if (tipo === "gastoVario") return "Gastos Varios";
  if (tipo === "sueldos") return "Sueldos";
  if (tipo === "materiaPrimaPresupuesto") return "Materia prima presupuesto";
  return tipo || "-";
};

/** Filas de materiales / MP: tolera distintas formas de guardado (Mongo, presupuesto, registros viejos). */
function extractMateriasRows(gasto) {
  if (!gasto || typeof gasto !== "object") return [];
  const sources = [
    gasto.items,
    gasto.Items,
    gasto.materiaPrimaDetalle,
    gasto.materiaPrimaItems,
    gasto.detalles,
  ];
  let raw = [];
  for (const s of sources) {
    if (Array.isArray(s) && s.length > 0) {
      raw = s;
      break;
    }
  }
  if (!raw.length) return [];

  return raw
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const material = String(
        row.material ?? row.nombre ?? row.producto ?? row.nombreProducto ?? ""
      ).trim();
      const cantidad = Number(row.cantidad ?? row.qty ?? row.quantity ?? 0);
      const unidad = String(row.unidad ?? row.unit ?? "").trim();
      const precio = Number(row.precio ?? row.precioUnitario ?? row.precioUnit ?? 0);
      const subtotal = Number(
        row.subtotal ??
          (Number.isFinite(cantidad) && cantidad > 0 ? cantidad * precio : precio)
      );
      return {
        material: material || "Sin nombre",
        cantidad: Number.isFinite(cantidad) ? cantidad : 0,
        unidad,
        precio: Number.isFinite(precio) ? precio : 0,
        subtotal: Number.isFinite(subtotal) ? subtotal : 0,
      };
    })
    .filter(Boolean);
}

function MateriasCompradasTable({ rows }) {
  if (!rows?.length) return null;
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800">
        Materias primas / materiales comprados
      </div>
      <div className="divide-y divide-gray-100">
        {rows.map((item, idx) => (
          <div
            key={`${item.material}-${idx}`}
            className="px-3 py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm items-start"
          >
            <p className="font-medium text-gray-900 sm:col-span-5">{item.material}</p>
            <p className="text-gray-600 sm:col-span-3 tabular-nums">
              {item.cantidad > 0 ? `${item.cantidad} ${item.unidad || ""}`.trim() : "—"}
            </p>
            <p className="text-gray-700 sm:col-span-2 sm:text-right tabular-nums">
              {item.precio > 0 ? `${formatMoneda(item.precio)} c/u` : "—"}
            </p>
            <p className="font-semibold text-gray-900 sm:col-span-2 sm:text-right tabular-nums">
              {formatMoneda(item.subtotal)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    if (seleccionados.length === 0) {
      return Swal.fire("Nada seleccionado", "", "warning");
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás ${seleccionados.length} gasto(s). Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const res = await fetch("/api/gastos", {
      method: "DELETE",
      body: JSON.stringify({ ids: seleccionados }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      await Swal.fire("Eliminado", "Los gastos fueron eliminados.", "success");
      window.location.reload();
    } else {
      Swal.fire("Error", "Hubo un problema al eliminar.", "error");
    }
  };

  const materiasRowsModal = useMemo(
    () => (gastoSeleccionado ? extractMateriasRows(gastoSeleccionado) : []),
    [gastoSeleccionado]
  );

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
      await Swal.fire(
        "Actualizado",
        "El gasto fue actualizado correctamente.",
        "success"
      );
      setGastoSeleccionado(null);
      setIsEditing(false);
      window.location.reload();
    } else {
      Swal.fire("Error", "Hubo un problema al actualizar.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Historial de Gastos</h1>
        <p className="text-gray-500 mt-1 text-sm">Filtrar y consultar gastos registrados</p>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 text-sm"
            value={tipoSeleccionado}
            onChange={(e) => setTipoSeleccionado(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="materiaPrimaPresupuesto">Materia prima (presupuesto)</option>
            <option value="stockear">Stockear</option>
            <option value="gastoVario">Gastos Varios</option>
            <option value="sueldos">Sueldos</option>
          </select>

          <DatePicker
            selected={fechaDesde}
            onChange={(date) => setFechaDesde(date)}
            dateFormat="d/M/yyyy"
            placeholderText="Desde"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 text-sm"
          />
          <DatePicker
            selected={fechaHasta}
            onChange={(date) => setFechaHasta(date)}
            dateFormat="d/M/yyyy"
            placeholderText="Hasta"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="number"
            placeholder="Precio mín"
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 text-sm w-28"
            value={minPrecio}
            onChange={(e) => setMinPrecio(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio máx"
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 text-sm w-28"
            value={maxPrecio}
            onChange={(e) => setMaxPrecio(e.target.value)}
          />
          <button
            onClick={() => {
              setModoEliminar(!modoEliminar);
              setSeleccionados([]);
              setSelectAll(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              modoEliminar
                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {modoEliminar ? "Cancelar" : "Seleccionar para eliminar"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-4">
          <span><strong>Día:</strong> ${totalDia}</span>
          <span><strong>Semana:</strong> ${totalSemana}</span>
          <span><strong>Mes:</strong> ${totalMes}</span>
        </div>

        {loading ? (
          <p className="text-gray-500 py-4">Cargando...</p>
        ) : gastos.length === 0 ? (
          <p className="text-gray-500 py-4">No hay gastos para mostrar.</p>
        ) : (
          <>
            {modoEliminar && (
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={toggleSelectAll}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                  {selectAll ? "Desmarcar todo" : "Seleccionar todo"}
                </button>
                <button
                  onClick={eliminarSeleccionados}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Eliminar ({seleccionados.length})
                </button>
              </div>
            )}

            <div className="space-y-2">
              {[...gastos]
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                .map((gasto) => (
                  <div
                    key={gasto._id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      modoEliminar && seleccionados.includes(gasto._id)
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      if (modoEliminar) {
                        toggleSeleccionado(gasto._id);
                      } else {
                        setGastoSeleccionado(gasto);
                        setIsEditing(false);
                        setEdited(gasto);
                      }
                    }}
                  >
                    {gasto.tipo === "sueldos" ? (
                      <>
                        <p className="font-semibold text-gray-900">Empleado: {gasto.empleado}</p>
                        <p className="text-sm text-gray-600">
                          Días: {gasto.diasDeTrabajo?.join(", ") || "-"}
                        </p>
                      </>
                    ) : gasto.tipo === "materiaPrimaPresupuesto" ? (
                      <>
                        <p className="font-semibold text-gray-900">Cliente: {gasto.cliente || "-"}</p>
                        <p className="text-sm text-gray-600">
                          Sucursal: {gasto.sucursal || "-"} · Tipo: Materia prima presupuesto
                        </p>
                        <p className="text-sm text-gray-600">
                          Monto MP: ${Number(gasto.montoMateriaPrima || gasto.precio || 0)} · Gasto total: $
                          {Number(gasto.gastoTotal || gasto.precio || 0)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-900">{gasto.descripcion}</p>
                        <p className="text-sm text-gray-600">{gasto.lugar}</p>
                      </>
                    )}
                    <p className="text-sm text-gray-700 mt-1">${gasto.precio} · {new Date(gasto.fecha).toLocaleDateString("es-AR")}</p>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de detalle y edición */}
      {gastoSeleccionado && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-gray-900 p-6 rounded-2xl w-full max-w-2xl relative border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl leading-none"
              onClick={() => {
                setGastoSeleccionado(null);
                setIsEditing(false);
              }}
            >
              ×
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Detalle del gasto</h3>

            {!isEditing ? (
              <>
                {gastoSeleccionado.tipo === "sueldos" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <p className="sm:col-span-2 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                      <strong>Tipo:</strong> {labelTipo(gastoSeleccionado.tipo)}
                    </p>
                    <p className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                      <strong>Empleado:</strong> {gastoSeleccionado.empleado || "-"}
                    </p>
                    <p className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                      <strong>Forma de pago:</strong> {gastoSeleccionado.tipodepago?.join(" + ") || "-"}
                    </p>
                    <p className="sm:col-span-2 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                      <strong>Días de trabajo:</strong> {gastoSeleccionado.diasDeTrabajo?.join(", ") || "-"}
                    </p>
                    {gastoSeleccionado.descripcion && (
                      <p className="sm:col-span-2 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 whitespace-pre-wrap">
                        <strong>Descripción:</strong> {gastoSeleccionado.descripcion}
                      </p>
                    )}
                    <p className="sm:col-span-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                      <strong>Importe:</strong> {formatMoneda(gastoSeleccionado.precio)}
                    </p>
                  </div>
                ) : gastoSeleccionado.tipo === "materiaPrimaPresupuesto" ? (
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <p className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                        <strong>Cliente:</strong> {gastoSeleccionado.cliente || "-"}
                      </p>
                      <p className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                        <strong>Sucursal:</strong> {gastoSeleccionado.sucursal || "-"}
                      </p>
                      <p className="sm:col-span-2 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                        <strong>Tipo:</strong> {labelTipo(gastoSeleccionado.tipo)}
                      </p>
                      <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                        <strong>Monto MP:</strong>{" "}
                        {formatMoneda(gastoSeleccionado.montoMateriaPrima || gastoSeleccionado.precio || 0)}
                      </p>
                      <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                        <strong>Gasto total:</strong>{" "}
                        {formatMoneda(gastoSeleccionado.gastoTotal || gastoSeleccionado.precio || 0)}
                      </p>
                    </div>
                    <MateriasCompradasTable rows={materiasRowsModal} />
                    {!materiasRowsModal.length && (
                      <p className="text-xs text-gray-500 rounded-lg border border-dashed border-gray-200 px-3 py-2">
                        No hay detalle por ítem en este registro (solo total de materia prima).
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <p className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                        <strong>Tipo:</strong> {labelTipo(gastoSeleccionado.tipo)}
                      </p>
                      <p className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                        <strong>Lugar:</strong> {gastoSeleccionado.lugar || "-"}
                      </p>
                      <p className="sm:col-span-2 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 whitespace-pre-wrap">
                        <strong>Descripción:</strong> {gastoSeleccionado.descripcion || "-"}
                      </p>
                    </div>

                    <MateriasCompradasTable rows={materiasRowsModal} />
                    {!materiasRowsModal.length && (
                      <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        No hay líneas de materiales guardadas en este gasto. Si es un registro viejo (antes del
                        detalle por ítem), solo verás descripción y total.
                      </p>
                    )}

                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                      <strong>Total del gasto:</strong> {formatMoneda(gastoSeleccionado.precio)}
                    </div>
                  </div>
                )}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <p className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                    <strong>Fecha:</strong>{" "}
                    {new Date(gastoSeleccionado.fecha).toLocaleDateString("es-AR")}
                  </p>
                  <p className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 break-all">
                    <strong>ID:</strong> {gastoSeleccionado._id}
                  </p>
                </div>

                <button
                  className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900"
                  onClick={() => setIsEditing(true)}
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
                  className="mt-3 bg-verdefluor hover:bg-verdefluort text-black font-semibold px-4 py-2 rounded-lg"
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
