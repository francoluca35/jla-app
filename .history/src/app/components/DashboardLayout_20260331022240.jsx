"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarPlus,
  PiggyBank,
  Users,
  ReceiptText,
  ChartNoAxesCombined,
  FileSpreadsheet,
  ShoppingCart,
  FileText,
  LogOut,
  Trash2,
  KeyRound,
  Menu,
  X,
  Search,
} from "lucide-react";

const NAV = [
  { label: "Inicio", path: "/home", icon: LayoutDashboard },
  { label: "Agenda de Clientes", path: "/agendaclient", icon: CalendarPlus },
  { label: "Ingreso de Gastos", path: "/gastos", icon: PiggyBank },
  { label: "Ventas pactadas", path: "/ventas-pactadas", icon: ShoppingCart },
  { label: "Historial Clientes", path: "/hclientes", icon: Users },
  { label: "Historial de Gastos", path: "/hgastos", icon: ReceiptText },
  { label: "Historial de Ingresos", path: "/hingresos", icon: ChartNoAxesCombined },
  { label: "Historial de ventas", path: "/hventas", icon: FileText },
  { label: "Informes Semanales", path: "/excel", icon: FileSpreadsheet },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reseteando, setReseteando] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) setUsuario(JSON.parse(stored));
    else setUsuario({ username: "Admin", role: "COORDINADOR" });
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    router.push("/admin");
  };

  const handleResetDatos = async () => {
    const aviso = window.confirm(
      "Se borrarán TODOS los datos métricos y operativos (clientes, gastos y ventas). El usuario y contraseña se mantienen. ¿Querés continuar?"
    );
    if (!aviso) return;

    const palabra = window.prompt(
      'Para confirmar, escribí exactamente: BORRAR TODO'
    );
    if (palabra !== "BORRAR TODO") return;

    try {
      setReseteando(true);
      const response = await fetch("/api/reset-datos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmacion: palabra }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "No se pudo reiniciar los datos.");
      }

      alert("Datos reiniciados correctamente. Ahora la app está en cero.");
      window.location.reload();
    } catch (error) {
      alert(error.message || "Error al reiniciar datos.");
    } finally {
      setReseteando(false);
    }
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-sm">Cargando...</div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <img
            src="/Assets/logo.jpg"
            alt="JLA"
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold text-white text-base">JLA</p>
            <p className="text-xs text-gray-400">Panel de gestión</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                active
                  ? "bg-verdefluor text-black"
                  : "text-gray-300 hover:bg-gray-700/60 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0 opacity-90" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-700/50 space-y-1">
        <div className="px-3 py-2 text-gray-400 text-xs">
          <p className="font-medium text-white truncate">{usuario.username}</p>
          <p className="uppercase tracking-wide text-gray-400 mt-0.5">{usuario.role}</p>
        </div>
        <Link
          href="/cambiarcontrasena"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-gray-300 hover:bg-gray-700/60 hover:text-white transition-colors"
        >
          <KeyRound className="w-5 h-5 flex-shrink-0" />
          Cambiar contraseña
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Cerrar sesión
        </button>
        <button
          onClick={handleResetDatos}
          disabled={reseteando}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-amber-200 hover:bg-amber-500/20 hover:text-amber-100 transition-colors disabled:opacity-60"
        >
          <Trash2 className="w-5 h-5 flex-shrink-0" />
          {reseteando ? "Borrando datos..." : "Borrar datos métricos"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar desktop - oscuro como referencia */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col bg-gray-800">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-gray-800 lg:hidden shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <span className="font-semibold text-white">Menú</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-4 h-16 px-4 bg-white border-b border-gray-200 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="font-caviar text-gray-800 font-medium tracking-wide text-lg truncate flex-1 min-w-0">
            Hola, {usuario.username} 👋
          </h2>
          <div className="hidden md:block relative w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 inset-y-0 my-auto pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-verdefluor focus:border-verdefluor"
            />
          </div>
          <img
            src="/Assets/logo.jpg"
            alt=""
            className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 flex-shrink-0"
          />
        </header>
        <main className="p-4 lg:p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
