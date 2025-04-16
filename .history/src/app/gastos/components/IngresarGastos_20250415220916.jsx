"use client";
import React, { useState } from "react";
import useAddGasto from "@/hooks/useAddGasto";
import clsx from "clsx";

const IngresarGastos = () => {
  const [tipo, setTipo] = useState("materiaPrima"); // valor inicial
  const [formData, setFormData] = useState({
    descripcion: "",
    lugar: "",
    precio: "",
  });

  const fechaActual = new Date().toLocaleString();
  const { addGasto, loading, error, success } = useAddGasto();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gasto = {
      tipo,
      ...formData,
      precio: parseFloat(formData.precio),
      fecha: new Date(),
    };
    await addGasto(gasto);
    setFormData({ descripcion: "", lugar: "", precio: "" });
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

        {/* Botones tipo toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTipo("materiaPrima")}
            className={clsx(
              "flex-1 p-3 rounded transition-all font-semibold",
              tipo === "materiaPrima"
                ? "bg-green-600"
                : "bg-gray-800 hover:bg-gray-600"
            )}
          >
            Materia Prima
          </button>
          <button
            onClick={() => setTipo("gastoVario")}
            className={clsx(
              "flex-1 p-3 rounded transition-all font-semibold",
              tipo === "gastoVario"
                ? "bg-green-600"
                : "bg-gray-800 hover:bg-gray-600"
            )}
          >
            Gastos Varios
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
