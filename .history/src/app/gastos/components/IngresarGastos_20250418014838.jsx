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
    <div
      className="min-h-screen p-6 text-white"
      style={{
        backgroundImage: "url('/Assets/formclient.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md mx-auto bg-black bg-opacity-70 p-6 rounded-xl">
        <h2 className="text-2xl mb-6 font-bold text-center">Ingresar Gasto</h2>

        {/* Botones de selección de tipo de gasto */}
        <div className="flex gap-2 mb-6">
          {["materiaPrima", "gastoVario", "sueldos"].map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={clsx(
                "flex-1 p-3 rounded transition-all font-semibold capitalize",
                tipo === t ? "bg-green-600" : "bg-gray-800 hover:bg-gray-600"
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
              <label className="flex flex-col">
                <span className="mb-1 font-semibold">Empleado</span>
                <input
                  type="text"
                  value={empleado}
                  onChange={(e) => setEmpleado(e.target.value)}
                  required
                  placeholder="Nombre del empleado"
                  className="p-3 rounded w-full text-black border border-gray-300"
                />
              </label>

              <div>
                <p className="mb-2 font-semibold">Días de trabajo:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Lunes",
                    "Martes",
                    "Miércoles",
                    "Jueves",
                    "Viernes",
                    "Sábado",
                  ].map((dia) => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => toggleDiaTrabajo(dia)}
                      className={clsx(
                        "px-4 py-2 rounded-full border text-sm font-medium",
                        diasDeTrabajo.includes(dia)
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                      )}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mt-4 mb-2 font-semibold">Forma de pago:</p>
                <div className="flex flex-wrap gap-2">
                  {["efectivo", "transferencia"].map((tipo) => (
                    <label
                      key={tipo}
                      className={clsx(
                        "cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full text-sm border",
                        tiposDePago.includes(tipo)
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={tiposDePago.includes(tipo)}
                        onChange={() => toggleTipoDePago(tipo)}
                        className="hidden"
                      />
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex flex-col">
                <span className="mb-1 font-semibold">Importe a pagar</span>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  placeholder="Monto en pesos"
                  className="p-3 rounded w-full text-black border border-gray-300"
                />
              </label>
            </>
          ) : (
            <>
              <label>
                {tipo === "materiaPrima" ? "Materia prima" : "Gasto vario"}
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  className="p-3 rounded w-full text-black"
                />
              </label>

              <label>
                Lugar de compra
                <input
                  type="text"
                  name="lugar"
                  value={formData.lugar}
                  onChange={handleChange}
                  required
                  className="p-3 rounded w-full text-black"
                />
              </label>

              <div className="flex gap-2">
                <label>
                  tipo de pago
                  <button
                    type="button"
                    onClick={() => toggleTipoDePago("efectivo")}
                    className={clsx(
                      "flex-1 p-2 rounded font-semibold",
                      tiposDePago.includes("efectivo")
                        ? "bg-green-600"
                        : "bg-gray-800 hover:bg-gray-600"
                    )}
                  >
                    Efectivo
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTipoDePago("transferencia")}
                    className={clsx(
                      "flex-1 p-2 rounded font-semibold",
                      tiposDePago.includes("transferencia")
                        ? "bg-green-600"
                        : "bg-gray-800 hover:bg-gray-600"
                    )}
                  >
                    Transferencia
                  </button>
                </label>
              </div>

              <label>
                Precio
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  className="p-3 rounded w-full text-black"
                />
              </label>
            </>
          )}

          <p className="text-sm text-green-300">
            Fecha y hora actual: {fechaActual}
          </p>

          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white p-3 rounded font-bold"
          >
            {loading ? "Guardando..." : "Guardar Gasto"}
          </button>

          {success && (
            <p className="text-green-400 font-medium">
              ¡Gasto guardado con éxito!
            </p>
          )}
          {error && <p className="text-red-500">Error: {error}</p>}
        </form>
      </div>
    </div>
  );
};

export default IngresarGastos;
