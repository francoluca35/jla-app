"use client";

import React, { useMemo, useState } from "react";
import useClientes from "@/hooks/useClient";
import useVentas from "@/hooks/useVentas";
import { CalendarDays, Users } from "lucide-react";

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date = new Date()) {
  return new Date(date.getFullYear(), 0, 1);
}

function getDateFromRecord(item) {
  const raw = item?.date ?? item?.fecha ?? item?.createdAt;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function withinPeriod(date, period) {
  if (!date) return false;
  const now = new Date();
  const start = period === "anual" ? startOfYear(now) : startOfMonth(now);
  return date >= start && date <= now;
}

export default function ClientesPeriodoPanel() {
  const [periodo, setPeriodo] = useState("mensual");
  const { clientes, loading: loadingC } = useClientes();
  const { ventas, loading: loadingV } = useVentas();
  const loading = loadingC || loadingV;

  const resumen = useMemo(() => {
    let servicioTecnico = 0;
    let presupuestoVenta = 0;

    if (Array.isArray(clientes)) {
      for (const c of clientes) {
        const f = getDateFromRecord(c);
        if (!withinPeriod(f, periodo)) continue;
        if (c.problemType === "arreglo") servicioTecnico += 1;
        if (c.problemType === "presupuesto") presupuestoVenta += 1;
      }
    }

    if (Array.isArray(ventas)) {
      for (const v of ventas) {
        const f = getDateFromRecord(v);
        if (!withinPeriod(f, periodo)) continue;
        presupuestoVenta += 1;
      }
    }

    const total = servicioTecnico + presupuestoVenta;
    return { servicioTecnico, presupuestoVenta, total };
  }, [clientes, ventas, periodo]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="h-40 bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-gray-900 font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Clientes por período
        </h2>
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setPeriodo("mensual")}
            className={`px-3 py-1.5 text-xs font-semibold ${
              periodo === "mensual" ? "bg-verdefluor text-black" : "bg-white text-gray-600"
            }`}
          >
            Mensual
          </button>
          <button
            type="button"
            onClick={() => setPeriodo("anual")}
            className={`px-3 py-1.5 text-xs font-semibold border-l border-gray-200 ${
              periodo === "anual" ? "bg-verdefluor text-black" : "bg-white text-gray-600"
            }`}
          >
            Anual
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-blue-50/60 text-gray-700">
            <tr>
              <th className="px-3 py-2.5 text-left font-semibold">Tipo</th>
              <th className="px-3 py-2.5 text-left font-semibold">Descripción</th>
              <th className="px-3 py-2.5 text-right font-semibold">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100">
              <td className="px-3 py-2.5 font-medium text-gray-800">Servicio técnico</td>
              <td className="px-3 py-2.5 text-gray-500">Clientes con tipo arreglo</td>
              <td className="px-3 py-2.5 text-right font-bold text-gray-900 tabular-nums">
                {resumen.servicioTecnico}
              </td>
            </tr>
            <tr className="border-t border-gray-100">
              <td className="px-3 py-2.5 font-medium text-gray-800">Presupuesto / venta</td>
              <td className="px-3 py-2.5 text-gray-500">Presupuestos + ventas registradas</td>
              <td className="px-3 py-2.5 text-right font-bold text-gray-900 tabular-nums">
                {resumen.presupuestoVenta}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50/70">
              <td colSpan={2} className="px-3 py-2.5 font-semibold text-gray-900">
                Total período
              </td>
              <td className="px-3 py-2.5 text-right font-bold text-gray-900 tabular-nums">
                {resumen.total}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500 flex items-center gap-1.5">
        <CalendarDays className="w-3.5 h-3.5" />
        {periodo === "mensual" ? "Mes en curso" : "Año en curso"}
      </p>
    </div>
  );
}
