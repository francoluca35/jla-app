"use client";

import React, { Suspense } from "react";
import DashboardLayout from "../components/DashboardLayout";
import DashboardStats from "./component/DashboardStats";
import TrabajosEnCurso from "./component/TrabajosEnCurso";
import { LayoutDashboard, BarChart3, Wrench } from "lucide-react";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-2 sm:px-0">
        <header className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-verdefluor/15 text-verdefluor mb-4 transition-transform duration-300 hover:scale-105">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-md mx-auto">
            Vista de métricas, clientes y trabajos en curso
          </p>
        </header>

        <section className="mb-10 animate-fade-in-up-delay-1 opacity-0">
          <h2 className="flex items-center justify-center gap-2 text-gray-700 font-semibold text-sm mb-5">
            <BarChart3 className="w-4 h-4 text-verdefluor" />
            Métricas
          </h2>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-36 bg-gray-200/80 animate-pulse rounded-2xl"
                  />
                ))}
              </div>
            }
          >
            <DashboardStats />
          </Suspense>
        </section>

        <section className="animate-fade-in-up-delay-2 opacity-0">
          <h2 className="flex items-center justify-center gap-2 text-gray-700 font-semibold text-sm mb-5">
            <Wrench className="w-4 h-4 text-verdefluor" />
            Trabajos en curso
          </h2>
          <Suspense
            fallback={
              <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 h-52 animate-pulse" />
            }
          >
            <TrabajosEnCurso />
          </Suspense>
        </section>
      </div>
    </DashboardLayout>
  );
}
