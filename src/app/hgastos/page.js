import React, { Suspense, lazy } from "react";
import DashboardLayout from "../components/DashboardLayout";

const TabsGasto = lazy(() => import("./components/TabsGastos"));

function hgastos() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Suspense
          fallback={
            <p className="text-neutral-600">Cargando...</p>
          }
        >
          <TabsGasto />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

export default hgastos;
