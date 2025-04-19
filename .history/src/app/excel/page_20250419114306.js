"use client";
import React, { Suspense } from "react";
import CreateExcel from "./components/CreateExcel";

export default function excel() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: "url('/Assets/formclient.png')", // ← Cambiá esto si tenés otra imagen
      }}
    >
      <Suspense
        fallback={<p className="text-center">Cargando componente...</p>}
      >
        <CreateExcel />
      </Suspense>
    </div>
  );
}
