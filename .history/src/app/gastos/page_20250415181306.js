import React, { Suspense, lazy } from "react";

// Lazy load de los componentes
const IngresarGastos = lazy(() => import("./components/IngresarGastos"));
const TabsGasto = lazy(() => import("./components/TabsGastos"));

function Gastos() {
  return (
    <div className="p-4 space-y-8">
      <Suspense
        fallback={
          <p className="text-white">Cargando formulario de gastos...</p>
        }
      >
        <IngresarGastos />
      </Suspense>

      <Suspense
        fallback={<p className="text-white">Cargando vista de gastos...</p>}
      >
        <TabsGasto />
      </Suspense>
    </div>
  );
}

export default Gastos;
