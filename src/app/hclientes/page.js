import React, { Suspense } from "react";
import DashboardLayout from "../components/DashboardLayout";
import HistoryClient from "./components/HistoryClient";

function HCliente() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="text-neutral-600">Cargando...</div>}>
        <HistoryClient />
      </Suspense>
    </DashboardLayout>
  );
}

export default HCliente;
