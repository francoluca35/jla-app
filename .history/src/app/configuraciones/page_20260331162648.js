"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Fingerprint, KeyRound, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import {
  clearBiometricData,
  configureBiometricNextSlot,
  getBiometricConfig,
} from "@/lib/biometricConfig";

export default function ConfiguracionesPage() {
  const [username, setUsername] = useState("");
  const [biometricConfig, setBiometricConfig] = useState(getBiometricConfig(""));
  const [reseteandoMetricos, setReseteandoMetricos] = useState(false);
  const [borrandoBiometricos, setBorrandoBiometricos] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    const user = stored ? JSON.parse(stored) : null;
    const resolvedUsername = user?.username || "Admin";
    setUsername(resolvedUsername);
    setBiometricConfig(getBiometricConfig(resolvedUsername));
  }, []);

  const biometricCount = useMemo(
    () => biometricConfig.slots.filter(Boolean).length,
    [biometricConfig]
  );

  const handleConfigurarHuella = async () => {
    if (!username) return;

    try {
      const result = await configureBiometricNextSlot(username);
      setBiometricConfig(result.config);
      alert(
        `Huella configurada correctamente. Espacios ocupados: ${result.total}/${result.max}.`
      );
    } catch (error) {
      alert(error?.message || "No se pudo configurar la huella digital.");
    }
  };

  const handleBorrarMetricos = async () => {
    const aviso = window.confirm(
      "Se borrarán TODOS los datos métricos y operativos (clientes, gastos y ventas). El usuario y contraseña se mantienen. ¿Querés continuar?"
    );
    if (!aviso) return;

    const palabra = window.prompt(
      'Para confirmar, escribí exactamente: BORRAR TODO'
    );
    if (palabra !== "BORRAR TODO") return;

    try {
      setReseteandoMetricos(true);
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
      alert(error?.message || "Error al reiniciar datos.");
    } finally {
      setReseteandoMetricos(false);
    }
  };

  const handleBorrarBiometricos = async () => {
    if (!username) return;
    const confirmar = window.confirm(
      "¿Seguro que querés borrar todos los datos biométricos de este usuario?"
    );
    if (!confirmar) return;

    try {
      setBorrandoBiometricos(true);
      clearBiometricData(username);
      const configReseteada = getBiometricConfig(username);
      setBiometricConfig(configReseteada);
      alert("Datos biométricos borrados correctamente.");
    } catch {
      alert("No se pudieron borrar los datos biométricos.");
    } finally {
      setBorrandoBiometricos(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configuraciones</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gestioná contraseña, huella digital y datos del sistema.
          </p>
        </header>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-gray-700 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Cambiar contraseña</p>
                <p className="text-sm text-gray-500">
                  Actualizá la contraseña de acceso del usuario actual.
                </p>
              </div>
            </div>
            <Link
              href="/cambiarcontrasena"
              className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors"
            >
              Abrir
            </Link>
          </div>

          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Fingerprint className="w-5 h-5 text-gray-700 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Huella digital</p>
                <p className="text-sm text-gray-500">
                  {biometricCount === 0
                    ? "Sin huellas configuradas."
                    : `Huellas configuradas: ${biometricCount}/3.`}
                </p>
              </div>
            </div>
            <button
              onClick={handleConfigurarHuella}
              className="px-4 py-2 rounded-lg bg-verdefluor text-black text-sm font-medium hover:bg-verdefluort transition-colors"
            >
              {biometricCount === 0 ? "Agregar huella" : "Agregar otra huella"}
            </button>
          </div>

          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Borrar datos métricos</p>
                <p className="text-sm text-gray-500">
                  Borra clientes, gastos y ventas, manteniendo usuario y contraseña.
                </p>
              </div>
            </div>
            <button
              onClick={handleBorrarMetricos}
              disabled={reseteandoMetricos}
              className="px-4 py-2 rounded-lg bg-amber-100 text-amber-800 text-sm hover:bg-amber-200 transition-colors disabled:opacity-60"
            >
              {reseteandoMetricos ? "Borrando..." : "Borrar"}
            </button>
          </div>

          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-rose-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Borrar datos biométricos</p>
                <p className="text-sm text-gray-500">
                  Elimina la configuración de huellas y vuelve el estado a 0/3.
                </p>
              </div>
            </div>
            <button
              onClick={handleBorrarBiometricos}
              disabled={borrandoBiometricos}
              className="px-4 py-2 rounded-lg bg-red-100 text-red-800 text-sm hover:bg-red-200 transition-colors disabled:opacity-60"
            >
              {borrandoBiometricos ? "Borrando..." : "Borrar biométricos"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
