"use client";
import React, { Suspense } from "react";

// Utilizamos React.lazy para cargar el componente de manera perezosa
const TabsIngresos = React.lazy(() => import("./components/TabsIngresos"));

function HIngresos() {
  return (
    // Suspense se encarga de mostrar el fallback mientras el componente se carga
    <Suspense fallback={<div>Cargando ingresos...</div>}>
      <TabsIngresos />
    </Suspense>
  );
}

export default HIngresos;
