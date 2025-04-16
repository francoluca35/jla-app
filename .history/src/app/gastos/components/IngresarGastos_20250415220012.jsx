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
    <div className="p-4 bg-fondo2 rounded-xl text-white">
      <h2 className="text-lg mb-4 font-bold text-center">Ingresar Gasto</h2>

      {/* Botones tipo toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTipo("materiaPrima")}
          className={clsx(
            "flex-1 p-2 rounded transition-all",
            tipo === "materiaPrima"
              ? "bg-green-800"
              : "bg-gray-900 hover:bg-gray-600"
          )}
        >
          Materia Prima
        </button>
        <button
          onClick={() => setTipo("gastoVario")}
          className={clsx(
            "flex-1 p-2 rounded transition-all",
            tipo === "gastoVario"
              ? "bg-green-800"
              : "bg-gray-900 hover:bg-gray-600"
          )}
        >
          Gasto Vario
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>
          {tipo === "materiaPrima" ? "Materia prima" : "Gasto vario"}
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            className="p-2 rounded w-full text-black"
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
            className="p-2 rounded w-full text-black"
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
            className="p-2 rounded w-full text-black"
          />
        </label>

        <p>Fecha y hora actual: {fechaActual}</p>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
        >
          {loading ? "Guardando..." : "Guardar Gasto"}
        </button>

        {success && (
          <p className="text-green-400">¡Gasto guardado con éxito!</p>
        )}
        {error && <p className="text-red-500">Error: {error}</p>}
      </form>
    </div>
  );
};

export default IngresarGastos;
