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
      `Metodo de pago: ${venta.metodoPago || "-"}`,
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

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="hidden lg:block">
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold">
                <th className="p-2 lg:p-3 text-left w-[11%] min-w-0">Fecha</th>
                <th className="p-2 lg:p-3 text-left min-w-0 w-[18%]">Cliente</th>
                <th className="p-2 lg:p-3 text-left min-w-0">Producto</th>
                <th className="p-2 lg:p-3 text-left w-[10%] min-w-0">Tipo</th>
                <th className="p-2 lg:p-3 text-right w-[9%] min-w-0">Cant.</th>
                <th className="p-2 lg:p-3 text-right w-[12%] min-w-0">Total</th>
                <th className="p-2 lg:p-3 text-center w-[100px] min-w-0">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta, index) => (
                <tr
                  key={venta._id || index}
                  className={`text-gray-800 border-b border-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="p-2 lg:p-3 whitespace-nowrap text-xs lg:text-sm">{formatFecha(venta.fechaVenta)}</td>
                  <td className="p-2 lg:p-3 min-w-0 break-words">{venta.vendidoA || "-"}</td>
                  <td className="p-2 lg:p-3 min-w-0 break-words">{venta.nombreProducto || "-"}</td>
                  <td className="p-2 lg:p-3 capitalize min-w-0 truncate" title={venta.tipoVenta || ""}>
                    {venta.tipoVenta || "-"}
                  </td>
                  <td className="p-2 lg:p-3 text-right tabular-nums">{Number(venta.cantidad || 0)}</td>
                  <td className="p-2 lg:p-3 font-semibold text-right tabular-nums">{formatMoneda(venta.total)}</td>
                  <td className="p-2 lg:p-3 text-center">
                    <button
                      type="button"
                      onClick={() => setVentaSeleccionada(venta)}
                      className="px-2 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-100"
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
                <td className="p-2 lg:p-3" colSpan={5}>
                  Total acumulado
                </td>
                <td className="p-2 lg:p-3 text-right tabular-nums">{formatMoneda(totalImporte)}</td>
                <td className="p-2 lg:p-3" />
              </tr>
            </tfoot>
          </table>
        </div>

        <ul className="lg:hidden divide-y divide-gray-100">
          {ventas.length === 0 ? (
            <li className="p-6 text-center text-sm text-gray-500">No hay ventas registradas.</li>
          ) : (
            ventas.map((venta, index) => (
              <li
                key={venta._id || index}
                className={`p-4 space-y-2 text-sm ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
              >
                <div className="flex justify-between gap-2 items-start">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 break-words">{venta.nombreProducto || "—"}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{venta.vendidoA || "—"}</p>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0 whitespace-nowrap">{formatFecha(venta.fechaVenta)}</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                  <span className="capitalize">Tipo: {venta.tipoVenta || "—"}</span>
                  <span>Cant.: {Number(venta.cantidad || 0)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="font-bold text-gray-900 tabular-nums">{formatMoneda(venta.total)}</span>
                  <button
                    type="button"
                    onClick={() => setVentaSeleccionada(venta)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 shrink-0"
                  >
                    Ver venta
                  </button>
                </div>
              </li>
            ))
          )}
          {ventas.length > 0 && (
            <li className="p-4 bg-gray-100 font-semibold text-gray-900 text-sm flex justify-between gap-2">
              <span>Total acumulado</span>
              <span className="tabular-nums">{formatMoneda(totalImporte)}</span>
            </li>
          )}
        </ul>
      </div>

      {ventaSeleccionada && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px] overflow-y-auto p-3 sm:p-4 flex items-start justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Comprobante de venta</p>
                  <h2 className="text-lg sm:text-xl font-semibold mt-1 break-words">
                    #{String(ventaSeleccionada._id || "SIN-ID").slice(-8).toUpperCase()}
                  </h2>
                </div>
                <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium whitespace-nowrap capitalize">
                  {ventaSeleccionada.tipoVenta || "sin tipo"}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">Fecha</p>
                  <p className="text-sm font-semibold text-gray-900 break-words">{formatFecha(ventaSeleccionada.fechaVenta)}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">Cliente</p>
                  <p className="text-sm font-semibold text-gray-900 break-words">{ventaSeleccionada.vendidoA || "-"}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 sm:col-span-2">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">Producto</p>
                  <p className="text-sm font-semibold text-gray-900 break-words">{ventaSeleccionada.nombreProducto || "-"}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 sm:col-span-2">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">Dirección</p>
                  <p className="text-sm font-semibold text-gray-900 break-words">{ventaSeleccionada.direccionLugar || "-"}</p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                  <span className="col-span-5">Detalle</span>
                  <span className="col-span-2 text-right">Cant.</span>
                  <span className="col-span-2 text-right">P. unit</span>
                  <span className="col-span-3 text-right">Subtotal</span>
                </div>
                <div className="grid grid-cols-12 items-start border-t border-gray-200 px-3 py-3 text-sm text-gray-800 gap-y-1">
                  <span className="col-span-5 break-words pr-2">{ventaSeleccionada.nombreProducto || "-"}</span>
                  <span className="col-span-2 text-right tabular-nums">{Number(ventaSeleccionada.cantidad || 0)}</span>
                  <span className="col-span-2 text-right tabular-nums">{formatMoneda(ventaSeleccionada.precioUnidad)}</span>
                  <span className="col-span-3 text-right tabular-nums font-semibold">{formatMoneda(ventaSeleccionada.total)}</span>
                </div>
                <div className="border-t border-dashed border-gray-300 px-3 py-3 bg-verdefluor/20 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">Total</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 tabular-nums">{formatMoneda(ventaSeleccionada.total)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border bg-violet-50 text-violet-700 border-violet-200 capitalize">
                  Pago: {ventaSeleccionada.metodoPago || "-"}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
                    ventaSeleccionada.sena ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  Seña: {ventaSeleccionada.sena ? "Sí" : "No"}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
                    ventaSeleccionada.ventaDesdeStock ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  Desde stock: {ventaSeleccionada.ventaDesdeStock ? "Sí" : "No"}
                </span>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={() => generarComprobante(ventaSeleccionada)}
                className="bg-verdefluor text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-verdefluort"
              >
                Generar comprobante
              </button>
              <button
                type="button"
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
