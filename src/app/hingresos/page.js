"use client";
import React, { Suspense } from "react";

const TabsIngresos = React.lazy(() => import("./components/TabsIngresos"));

function HIngresos() {
  return (
    <Suspense fallback={<div>Cargando ingresos...</div>}>
      <TabsIngresos />
    </Suspense>
  );
}

export default HIngresos;
