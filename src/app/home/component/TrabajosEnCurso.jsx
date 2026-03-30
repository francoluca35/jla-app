"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useIngresos from "@/hooks/useIngresos";
import { Wrench } from "lucide-react";

function formatMoneda(value) {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatFecha(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
}

const LIMIT = 8;

export default function TrabajosEnCurso() {
  const router = useRouter();
  const { data } = useIngresos();

  const enCurso =
    data?.clientes
      ?.filter(
        (c) =>
          c.problemType === "presupuesto" &&
          (c.estado === "en curso" || c.estado !== "terminado")
      )
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, LIMIT) ?? [];

  if (enCurso.length === 0) {
    return (
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h3 className="flex items-center gap-2 text-gray-800 font-semibold text-base mb-4">
          <Wrench className="w-5 h-5 text-gray-500" />
          Trabajos en curso
        </h3>
        <p className="text-gray-500 text-sm">No hay trabajos en curso.</p>
        <button
          type="button"
          onClick={() => router.push("/hingresos")}
          className="mt-3 text-sm font-medium text-sky-600 hover:underline transition-opacity hover:opacity-80"
        >
          Ver historial de ingresos →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="flex items-center gap-2 text-gray-800 font-semibold text-base">
          <Wrench className="w-5 h-5 text-verdefluor" />
          Trabajos en curso
        </h3>
        <button
          type="button"
          onClick={() => router.push("/hingresos")}
          className="text-sm font-medium text-sky-600 hover:underline transition-opacity hover:opacity-80"
        >
          Ver todos
        </button>
      </div>
      <ul className="divide-y divide-gray-100">
        {enCurso.map((item, index) => (
          <li
            key={item._id}
            className="px-5 py-3.5 hover:bg-gray-50 transition-all duration-200 hover:pl-6"
            style={{
              animation: "fade-in 0.3s ease-out forwards",
              animationDelay: `${index * 0.03}s`,
              opacity: 0,
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">
                  {item.clientName || "Sin nombre"}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {item.problemType === "presupuesto" ? "Presupuesto" : "Arreglo"}
                  {item.branch ? ` · ${item.branch}` : ""}
                  {" · "}
                  {formatFecha(item.date)}
                </p>
              </div>
              <span className="flex-shrink-0 font-semibold text-gray-900">
                {formatMoneda(item.amount)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
