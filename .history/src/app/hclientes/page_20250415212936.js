import React, { Suspense } from "react";
import HistoryClient from "./components/HistoryClient";

function HCliente() {
  return (
    <div>
      <Suspense fallback={<div className="text-white">Cargando...</div>}>
        <HistoryClient />
      </Suspense>
    </div>
  );
}

export default HCliente;
