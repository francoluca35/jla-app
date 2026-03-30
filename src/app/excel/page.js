"use client";
import React, { Suspense } from "react";
import DashboardLayout from "../components/DashboardLayout";
import CreateExcel from "./components/CreateExcel";

export default function excel() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={<p className="text-neutral-600">Cargando componente...</p>}
      >
        <CreateExcel />
      </Suspense>
    </DashboardLayout>
  );
}
