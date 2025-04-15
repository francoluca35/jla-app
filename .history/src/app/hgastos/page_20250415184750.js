import React, { Suspense, lazy } from "react";

const TabsGasto = lazy(() => import("./components/TabsGastos"));

function hgastos() {
  return (
    <div className="p-4 space-y-8">
      <Suspense
        fallback={
          <p className="text-white">Cargando formulario de gastos...</p>
        }
      >
        <TabsGasto />
      </Suspense>
    </div>
  );
}

export default hgastos;
