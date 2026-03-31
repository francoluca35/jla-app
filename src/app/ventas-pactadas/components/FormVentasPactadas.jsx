"use client";

import React, { useState } from "react";
import useAddVenta from "@/hooks/useAddVenta";
import {
  Briefcase,
  Package,
  UserRound,
  Building2,
  Phone,
  MapPin,
  Wallet,
  CalendarDays,
  Calculator,
} from "lucide-react";

const TIPOS_VENTA = [
  "horno",
  "freidora",
  "anafes",
  "camaras de fermentacion",
  "articulo de acero inox",
];
const METODOS_PAGO = ["efectivo", "transferencia"];

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

export default function FormVentasPactadas() {
  const [formData, setFormData] = useState({
    tipoVenta: TIPOS_VENTA[0],
    nombreProducto: "",
    vendidoA: "",
    nombreLugar: "",
    telefonoCliente: "",
    direccionLugar: "",
    cantidad: 1,
    precioUnidad: "",
    metodoPago: METODOS_PAGO[0],
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
      nombreLugar: formData.nombreLugar.trim(),
      telefonoCliente: formData.telefonoCliente.trim(),
      direccionLugar: formData.direccionLugar.trim(),
      cantidad,
      precioUnidad,
      metodoPago: formData.metodoPago,
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
        nombreLugar: "",
        telefonoCliente: "",
        direccionLugar: "",
        cantidad: 1,
        precioUnidad: "",
        metodoPago: METODOS_PAGO[0],
        sena: false,
        fechaVenta: hoyISO(),
      }));
    }
  };

  const totalEstimado = (
    Number(formData.cantidad || 0) * Number(formData.precioUnidad || 0)
  ).toLocaleString("es-AR");

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-gray-200 p-4 md:p-6 bg-gradient-to-b from-slate-50 to-white">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-700" />
              Datos comerciales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block md:col-span-2">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Tipo de venta</span>
                <select
                  name="tipoVenta"
                  value={formData.tipoVenta}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-verdefluor"
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
                <div className="relative">
                  <Package className="w-4 h-4 text-gray-400 absolute left-3 inset-y-0 my-auto pointer-events-none" />
                  <input
                    type="text"
                    name="nombreProducto"
                    value={formData.nombreProducto}
                    onChange={handleChange}
                    placeholder="Ej. Horno convector 12 bandejas"
                    className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-verdefluor"
                    required
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-4 md:p-6 bg-gradient-to-b from-slate-50 to-white">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4 flex items-center gap-2">
              <UserRound className="w-4 h-4 text-slate-700" />
              Datos del cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block md:col-span-2">
                <span className="text-sm font-medium text-gray-700 mb-1 block">
                  Nombre de cliente
                </span>
                <div className="relative">
                  <UserRound className="w-4 h-4 text-gray-400 absolute left-3 inset-y-0 my-auto pointer-events-none" />
                  <input
                    type="text"
                    name="vendidoA"
                    value={formData.vendidoA}
                    onChange={handleChange}
                    placeholder="Ej. Juan Perez"
                    className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-verdefluor"
                    required
                  />
                </div>
              </label>

              <label className="block md:col-span-2">
                <span className="text-sm font-medium text-gray-700 mb-1 block">
                  Nombre del lugar
                </span>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 inset-y-0 my-auto pointer-events-none" />
                  <input
                    type="text"
                    name="nombreLugar"
                    value={formData.nombreLugar}
                    onChange={handleChange}
                    placeholder="Ej. Panadería San Martín (opcional)"
                    className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-verdefluor"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">
                  Teléfono del cliente
                </span>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 inset-y-0 my-auto pointer-events-none" />
                  <input
                    type="text"
                    name="telefonoCliente"
                    value={formData.telefonoCliente}
                    onChange={handleChange}
                    placeholder="Ej. +54 11 1234-5678"
                    className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-verdefluor"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">
                  Dirección del lugar
                </span>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 inset-y-0 my-auto pointer-events-none" />
                  <input
                    type="text"
                    name="direccionLugar"
                    value={formData.direccionLugar}
                    onChange={handleChange}
                    placeholder="Ej. Av. Siempre Viva 742, CABA"
                    className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-verdefluor"
                    required
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-4 md:p-6 bg-gradient-to-b from-slate-50 to-white">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-slate-700" />
              Condiciones de venta
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-verdefluor"
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-verdefluor"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">
                  Método de pago
                </span>
                <select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-verdefluor"
                  required
                >
                  {METODOS_PAGO.map((metodo) => (
                    <option key={metodo} value={metodo}>
                      {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">
                  Fecha de venta
                </span>
                <div className="relative">
                  <CalendarDays className="w-4 h-4 text-gray-400 absolute left-3 inset-y-0 my-auto pointer-events-none" />
                  <input
                    type="date"
                    name="fechaVenta"
                    value={formData.fechaVenta}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-verdefluor"
                    required
                  />
                </div>
              </label>
            </div>
          </section>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <span className="text-sm text-black">
              Esta venta se considera siempre desde stock. El total se computa como 100% ganancia.
            </span>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-sm text-gray-600 inline-flex items-center gap-2">
              <Calculator className="w-4 h-4 text-gray-500" />
              Total estimado de la operación
            </p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">$ {totalEstimado}</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-verdefluor hover:bg-verdefluort text-black font-semibold py-3 rounded-xl transition-colors disabled:opacity-70 shadow-sm"
          >
            {loading ? "Generando venta..." : "Generar venta"}
          </button>

          {success && (
            <p className="text-sm font-medium text-green-600">Venta generada correctamente.</p>
          )}
          {error && <p className="text-sm text-red-600">Error: {error}</p>}
        </form>
      </div>
    </div>
  );
}
