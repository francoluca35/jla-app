import React, { Suspense, lazy } from "react";
import DashboardLayout from "../components/DashboardLayout";

const IngresarGastos = lazy(() => import("./components/IngresarGastos"));

function Gastos() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Suspense
          fallback={
            <p className="text-neutral-600">Cargando formulario de gastos...</p>
          }
        >
          <IngresarGastos />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

export default Gastos;
