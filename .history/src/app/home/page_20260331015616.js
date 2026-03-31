"use client";

import React, { Suspense } from "react";
import DashboardLayout from "../components/DashboardLayout";
import GananciasPanel from "./component/GananciasPanel";
import PerdidasPanel from "./component/PerdidasPanel";
import EquilibrioPanel from "./component/EquilibrioPanel";
import ClientesPeriodoPanel from "./component/ClientesPeriodoPanel";
import TrabajosEnCurso from "./component/TrabajosEnCurso";
import { LineChart, PieChart, TrendingDown, Users, Wrench } from "lucide-react";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
     

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-4">
              <LineChart className="w-4 h-4 text-emerald-600" />
              Ganancias
            </h2>
            <Suspense
              fallback={
                <div className="h-48 bg-gray-100 animate-pulse rounded-2xl" />
              }
            >
              <GananciasPanel />
            </Suspense>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-4">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              Pérdidas
            </h2>
            <Suspense
              fallback={
                <div className="h-48 bg-gray-100 animate-pulse rounded-2xl" />
              }
            >
              <PerdidasPanel />
            </Suspense>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-4">
            <PieChart className="w-4 h-4 text-blue-600" />
            Equilibrio
          </h2>
          <Suspense
            fallback={
              <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
            }
          >
            <EquilibrioPanel />
          </Suspense>
        </section>

        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-4">
            <Users className="w-4 h-4 text-blue-600" />
            Clientes
          </h2>
          <Suspense
            fallback={
              <div className="h-48 bg-gray-100 animate-pulse rounded-2xl" />
            }
          >
            <ClientesPeriodoPanel />
          </Suspense>
        </section>

        <section className="grid grid-cols-1 gap-6">
          <div>
            <h2 className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-4">
              <Wrench className="w-4 h-4 text-blue-600" />
              Trabajos en curso
            </h2>
            <Suspense
              fallback={
                <div className="bg-white border border-gray-200 rounded-2xl p-6 h-64 animate-pulse" />
              }
            >
              <TrabajosEnCurso />
            </Suspense>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
