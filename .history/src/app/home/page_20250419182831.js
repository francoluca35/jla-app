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
      icono: <CalendarPlus className="w-6 h-6 mb-2" />,
    },
    {
      texto: "Ingreso de Gastos",
      ruta: "/gastos",
      icono: <PiggyBank className="w-6 h-6 mb-2" />,
    },
    {
      texto: "Historial Clientes",
      ruta: "/hclientes",
      icono: <Users className="w-6 h-6 mb-2" />,
    },
    {
      texto: "Historial de Gastos",
      ruta: "/hgastos",
      icono: <ReceiptText className="w-6 h-6 mb-2" />,
    },
    {
      texto: "Historial de Ingresos",
      ruta: "/hingresos",
      icono: <ChartNoAxesCombined className="w-6 h-6 mb-2" />,
    },
    {
      texto: "Informes Semanales",
      ruta: "/excel",
      icono: <FileSpreadsheet className="w-6 h-6 mb-2" />,
    },
  ];

  if (!usuario)
    return <div className="p-6 text-white">Cargando usuario...</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white p-6"
      style={{ backgroundImage: "url('/Assets/inicio.jpg')" }}
    >
      {/* Fecha y usuario */}
      <div className="flex justify-between w-full text-white text-xs px-2">
        <div>
          <p>{fechaHora.toLocaleDateString()}</p>
          <p>{fechaHora.toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <img src="/Assets/logo.jpg" className="w-8 h-8 rounded-full" />
          <div className="text-right">
            <p className="text-sm font-bold uppercase">{usuario.username}</p>
            <p className="text-green-300 uppercase text-xs">{usuario.role}</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("adminUser");
              router.push("/admin");
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Power size={18} />
          </button>
        </div>
      </div>

      {/* Layout principal */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 mt-4">
        {/* Tabla */}
        <div className="bg-white/30 backdrop-blur-sm p-4 rounded-xl shadow-md text-black w-[310px] text-sm">
          <h3 className="text-center font-bold text-lg mb-2">Control Total</h3>
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="border p-1">Datos</th>
                <th className="border p-1">Semanal</th>
                <th className="border p-1">Mensual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-1">Clientes</td>
                <td className="border p-1">clientes nuevos</td>
                <td className="border p-1">clientes nuevos</td>
              </tr>
              <tr>
                <td className="border p-1">Gastos</td>
                <td className="border p-1">total gasto semanal</td>
                <td className="border p-1">total gasto mensual</td>
              </tr>
              <tr>
                <td className="border p-1">Ingresos</td>
                <td className="border p-1">total ingreso semanal</td>
                <td className="border p-1">total ingreso mensual</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Botones grandes */}
        <div className="grid grid-cols-2 gap-6">
          {botones.map((btn, i) => (
            <button
              key={i}
              onClick={() => router.push(btn.ruta)}
              className="bg-verdefluor text-black rounded-xl w-32 h-44 flex flex-col items-center justify-center text-center font-semibold shadow-lg hover:scale-105 transition"
            >
              {btn.icono}
              <span className="text-xs px-2">{btn.texto}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
