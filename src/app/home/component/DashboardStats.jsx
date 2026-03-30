"use client";

import React, { useEffect, useState } from "react";
import useClientes from "@/hooks/useClient";
import { useGastos } from "@/hooks/UseGastos";
import { Users, TrendingUp, TrendingDown } from "lucide-react";

function formatMoneda(value) {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function DashboardStats() {
  const { clientes, loading: loadingClientes, calcularClientesNuevos, calcularGastosEIngresos } =
    useClientes();
  const { gastos, loading: loadingGastos, calcularGastosPorSemanaYMes } = useGastos({});

  const loading = loadingClientes || loadingGastos;

  const [stats, setStats] = useState({
    clientesSemanal: 0,
    clientesMensual: 0,
    ingresosSemanal: 0,
    ingresosMensual: 0,
    gastosSemanal: 0,
    gastosMensual: 0,
  });

  useEffect(() => {
    if (loading) return;
    if (!clientes) return;

    const hoy = new Date();
    const inicioSemana = hoy.getDate() - hoy.getDay() + 1;
    const finSemana = inicioSemana + 6;
    const primerDiaSemana = new Date(hoy);
    primerDiaSemana.setDate(inicioSemana);
    primerDiaSemana.setHours(0, 0, 0, 0);
    const ultimoDiaSemana = new Date(hoy);
    ultimoDiaSemana.setDate(finSemana);
    ultimoDiaSemana.setHours(23, 59, 59, 999);
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    primerDiaMes.setHours(0, 0, 0, 0);
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    ultimoDiaMes.setHours(23, 59, 59, 999);

    const { nuevosPorSemana, nuevosPorMes } = calcularClientesNuevos(
      primerDiaSemana,
      ultimoDiaSemana,
      primerDiaMes,
      ultimoDiaMes
    );
    const { ingresosPorSemana, ingresosPorMes } = calcularGastosEIngresos(
      primerDiaSemana,
      ultimoDiaSemana,
      primerDiaMes,
      ultimoDiaMes
    );

    const gastosCalc = calcularGastosPorSemanaYMes
      ? calcularGastosPorSemanaYMes()
      : { totalPorSemana: 0, totalPorMes: 0 };

    setStats({
      clientesSemanal: nuevosPorSemana,
      clientesMensual: nuevosPorMes,
      ingresosSemanal: ingresosPorSemana,
      ingresosMensual: ingresosPorMes,
      gastosSemanal: gastosCalc.totalPorSemana ?? 0,
      gastosMensual: gastosCalc.totalPorMes ?? 0,
    });
    // Solo dependemos de los datos; las funciones del hook cambian en cada render
  }, [clientes, gastos, loading]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-36 bg-gray-200/80 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Clientes nuevos",
      icon: Users,
      bg: "bg-rose-50",
      border: "border-rose-200",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-700",
      semanal: stats.clientesSemanal,
      mensual: stats.clientesMensual,
      format: (v) => v,
    },
    {
      title: "Ingresos",
      icon: TrendingUp,
      bg: "bg-sky-50",
      border: "border-sky-200",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-700",
      semanal: stats.ingresosSemanal,
      mensual: stats.ingresosMensual,
      format: formatMoneda,
    },
    {
      title: "Gastos",
      icon: TrendingDown,
      bg: "bg-violet-50",
      border: "border-violet-200",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-700",
      semanal: stats.gastosSemanal,
      mensual: stats.gastosMensual,
      format: formatMoneda,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const animClass = index === 0 ? "animate-scale-in" : index === 1 ? "animate-scale-in-delay-1 opacity-0" : "animate-scale-in-delay-2 opacity-0";
        return (
          <div
            key={card.title}
            className={`group ${card.bg} border ${card.border} rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${animClass}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`${card.iconBg} ${card.iconColor} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="font-semibold text-gray-800 text-base">
                {card.title}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-medium text-xs uppercase tracking-wide mb-0.5">
                  Semana
                </p>
                <p className="text-gray-900 font-bold text-xl tabular-nums">
                  {card.format(card.semanal)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs uppercase tracking-wide mb-0.5">
                  Mes
                </p>
                <p className="text-gray-900 font-bold text-xl tabular-nums">
                  {card.format(card.mensual)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardStats;
