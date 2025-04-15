"use client";
import React, { useState } from "react";

const IngresarGastos = () => {
  const [tipo, setTipo] = useState("");
  const [formData, setFormData] = useState({
    descripcion: "",
    lugar: "",
    precio: "",
  });

  const fechaActual = new Date().toLocaleString();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const gasto = {
      tipo,
      ...formData,
      fecha: new Date(),
    };
    console.log("Guardando gasto:", gasto);
    // Acá deberías guardar en tu BD
    setFormData({ descripcion: "", lugar: "", precio: "" });
    setTipo("");
  };

  return (
    <div className="p-4 bg-gray-800 rounded-xl text-white">
      <h2 className="text-lg mb-4 font-bold">Ingresar Gasto</h2>

      <select
        className="mb-4 p-2 bg-gray-700 rounded w-full"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="">Seleccionar tipo de gasto</option>
        <option value="materiaPrima">Gastos de materia prima</option>
        <option value="gastoVario">Gastos varios</option>
      </select>

      {tipo && (
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
            Guardar Gasto
          </button>
        </form>
      )}
    </div>
  );
};

export default IngresarGastos;
