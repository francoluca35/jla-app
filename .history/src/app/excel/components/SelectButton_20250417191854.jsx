"use client";
import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function CreateExcel() {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const generarExcel = () => {
    // Lógica de exportación a Excel aquí
    console.log("Rango seleccionado:", range[0]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Exportar Reportes a Excel</h1>

      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">
          Seleccionar Rango de Fecha
        </h2>
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={range}
        />
      </div>

      <button
        onClick={generarExcel}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold"
      >
        Generar Excel
      </button>
    </div>
  );
}

export default CreateExcel;
