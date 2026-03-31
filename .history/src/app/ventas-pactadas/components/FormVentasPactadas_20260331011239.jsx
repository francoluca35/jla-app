"use client";

import React, { useState } from "react";
import useAddVenta from "@/hooks/useAddVenta";

const TIPOS_VENTA = [
  "horno",
  "freidora",
  "anafes",
  "camaras de fermentacion",
  "articulo de acero inox",
];

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

export default function FormVentasPactadas() {
  const [formData, setFormData] = useState({
    tipoVenta: TIPOS_VENTA[0],
    nombreProducto: "",
    vendidoA: "",
    direccionLugar: "",
    cantidad: 1,
    precioUnidad: "",
    sena: false,
    fechaVenta: hoyISO(),
  });
  const { addVenta, loading, success, error } = useAddVenta();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cantidad = Number(formData.cantidad);
    const precioUnidad = Number(formData.precioUnidad);
    const total = cantidad * precioUnidad;

    const payload = {
      tipoVenta: formData.tipoVenta,
      nombreProducto: formData.nombreProducto.trim(),
      vendidoA: formData.vendidoA.trim(),
      direccionLugar: formData.direccionLugar.trim(),
      cantidad,
      precioUnidad,
      total,
      sena: Boolean(formData.sena),
      ventaDesdeStock: true,
      fechaVenta: formData.fechaVenta,
      createdAt: new Date().toISOString(),
    };

    const result = await addVenta(payload);
    if (result?.success) {
      setFormData((prev) => ({
        ...prev,
        nombreProducto: "",
        vendidoA: "",
        direccionLugar: "",
        cantidad: 1,
        precioUnidad: "",
        sena: false,
        fechaVenta: hoyISO(),
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ventas pactadas</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Registrá acuerdos de venta para seguimiento comercial.
        </p>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-gray-700 mb-1 block">Tipo de venta</span>
            <select
              name="tipoVenta"
              value={formData.tipoVenta}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 bg-white"
              required
            >
              {TIPOS_VENTA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-gray-700 mb-1 block">
              Nombre del producto
            </span>
            <input
              type="text"
              name="nombreProducto"
              value={formData.nombreProducto}
              onChange={handleChange}
              placeholder="Ej. Horno convector 12 bandejas"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
              required
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-gray-700 mb-1 block">
              A quién se lo vendí
            </span>
            <input
              type="text"
              name="vendidoA"
              value={formData.vendidoA}
              onChange={handleChange}
              placeholder="Ej. Panadería San Martín"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
              required
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-gray-700 mb-1 block">
              Dirección del lugar
            </span>
            <input
              type="text"
              name="direccionLugar"
              value={formData.direccionLugar}
              onChange={handleChange}
              placeholder="Ej. Av. Siempre Viva 742, CABA"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1 block">
              Cantidad del producto
            </span>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              min="1"
              step="1"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1 block">
              Precio por unidad
            </span>
            <input
              type="number"
              name="precioUnidad"
              value={formData.precioUnidad}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
              required
            />
          </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1 block">Fecha de venta</span>
            <input
              type="date"
              name="fechaVenta"
              value={formData.fechaVenta}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
              required
            />
          </label>
</div>
    

          <div className="px-4 py-2.5 border border-emerald-200 bg-emerald-50 rounded-lg md:col-span-2">
            <span className="text-sm text-black">
              Esta venta se considera siempre desde stock. El total se computa como 100% ganancia.
            </span>
          </div>

          <div className="md:col-span-2 mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-600">
              Total estimado:{" "}
              <span className="font-semibold text-gray-900">
                ${" "}
                {(
                  Number(formData.cantidad || 0) * Number(formData.precioUnidad || 0)
                ).toLocaleString("es-AR")}
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 mt-2 bg-verdefluor hover:bg-verdefluort text-black font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? "Generando venta..." : "Generar venta"}
          </button>

          {success && (
            <p className="md:col-span-2 text-sm font-medium text-green-600">
              Venta generada correctamente.
            </p>
          )}
          {error && <p className="md:col-span-2 text-sm text-red-600">Error: {error}</p>}
        </form>
      </div>
    </div>
  );
}
