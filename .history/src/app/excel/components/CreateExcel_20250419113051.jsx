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

    const [desdeRaw, hastaRaw] = range;

    const desde = new Date(desdeRaw);
    desde.setHours(0, 0, 0, 0);

    const hasta = new Date(hastaRaw);
    hasta.setHours(23, 59, 59, 999);

    return lista.filter((item) => {
      const fecha = new Date(item[fechaCampo]);
      return fecha >= desde && fecha <= hasta;
    });
  };

  const generarExcel = () => {
    const clientesFiltrados = filtrarPorFecha(clientes, "date");
    const gastosFiltrados = filtrarPorFecha(gastos, "fecha");
    const ingresosFiltrados = filtrarPorFecha(obtenerFiltrados(), "date");

    const hojaClientes = clientesFiltrados.map((c) => {
      const estadoCalculado =
        c.problemType === "arreglo" ? "terminado" : c.estado || "en curso";

      return {
        Nombre: c.clientName,
        Sucursal: c.branch,
        Fecha: new Date(c.date).toLocaleDateString("es-AR"),
        Tipo:
          c.problemType === "arreglo"
            ? "ar"
            : c.problemType === "presupuesto"
            ? "pr"
            : c.problemType,
        "Forma de Pago": c.paymentOption,
        "Método de Pago": c.paymentMethod,
        Efectivo: c.efectivo || 0,
        Transferencia: c.transferencia || 0,
        "Total del Trabajo": c.totalTrabajo || 0,
        Estado: estadoCalculado,
        Descripción: c.description || "",
        Servicios: (c.sertec || [])
          .map((s) => {
            const texto = `${s.tipo}: $${s.monto}`;
            return s.anulada ? `${texto} (anulado)` : texto;
          })
          .join(" | "),
      };
    });

    // Hoja 2: Gastos
    const hojaGastos = gastosFiltrados.map((g) => {
      const isSueldo = g.tipo === "sueldos";

      return {
        Tipo: g.tipo,
        Empleado: isSueldo ? g.empleado : "",
        "Días de Trabajo": isSueldo ? (g.diasDeTrabajo || []).join(", ") : "",
        "Forma de Pago": isSueldo ? (g.tipodepago || []).join(" + ") : "",
        Descripción: isSueldo ? "" : g.descripcion || "",
        Lugar: isSueldo ? "" : g.lugar || "",
        Precio: g.precio,
        Fecha: new Date(g.fecha).toLocaleDateString("es-AR"),
      };
    });

    // Hoja 3: Ingresos
    const hojaIngresos = ingresosFiltrados
      .filter((i) => i.estado === "terminado")
      .map((i) => ({
        Cliente: i.clientName,
        Sucursal: i.branch,
        Tipo:
          i.problemType === "arreglo"
            ? "ar"
            : i.problemType === "presupuesto"
            ? "pr"
            : i.problemType,
        Pago: i.paymentOption || "-",
        Monto: i.amount || 0,
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

    // Crear hojas
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
    const formatFecha = (fecha) => {
      return fecha.toLocaleDateString("es-AR").replaceAll("/", "-");
    };

    const nombreArchivo =
      range.length === 2
        ? `Reporte_JLApp_${formatFecha(range[0])}_a_${formatFecha(
            range[1]
          )}.xlsx`
        : "Reporte_JLApp.xlsx";

    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      nombreArchivo
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 p-6 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-6 text-green-900 tracking-wide">
        Exportar Datos a Excel
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6 bg-white p-6 rounded-xl shadow-lg border border-green-300">
        <DatePicker.RangePicker
          format="DD/MM/YYYY"
          onChange={(values) => {
            if (!values) return setRange([]);
            setRange([values[0].toDate(), values[1].toDate()]);
          }}
          className="!rounded-lg !border-green-400 !shadow-sm hover:!border-green-600 transition-all"
          popupClassName="rounded-lg shadow-lg border border-green-300"
        />

        <button
          onClick={generarExcel}
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300"
        >
          Generar Excel
        </button>
      </div>
    </div>
  );
};

export default CreateExcel;
