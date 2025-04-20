"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarPlus,
  PiggyBank,
  Users,
  ReceiptText,
  Power,
  ChartNoAxesCombined,
  FileSpreadsheet,
} from "lucide-react";

export default function Home() {
  const [fechaHora, setFechaHora] = useState(new Date());
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    } else {
      setUsuario({ username: "Admin", role: "COORDINADOR" });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setFechaHora(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const botones = [
    {
      texto: "Agenda de Clientes",
      ruta: "/agendaclient",
      icono: <CalendarPlus className="w-8 h-8 mb-2" />,
    },
    {
      texto: "Ingreso de Gastos",
      ruta: "/gastos",
      icono: <PiggyBank className="w-8 h-8 mb-2" />,
    },
    {
      texto: "Historial Clientes",
      ruta: "/hclientes",
      icono: <Users className="w-8 h-8 mb-2" />,
    },
    {
      texto: "Historial de Gastos",
      ruta: "/hgastos",
      icono: <ReceiptText className="w-8 h-8 mb-2" />,
    },
    {
      texto: "Historial de Ingresos",
      ruta: "/hingresos",
      icono: <ChartNoAxesCombined className="w-8 h-8 mb-2" />,
    },
    {
      texto: "Informes Semanales",
      ruta: "/excel",
      icono: <FileSpreadsheet className="w-8 h-8 mb-2" />,
    },
  ];

  if (!usuario)
    return <div className="p-6 text-white">Cargando usuario...</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white flex flex-col items-center justify-start pt-6"
      style={{ backgroundImage: "url('/Assets/inicio.jpg')" }}
    >
      {/* Header */}
      <div className="w-full px-6 flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-white">{fechaHora.toLocaleDateString()}</p>
          <p className="text-xs text-white">{fechaHora.toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <img
            src="/Assets/logo.jpg"
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="text-right">
            <p className="text-sm font-bold uppercase">{usuario.username}</p>
            <p className="text-xs text-green-300 uppercase">{usuario.role}</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("adminUser");
              router.push("/admin");
            }}
            className="text-red-500 text-xl hover:text-red-700 transition"
            title="Cerrar sesión"
          >
            <Power className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full px-48 pb-10">
        {/* Tabla */}
        <div className="bg-green-900 rounded-lg p-6 backdrop-blur-md shadow-lg text-sm w-[320px]">
          <table className="table-auto text-white border-collapse w-full text-center text-sm">
            <thead>
              <tr>
                <th className="p-2 border border-white/30">Datos</th>
                <th className="p-2 border border-white/30">Semanal</th>
                <th className="p-2 border border-white/30">Mensual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-white/30">Clientes</td>
                <td className="p-2 border border-white/30">clientes nuevos</td>
                <td className="p-2 border border-white/30">clientes nuevos</td>
              </tr>
              <tr>
                <td className="p-2 border border-white/30">Gastos</td>
                <td className="p-2 border border-white/30">
                  total gasto semanal
                </td>
                <td className="p-2 border border-white/30">
                  total gasto mensual
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-white/30">Ingresos</td>
                <td className="p-2 border border-white/30">
                  total ingreso semanal
                </td>
                <td className="p-2 border border-white/30">
                  total ingreso mensual
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Botones grandes */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl">
          {botones.map((btn, i) => (
            <button
              key={i}
              onClick={() => router.push(btn.ruta)}
              className="bg-verdefluor hover:bg-green-600 text-black font-bold rounded-2xl h-36 flex flex-col items-center justify-center text-lg shadow-xl transition"
            >
              {btn.icono}
              <span className="text-center px-2 leading-snug">{btn.texto}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
