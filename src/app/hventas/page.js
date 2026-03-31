"use client";
import React, { Suspense } from "react";
import DashboardLayout from "../components/DashboardLayout";

const HistorialVentas = React.lazy(() => import("./components/HistorialVentas"));

export default function HVentas() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="text-neutral-600">Cargando historial de ventas...</div>}>
        <HistorialVentas />
      </Suspense>
    </DashboardLayout>
  );
}
