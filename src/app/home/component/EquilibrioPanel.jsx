"use client";

import React, { useMemo, useState } from "react";
import useClientes from "@/hooks/useClient";
import useVentas from "@/hooks/useVentas";
import { useGastos } from "@/hooks/UseGastos";
import { PieChart } from "lucide-react";

function formatMoneda(value) {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

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

function buildPieStyle(ganancias, perdidas) {
  const total = ganancias + perdidas;
  if (!total) return { background: "#e5e7eb" };
  const gPct = (ganancias / total) * 100;
  return {
    background: `conic-gradient(#10b981 0% ${gPct}%, #f43f5e ${gPct}% 100%)`,
  };
}

export default function EquilibrioPanel() {
  const [periodo, setPeriodo] = useState("mensual");
  const { clientes, loading: loadingC } = useClientes();
  const { ventas, loading: loadingV } = useVentas();
  const { gastos, loading: loadingG } = useGastos({});
  const loading = loadingC || loadingV || loadingG;

  const resumen = useMemo(() => {
    let ganancias = 0;
    let perdidas = 0;

    if (Array.isArray(clientes)) {
      for (const c of clientes) {
        const f = getDateFromRecord(c);
        if (!withinPeriod(f, periodo)) continue;

        const monto = Number(c.amount ?? c.totalTrabajo ?? 0) || 0;

        if (c.problemType === "arreglo" && c.estado === "terminado") {
          ganancias += monto;
        }

        if (c.problemType === "presupuesto" && c.paymentOption === "seña" && c.presupuestoGanancia) {
          if (c.presupuestoGanancia.materiaPrimaEstado === "calculado") {
            ganancias += Number(c.presupuestoGanancia.gananciaNeta ?? 0);
          }
        }

        if (
          c.problemType === "presupuesto" &&
          c.estado === "terminado" &&
          c.paymentOption &&
          c.paymentOption !== "seña"
        ) {
          ganancias += monto;
        }
      }
    }

    if (Array.isArray(ventas)) {
      for (const v of ventas) {
        const f = getDateFromRecord(v);
        if (!withinPeriod(f, periodo)) continue;
        if (v.ventaDesdeStock) {
          ganancias += Number(v.total ?? 0) || 0;
        }
      }
    }

    if (Array.isArray(gastos)) {
      for (const g of gastos) {
        const f = getDateFromRecord(g);
        if (!withinPeriod(f, periodo)) continue;
        perdidas += Number(g.precio ?? g.monto ?? 0) || 0;
      }
    }

    return {
      ganancias,
      perdidas,
      balance: ganancias - perdidas,
    };
  }, [clientes, ventas, gastos, periodo]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="h-56 bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  const pieStyle = buildPieStyle(resumen.ganancias, resumen.perdidas);
  const totalMovido = resumen.ganancias + resumen.perdidas;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-gray-900 font-semibold flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-600" />
          Equilibrio ganancias vs pérdidas
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

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 items-center">
        <div className="flex justify-center">
          <div className="relative w-44 h-44 rounded-full" style={pieStyle}>
            <div className="absolute inset-6 rounded-full bg-white border border-gray-100 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wide text-gray-500">Movimiento</p>
                <p className="text-xs font-bold text-gray-900 tabular-nums">{formatMoneda(totalMovido)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2">
            <span className="font-medium text-gray-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Ganancias ({periodo})
            </span>
            <span className="font-bold text-gray-900 tabular-nums">{formatMoneda(resumen.ganancias)}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2">
            <span className="font-medium text-gray-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Pérdidas ({periodo})
            </span>
            <span className="font-bold text-gray-900 tabular-nums">{formatMoneda(resumen.perdidas)}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 mt-3">
            <span className="font-semibold text-gray-900">Balance</span>
            <span className={`font-bold tabular-nums ${resumen.balance >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
              {formatMoneda(resumen.balance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
