"use client";

import React, { useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { DatePicker } from "antd";
import useClientes from "@/hooks/useClient";
import { useGastos } from "@/hooks/UseGastos";
import useIngresos from "@/hooks/useIngresos";

const CreateExcel = () => {
  const [range, setRange] = useState([]);

  const { clientes } = useClientes();
  const { gastos } = useGastos({});
  const { obtenerFiltrados } = useIngresos();

  const filtrarPorFecha = (lista, fechaCampo = "date") => {
    if (range.length !== 2) return lista;
    const [desde, hasta] = range;
    return lista.filter((item) => {
      const fecha = new Date(item[fechaCampo]);
      return fecha >= desde && fecha <= hasta;
    });
  };

  const generarExcel = () => {
    const clientesFiltrados = filtrarPorFecha(clientes, "date");
    const gastosFiltrados = filtrarPorFecha(gastos, "fecha");
    const ingresosFiltrados = filtrarPorFecha(obtenerFiltrados(), "date");

    // Hoja 1: Clientes
    const hojaClientes = clientesFiltrados.map((c) => ({
      Nombre: c.clientName,
      Sucursal: c.branch,
      Fecha: new Date(c.date).toLocaleDateString(),
      Tipo: c.problemType,
      "Forma de Pago": c.paymentOption,
      Monto: c.amount,
      Descripción: c.description,
    }));

    // Hoja 2: Gastos
    const hojaGastos = gastosFiltrados.map((g) => ({
      Tipo: g.tipo,
      Descripción: g.descripcion,
      Lugar: g.lugar,
      Precio: g.precio,
      Fecha: new Date(g.fecha).toLocaleDateString(),
    }));

    // Hoja 3: Ingresos
    const hojaIngresos = ingresosFiltrados.map((i) => ({
      Cliente: i.clientName,
      Sucursal: i.branch,
      Tipo: i.problemType,
      Pago: i.paymentOption,
      Monto: i.amount,
    }));

    // Hoja 4: Resumen mensual
    const resumen = {};
    ingresosFiltrados.forEach((i) => {
      const mes = new Date(i.date).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
      });
      resumen[mes] = resumen[mes] || { ingresos: 0, gastos: 0 };
      resumen[mes].ingresos += i.amount || 0;
    });
    gastosFiltrados.forEach((g) => {
      const mes = new Date(g.fecha).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
      });
      resumen[mes] = resumen[mes] || { ingresos: 0, gastos: 0 };
      resumen[mes].gastos += g.precio || 0;
    });
    const hojaResumen = Object.entries(resumen).map(([mes, val]) => ({
      Mes: mes,
      "Total Ingresos": val.ingresos,
      "Total Gastos": val.gastos,
      "Balance Neto": val.ingresos - val.gastos,
    }));

    // Crear workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(hojaClientes),
      "Clientes"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(hojaGastos),
      "Gastos"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(hojaIngresos),
      "Ingresos"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(hojaResumen),
      "Resumen"
    );

    const blob = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const buffer = new ArrayBuffer(blob.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < blob.length; i++) view[i] = blob.charCodeAt(i) & 0xff;
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      "Reporte_JLApp.xlsx"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Exportar Datos a Excel</h2>
      <div className="flex gap-4 items-center mb-6">
        <DatePicker.RangePicker
          format="DD/MM/YYYY"
          onChange={(values) => {
            if (!values) return setRange([]);
            setRange([values[0].toDate(), values[1].toDate()]);
          }}
        />
        <button
          onClick={generarExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Generar Excel
        </button>
      </div>
    </div>
  );
};

export default CreateExcel;
