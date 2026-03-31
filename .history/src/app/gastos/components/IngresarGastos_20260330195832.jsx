"use client";
import React, { useMemo, useState } from "react";
import useAddGasto from "@/hooks/useAddGasto";
import useClientes from "@/hooks/useClient";
import clsx from "clsx";

const IngresarGastos = () => {
  const { clientes } = useClientes();
  const [tipo, setTipo] = useState("materiaPrima");
  const [presupuestoClienteId, setPresupuestoClienteId] = useState("");
  const [confirmarClienteId, setConfirmarClienteId] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: "",
    lugar: "",
    precio: "",
  });
  const [empleado, setEmpleado] = useState("");
  const [diasDeTrabajo, setDiasDeTrabajo] = useState([]);
  const [tiposDePago, setTiposDePago] = useState([]);

  const fechaActual = new Date().toLocaleString();
  const { addGasto, loading, error, success } = useAddGasto();

  const presupuestosConSena = useMemo(() => {
    if (!Array.isArray(clientes)) return [];
    return clientes.filter(
      (c) =>
        c.problemType === "presupuesto" &&
        c.paymentOption === "seña" &&
        c.presupuestoGanancia
    );
  }, [clientes]);

  const presupuestosPendientes = useMemo(
    () =>
      presupuestosConSena.filter(
        (c) => c.presupuestoGanancia?.materiaPrimaEstado === "pendiente"
      ),
    [presupuestosConSena]
  );

  const handleConfirmarMateriaPrima = async () => {
    if (!confirmarClienteId) {
      alert("Seleccioná un presupuesto pendiente.");
      return;
    }
    try {
      setConfirmando(true);
      const res = await fetch("/api/ganancias/confirmar-presupuesto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clienteId: confirmarClienteId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo confirmar.");
      alert(
        `Cálculo confirmado. Materia prima: $${data.totalMateriaPrima?.toLocaleString?.("es-AR") ?? data.totalMateriaPrima}. Ganancia neta: $${data.gananciaNeta?.toLocaleString?.("es-AR") ?? data.gananciaNeta}.`
      );
      window.location.reload();
    } catch (err) {
      alert(err.message || "Error al confirmar.");
    } finally {
      setConfirmando(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleDiaTrabajo = (dia) => {
    setDiasDeTrabajo((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const toggleTipoDePago = (tipo) => {
    setTiposDePago((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let gasto;

    if (tipo === "sueldos") {
      gasto = {
        tipo,
        empleado,
        diasDeTrabajo,
        tipodepago: tiposDePago,
        precio: parseFloat(formData.precio),
        fecha: new Date(),
      };
    } else {
      gasto = {
        tipo,
        ...formData,
        precio: parseFloat(formData.precio),
        tipodepago: tiposDePago,
        fecha: new Date(),
        ...(tipo === "materiaPrima" && presupuestoClienteId
          ? { presupuestoClienteId }
          : {}),
      };
    }

    await addGasto(gasto);

    if (!error) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ingreso de Gastos</h1>
        <p className="text-gray-500 mt-1 text-sm">Registrar materia prima, gastos varios o sueldos</p>
      </header>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex gap-2 mb-6">
          {["materiaPrima", "gastoVario", "sueldos"].map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={clsx(
                "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors",
                tipo === t
                  ? "bg-verdefluor text-black border-verdefluor"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              )}
            >
              {t === "materiaPrima"
                ? "Materia Prima"
                : t === "gastoVario"
                ? "Gastos Varios"
                : "Sueldos"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tipo === "sueldos" ? (
            <>
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Empleado</span>
                <input
                  type="text"
                  value={empleado}
                  onChange={(e) => setEmpleado(e.target.value)}
                  required
                  placeholder="Nombre del empleado"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
              </label>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Días de trabajo</p>
                <div className="flex flex-wrap gap-2">
                  {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((dia) => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => toggleDiaTrabajo(dia)}
                      className={clsx(
                        "px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                        diasDeTrabajo.includes(dia)
                          ? "bg-verdefluor text-black border-verdefluor"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Forma de pago</p>
                <div className="flex flex-wrap gap-2">
                  {["efectivo", "transferencia"].map((t) => (
                    <label
                      key={t}
                      className={clsx(
                        "cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                        tiposDePago.includes(t)
                          ? "bg-verdefluor text-black border-verdefluor"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={tiposDePago.includes(t)}
                        onChange={() => toggleTipoDePago(t)}
                        className="hidden"
                      />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Importe a pagar</span>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  placeholder="Monto en pesos"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
              </label>
            </>
          ) : (
            <>
              {tipo === "materiaPrima" && (
                <>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-1 block">
                      Presupuesto (materia prima a descontar)
                    </span>
                    <select
                      value={presupuestoClienteId}
                      onChange={(e) => setPresupuestoClienteId(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-white"
                    >
                      <option value="">Sin vincular (compra general)</option>
                      {presupuestosConSena.map((c) => {
                        const id = String(c._id);
                        const pendiente =
                          c.presupuestoGanancia?.materiaPrimaEstado === "pendiente";
                        return (
                          <option key={id} value={id} disabled={!pendiente}>
                            {pendiente ? "[Pendiente MP]" : "[MP calculada]"}{" "}
                            {c.clientName}
                            {c.branch ? ` — ${c.branch}` : ""} ($
                            {Number(
                              c.presupuestoGanancia?.totalPresupuesto ?? c.totalTrabajo ?? 0
                            ).toLocaleString("es-AR")}
                            )
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Pendiente: aún no confirmaste el cálculo. Calculada: ya confirmaste; no podés seguir
                      vinculando gastos a ese presupuesto.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {presupuestosConSena.map((c) => {
                        const id = String(c._id);
                        const pendiente =
                          c.presupuestoGanancia?.materiaPrimaEstado === "pendiente";
                        return (
                          <span
                            key={id}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              pendiente
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${pendiente ? "bg-red-500" : "bg-emerald-500"}`}
                            />
                            {c.clientName}
                          </span>
                        );
                      })}
                    </div>
                  </label>

                  <div className="rounded-lg border border-dashed border-gray-300 p-4 bg-gray-50/80">
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      Confirmar cálculo de materia prima
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                      Cuando registraste todos los gastos de MP para un presupuesto, seleccioná el
                      cliente y confirmá para fijar la ganancia neta (presupuesto − suma de MP).
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      <select
                        value={confirmarClienteId}
                        onChange={(e) => setConfirmarClienteId(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                      >
                        <option value="">Elegir presupuesto pendiente…</option>
                        {presupuestosPendientes.map((c) => {
                          const id = String(c._id);
                          return (
                            <option key={id} value={id}>
                              {c.clientName}
                              {c.branch ? ` — ${c.branch}` : ""}
                            </option>
                          );
                        })}
                      </select>
                      <button
                        type="button"
                        onClick={handleConfirmarMateriaPrima}
                        disabled={confirmando || !confirmarClienteId}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-60"
                      >
                        {confirmando ? "Confirmando…" : "Confirmar cálculo"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">
                  {tipo === "materiaPrima" ? "Materia prima" : "Descripción"}
                </span>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Lugar de compra</span>
                <input
                  type="text"
                  name="lugar"
                  value={formData.lugar}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
              </label>

              <div>
                <span className="text-sm font-medium text-gray-700 mb-2 block">Tipo de pago</span>
                <div className="flex gap-2">
                  {["efectivo", "transferencia"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTipoDePago(t)}
                      className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-medium border transition-colors",
                        tiposDePago.includes(t)
                          ? "bg-verdefluor text-black border-verdefluor"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Precio</span>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
              </label>
            </>
          )}

          <p className="text-xs text-gray-500">
            Fecha y hora: {fechaActual}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-verdefluor hover:bg-verdefluort text-black font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? "Guardando..." : "Guardar gasto"}
          </button>

          {success && (
            <p className="text-sm font-medium text-green-600">Gasto guardado correctamente.</p>
          )}
          {error && <p className="text-sm text-red-600">Error: {error}</p>}
        </form>
      </div>
    </div>
  );
};

export default IngresarGastos;
