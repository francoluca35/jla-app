import React, { Suspense, lazy } from "react";

const IngresarGastos = lazy(() => import("./components/IngresarGastos"));

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
    </div>
  );
}

export default Gastos;
