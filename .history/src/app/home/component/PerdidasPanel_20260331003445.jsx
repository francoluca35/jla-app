"use client";

import React, { useMemo } from "react";
import { TrendingDown } from "lucide-react";
import { useGastos } from "@/hooks/UseGastos";

function formatMoneda(value) {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeTipo(tipo) {
  const t = String(tipo || "").toLowerCase();
  if (t.includes("materia")) return "Materia prima";
  if (t.includes("sueldo")) return "Sueldos";
  if (t.includes("vario")) return "Gastos varios";
  if (!t) return "Sin tipo";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export default function PerdidasPanel() {
  const { gastos, loading } = useGastos({});

  const resumen = useMemo(() => {
    const porTipo = new Map();

    if (Array.isArray(gastos)) {
      for (const g of gastos) {
        const key = normalizeTipo(g.tipo);
        const monto = Number(g.precio ?? g.monto ?? 0) || 0;
        porTipo.set(key, (porTipo.get(key) || 0) + monto);
      }
    }

    const filas = Array.from(porTipo.entries())
      .map(([label, value]) => ({
        label,
        value,
        hint: "Acumulado registrado",
      }))
      .sort((a, b) => b.value - a.value);

    const total = filas.reduce((acc, f) => acc + f.value, 0);
    return { filas, total };
  }, [gastos]);

  if (loading) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm">
        <div className="h-40 bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  const filasMostrar =
    resumen.filas.length > 0
      ? resumen.filas
      : [{ label: "Sin egresos", value: 0, hint: "No hay gastos cargados" }];

  return (
    <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-gray-900 font-semibold flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-rose-600" />
          Pérdidas
        </h2>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-rose-50/70 text-gray-700">
            <tr>
              <th className="px-3 py-2.5 text-left font-semibold">Concepto</th>
              <th className="px-3 py-2.5 text-left font-semibold">Detalle</th>
              <th className="px-3 py-2.5 text-right font-semibold">Monto</th>
            </tr>
          </thead>
          <tbody>
            {filasMostrar.map((f) => (
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
      <div className="mt-4 pt-4 border-t border-rose-100 flex items-center justify-between gap-2">
        <span className="font-semibold text-gray-900">Total pérdidas</span>
        <span className="text-lg font-bold text-red-700 tabular-nums">{formatMoneda(resumen.total)}</span>
      </div>
    </div>
  );
}
