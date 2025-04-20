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
  ChevronDown,
  LogOut,
  KeyRound,
} from "lucide-react";

export default function Home() {
  const [fechaHora, setFechaHora] = useState(new Date());
  const [usuario, setUsuario] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
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
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center px-4 py-6"
      style={{ backgroundImage: "url('/Assets/inicio.jpg')" }}
    >
      {/* Header superior */}
      <div className="absolute top-4 left-4 text-white text-sm">
        <p>{fechaHora.toLocaleDateString()}</p>
        <p className="text-xs">{fechaHora.toLocaleTimeString()}</p>
      </div>
      <div className="absolute top-4 right-4 text-white text-sm flex flex-col items-end">
        <div className="flex items-center gap-2">
          <img
            src="/Assets/logo.jpg"
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
          <div className="text-right">
            <p className="text-sm font-bold uppercase">{usuario.username}</p>
            <p className="text-xs text-green-300 uppercase">{usuario.role}</p>
          </div>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-white hover:text-verdefluor focus:outline-none"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
        {showMenu && (
          <div className="mt-2 bg-white text-black rounded shadow-md w-48 z-50">
            <button
              onClick={() => {
                localStorage.removeItem("adminUser");
                router.push("/admin");
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 w-full text-left"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
            <button
              onClick={() => router.push("/cambiarcontrasena")}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 w-full text-left"
            >
              <KeyRound size={16} /> Cambiar contraseña
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
