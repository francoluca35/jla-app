"use client";

import React, { useMemo } from "react";
import useClientes from "@/hooks/useClient";
import useVentas from "@/hooks/useVentas";
import { TrendingUp } from "lucide-react";

function formatMoneda(value) {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function GananciasPanel() {
  const { clientes, loading: loadingC } = useClientes();
  const { ventas, loading: loadingV } = useVentas();
  const loading = loadingC || loadingV;

  const resumen = useMemo(() => {
    let sTecnico = 0;
    let presupuestoNeto = 0;
    let presupuestoDirecto = 0;
    let ventasStock = 0;

    if (Array.isArray(clientes)) {
      for (const c of clientes) {
        const monto = Number(c.amount ?? c.totalTrabajo ?? 0);

        if (c.problemType === "arreglo" && c.estado === "terminado") {
          sTecnico += monto;
        }

        if (c.problemType === "presupuesto" && c.paymentOption === "seña" && c.presupuestoGanancia) {
          if (c.presupuestoGanancia.materiaPrimaEstado === "calculado") {
            presupuestoNeto += Number(c.presupuestoGanancia.gananciaNeta ?? 0);
          }
        }

        if (
          c.problemType === "presupuesto" &&
          c.estado === "terminado" &&
          c.paymentOption &&
          c.paymentOption !== "seña"
        ) {
          presupuestoDirecto += monto;
        }
      }
    }

    if (Array.isArray(ventas)) {
      for (const v of ventas) {
        if (v.ventaDesdeStock) {
          ventasStock += Number(v.total ?? 0);
        }
      }
    }

    const total = sTecnico + presupuestoNeto + presupuestoDirecto + ventasStock;

    return {
      sTecnico,
      presupuestoNeto,
      presupuestoDirecto,
      ventasStock,
      total,
    };
  }, [clientes, ventas]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="h-40 bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  const filas = [
    { label: "S. técnico (arreglo terminado)", value: resumen.sTecnico, hint: "100% del ingreso" },
    {
      label: "Presupuestos total terminados (MP calculada)",
      value: resumen.presupuestoNeto + resumen.presupuestoDirecto,
      hint: "Seña (neto) + pago total terminado",
    },
    {
      label: "Ventas desde stock",
      value: resumen.ventasStock,
      hint: "100% del total de la venta",
    },
  ];
  return (
    <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-gray-900 font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Ganancias
        </h2>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50/70 text-gray-700">
            <tr>
              <th className="px-3 py-2.5 text-left font-semibold">Concepto</th>
              <th className="px-3 py-2.5 text-left font-semibold">Detalle</th>
              <th className="px-3 py-2.5 text-right font-semibold">Monto</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.label} className="border-t border-gray-100">
                <td className="px-3 py-2.5 font-medium text-gray-800">{f.label}</td>
                <td className="px-3 py-2.5 text-gray-500">{f.hint}</td>
                <td className="px-3 py-2.5 text-right font-bold text-gray-900 tabular-nums">
                  {formatMoneda(f.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-4 border-t border-emerald-100 flex items-center justify-between gap-2">
        <span className="font-semibold text-gray-900">Total ganancias</span>
        <span className="text-lg font-bold text-green-700 tabular-nums">{formatMoneda(resumen.total)}</span>
      </div>
    </div>
  );
}
