"use client";
import React, { Suspense } from "react";
import CreateExcel from "./components/CreateExcel";

export default function excel() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Suspense
        fallback={<p className="text-center">Cargando componente...</p>}
      >
        <CreateExcel />
      </Suspense>
    </div>
  );
}
