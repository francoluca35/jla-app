import React, { Suspense } from "react";
import DashboardLayout from "../components/DashboardLayout";
import CambiarPassword from "./component/CambiarPassword";

function cambiarcontrasena() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="text-neutral-600">Cargando...</div>}>
        <CambiarPassword />
      </Suspense>
    </DashboardLayout>
  );
}

export default cambiarcontrasena;
