"use client";
import React, { useState } from "react";
import useAddGasto from "@/hooks/useAddGasto";
import clsx from "clsx";

const IngresarGastos = () => {
  const [tipo, setTipo] = useState("materiaPrima");
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
