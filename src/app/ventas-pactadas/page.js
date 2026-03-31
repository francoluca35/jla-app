import React, { Suspense, lazy } from "react";
import DashboardLayout from "../components/DashboardLayout";

const FormVentasPactadas = lazy(() => import("./components/FormVentasPactadas"));

export default function VentasPactadasPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<p className="text-neutral-600">Cargando formulario de ventas...</p>}>
        <FormVentasPactadas />
      </Suspense>
    </DashboardLayout>
  );
}
