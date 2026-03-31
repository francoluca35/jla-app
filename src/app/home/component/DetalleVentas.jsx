"use client";

import React, { useMemo } from "react";
import useClientes from "@/hooks/useClient";

function formatMoneda(value) {
  if (value == null || isNaN(value)) return "$ 0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function dayKeyLocal(d) {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DetalleVentas() {
  const { clientes, loading } = useClientes();

  const { totalVendido, promedioDiario, pico, chartPoints } = useMemo(() => {
    const hoy = startOfDay(new Date());
    const inicio = addDays(hoy, -29);

    const porDia = new Map();
    for (let i = 0; i < 30; i++) {
      const d = addDays(inicio, i);
      porDia.set(dayKeyLocal(d), 0);
    }

    if (Array.isArray(clientes)) {
      for (const c of clientes) {
        if (!c?.date) continue;
        const f = new Date(c.date);
        const fStart = startOfDay(f);
        if (fStart < inicio || fStart > hoy) continue;
        const k = dayKeyLocal(f);
        if (!porDia.has(k)) continue;
        const monto = Number(c.amount ?? c.totalTrabajo ?? 0) || 0;
        porDia.set(k, (porDia.get(k) || 0) + monto);
      }
    }

    const valores = Array.from(porDia.values());
    const total = valores.reduce((a, b) => a + b, 0);
    const promedio = total / 30;
    const pico = valores.length ? Math.max(...valores) : 0;
    const maxDiaVal = pico || 1;

    const puntos = [];
    for (let i = 0; i < 30; i++) {
      const d = addDays(inicio, i);
      const v = porDia.get(dayKeyLocal(d)) || 0;
      const x = (i / 29) * 560;
      const y = 120 - (v / maxDiaVal) * 100;
      puntos.push(`${x},${Number.isFinite(y) ? y : 115}`);
    }
    const chartPoints = puntos.join(" ");

    return {
      totalVendido: total,
      promedioDiario: promedio,
      pico,
      chartPoints,
    };
  }, [clientes]);

  const yLabels = ["100%", "80%", "60%", "40%", "20%", "0%"];
  const xLabels = ["1", "5", "10", "15", "20", "25", "30"];

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="h-72 bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  const linePoints = chartPoints?.length ? chartPoints : "0,120 560,120";
  const areaPoints = `0,120 ${linePoints} 560,120`;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900 font-semibold">Detalle de ventas</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
          Últimos 30 días
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
          <p className="text-xs text-gray-500">Total vendido</p>
          <p className="text-lg font-bold text-gray-900">{formatMoneda(totalVendido)}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
          <p className="text-xs text-gray-500">Promedio diario</p>
          <p className="text-lg font-bold text-gray-900">{formatMoneda(promedioDiario)}</p>
        </div>
        <div className="rounded-xl bg-rose-50 border border-rose-100 p-3">
          <p className="text-xs text-gray-500">Pico de ventas</p>
          <p className="text-lg font-bold text-gray-900">{formatMoneda(pico)}</p>
        </div>
      </div>
      <div className="h-64 rounded-xl bg-gradient-to-b from-blue-50 to-white border border-blue-100 p-4">
        <div className="grid grid-cols-[46px_1fr] h-full">
          <div className="pr-2 flex flex-col justify-between text-[10px] text-gray-400">
            {yLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <svg viewBox="0 0 560 120" className="w-full h-full">
            {[20, 40, 60, 80, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="560"
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            ))}
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={linePoints}
            />
            <polyline fill="url(#areaFillVentas)" stroke="none" points={areaPoints} />
            <defs>
              <linearGradient id="areaFillVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.04" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="mt-2 pl-[46px] grid grid-cols-7 text-[10px] text-gray-400">
          {xLabels.map((label) => (
            <span key={label} className="text-center">
              Día {label}
            </span>
          ))}
        </div>
      </div>
      {totalVendido === 0 && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Sin ventas registradas en este período.
        </p>
      )}
    </div>
  );
}
