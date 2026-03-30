"use client";
import React, { Suspense } from "react";
import DashboardLayout from "../components/DashboardLayout";

const TabsIngresos = React.lazy(() => import("./components/TabsIngresos"));

function HIngresos() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="text-neutral-600">Cargando ingresos...</div>}>
        <TabsIngresos />
      </Suspense>
    </DashboardLayout>
  );
}

export default HIngresos;
