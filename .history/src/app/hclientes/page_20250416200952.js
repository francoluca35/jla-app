import React, { Suspense } from "react";
import HistoryClient from "./components/HistoryClient";

function hcliente() {
  return (
    <div>
      <Suspense fallback={<div className="text-white">Cargando...</div>}>
        <HistoryClient />
      </Suspense>
    </div>
  );
}

export default hcliente;
