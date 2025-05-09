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
      icono: <CalendarPlus className="w-6 h-6 mb-1" />,
    },
    {
      texto: "Ingreso de Gastos",
      ruta: "/gastos",
      icono: <PiggyBank className="w-6 h-6 mb-1" />,
    },
    {
      texto: "Historial Clientes",
      ruta: "/hclientes",
      icono: <Users className="w-6 h-6 mb-1" />,
    },
    {
      texto: "Historial de Gastos",
      ruta: "/hgastos",
      icono: <ReceiptText className="w-6 h-6 mb-1" />,
    },
    {
      texto: "Historial de Ingresos",
      ruta: "/hingresos",
      icono: <ChartNoAxesCombined className="w-6 h-6 mb-1" />,
    },
    {
      texto: "Informes Semanales",
      ruta: "/excel",
      icono: <FileSpreadsheet className="w-6 h-6 mb-1" />,
    },
  ];

  if (!usuario) return <div className="p-6">Cargando usuario...</div>;

  return (
    <div
      className="min-h-screen bg-white p-4 flex flex-col items-center gap-6"
      style={{
        backgroundImage: "url('/Assets/inicio.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-100">
            {fechaHora.toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-100">
            {fechaHora.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <img
            src="/Assets/logo.jpg"
            alt="Avatar"
            className="w-10 h-10 rounded-full "
          />
          <div className="text-right">
            <p className="text-sm font-bold text-white uppercase">
              {usuario.username}
            </p>
            <p className="text-xs text-green-200 uppercase">{usuario.role}</p>
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

      {/* Botones */}
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-1 lg:w-1/4">
          {botones.map((btn, i) => (
            <button
              key={i}
              onClick={() => router.push(btn.ruta)}
              className="bg-verdefluor text-black rounded-xl w-full h-32 lg:h-20 flex flex-col items-center justify-center shadow-md hover:bg-green-600 transition "
            >
              {btn.icono}
              <span className="text-black text-sm font-semibold text-center px-1 leading-tight">
                {btn.texto}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
