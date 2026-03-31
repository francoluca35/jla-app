"use client";

import React, { useMemo } from "react";
import useVentas from "@/hooks/useVentas";
import { Users, Package, CalendarDays, BadgeDollarSign } from "lucide-react";

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
  const { ventas, loading } = useVentas();

  const stats = useMemo(() => {
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();

    let cantidadVentas = 0;
    let cantidadProductos = 0;
    let importeMensual = 0;
    let importeFinalAnual = 0;

    for (const venta of ventas) {
      const cantidad = Number(venta?.cantidad || 0);
      const total = Number(venta?.total || 0);
      const fecha = venta?.fechaVenta ? new Date(venta.fechaVenta) : null;

      cantidadVentas += 1;
      cantidadProductos += Number.isFinite(cantidad) ? cantidad : 0;

      if (fecha && !Number.isNaN(fecha.getTime()) && fecha.getFullYear() === anioActual) {
        importeFinalAnual += Number.isFinite(total) ? total : 0;
        if (fecha.getMonth() === mesActual) {
          importeMensual += Number.isFinite(total) ? total : 0;
        }
      }
    }

    return { cantidadVentas, cantidadProductos, importeMensual, importeFinalAnual };
  }, [ventas]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200/80 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Ventas",
      icon: Users,
      bg: "bg-rose-50",
      border: "border-rose-200",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-700",
      total: stats.cantidadVentas,
      variacion: "Cantidad de ventas",
      format: (v) => v,
    },
    {
      title: "Cantidad de productos",
      icon: Package,
      bg: "bg-sky-50",
      border: "border-sky-200",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-700",
      total: stats.cantidadProductos,
      variacion: "Suma de todos los productos",
      format: (v) => v,
    },
    {
      title: "Importe mensual",
      icon: CalendarDays,
      bg: "bg-orange-50",
      border: "border-orange-200",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
      total: stats.importeMensual,
      variacion: "Se reinicia cada mes",
      format: formatMoneda,
    },
    {
      title: "Importe final anual",
      icon: BadgeDollarSign,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      total: stats.importeFinalAnual,
      variacion: "Acumulado del año actual",
      format: formatMoneda,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const animClass =
          index === 0
            ? "animate-scale-in"
            : index === 1
            ? "animate-scale-in-delay-1 opacity-0"
            : "animate-scale-in-delay-2 opacity-0";
        return (
          <div
            key={card.title}
            className={`group ${card.bg} border ${card.border} rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${animClass}`}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-sm font-medium text-gray-600">
                {card.title}
              </span>
              <div className={`${card.iconBg} ${card.iconColor} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 font-medium text-[11px] uppercase tracking-wide mb-0.5">
                  Total
                </p>
                <p className="text-gray-900 font-bold text-xl tabular-nums">
                  {card.format(card.total)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 font-medium text-[11px] uppercase tracking-wide mb-0.5">
                  Variación
                </p>
                <p className="text-gray-700 font-semibold text-sm mt-1">
                  {card.variacion}
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
