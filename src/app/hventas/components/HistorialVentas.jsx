"use client";

import React, { useEffect, useMemo, useState } from "react";
import useVentas from "@/hooks/useVentas";

function formatMoneda(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatFecha(fecha) {
  if (!fecha) return "-";
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("es-AR");
}

export default function HistorialVentas() {
  const { ventas, loading, error } = useVentas();
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  useEffect(() => {
    if (ventaSeleccionada) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [ventaSeleccionada]);

  const totalImporte = useMemo(
    () => ventas.reduce((acc, venta) => acc + Number(venta.total || 0), 0),
    [ventas]
  );

  const generarComprobante = async (venta) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const y0 = 20;

    doc.setFontSize(16);
    doc.text("Comprobante de venta", 14, y0);
    doc.setFontSize(11);

    const lineas = [
      `Fecha: ${formatFecha(venta.fechaVenta)}`,
      `Tipo de venta: ${venta.tipoVenta || "-"}`,
      `Producto: ${venta.nombreProducto || "-"}`,
      `Cliente: ${venta.vendidoA || "-"}`,
      `Direccion: ${venta.direccionLugar || "-"}`,
      `Cantidad: ${venta.cantidad || 0}`,
      `Precio por unidad: ${formatMoneda(venta.precioUnidad)}`,
      `Total: ${formatMoneda(venta.total)}`,
      `Sena: ${venta.sena ? "Si" : "No"}`,
      `Venta desde stock: ${venta.ventaDesdeStock ? "Si" : "No"}`,
    ];

    lineas.forEach((linea, index) => {
      doc.text(linea, 14, y0 + 12 + index * 8);
    });

    const nombre = `comprobante-venta-${(venta._id || "sin-id").toString()}.pdf`;
    doc.save(nombre);
  };

  if (loading) return <div className="text-gray-600 py-8">Cargando ventas...</div>;
  if (error) return <div className="text-red-600 py-8">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historial de ventas</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Consultá ventas pactadas y abrí cada una para ver su detalle completo.
        </p>
      </header>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-700 text-sm font-semibold">
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Cantidad</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-center">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, index) => (
              <tr
                key={venta._id || index}
                className={`text-sm text-gray-800 border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="p-3">{formatFecha(venta.fechaVenta)}</td>
                <td className="p-3">{venta.vendidoA || "-"}</td>
                <td className="p-3">{venta.nombreProducto || "-"}</td>
                <td className="p-3 capitalize">{venta.tipoVenta || "-"}</td>
                <td className="p-3">{Number(venta.cantidad || 0)}</td>
                <td className="p-3 font-semibold">{formatMoneda(venta.total)}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => setVentaSeleccionada(venta)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Ver venta
                  </button>
                </td>
              </tr>
            ))}
            {ventas.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-sm text-gray-500">
                  No hay ventas registradas.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold text-gray-900 text-sm">
              <td className="p-3" colSpan={5}>
                Total acumulado
              </td>
              <td className="p-3">{formatMoneda(totalImporte)}</td>
              <td className="p-3" />
            </tr>
          </tfoot>
        </table>
      </div>

      {ventaSeleccionada && (
        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto p-4 flex items-start justify-center">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detalle de venta</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <p>
                <span className="font-semibold text-gray-700">Fecha:</span>{" "}
                {formatFecha(ventaSeleccionada.fechaVenta)}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Tipo:</span>{" "}
                <span className="capitalize">{ventaSeleccionada.tipoVenta || "-"}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Producto:</span>{" "}
                {ventaSeleccionada.nombreProducto || "-"}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Cantidad:</span>{" "}
                {Number(ventaSeleccionada.cantidad || 0)}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Precio unidad:</span>{" "}
                {formatMoneda(ventaSeleccionada.precioUnidad)}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Importe total:</span>{" "}
                {formatMoneda(ventaSeleccionada.total)}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Seña:</span>{" "}
                {ventaSeleccionada.sena ? "Sí" : "No"}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Venta desde stock:</span>{" "}
                {ventaSeleccionada.ventaDesdeStock ? "Sí" : "No"}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Cliente:</span>{" "}
                {ventaSeleccionada.vendidoA || "-"}
              </p>
              <p className="sm:col-span-2">
                <span className="font-semibold text-gray-700">Dirección:</span>{" "}
                {ventaSeleccionada.direccionLugar || "-"}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => generarComprobante(ventaSeleccionada)}
                className="bg-verdefluor text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-verdefluort"
              >
                Generar comprobante
              </button>
              <button
                onClick={() => setVentaSeleccionada(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
