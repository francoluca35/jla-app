"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLogin from "../../hooks/useLogin";
import { Eye, EyeOff, Fingerprint } from "lucide-react";
import {
  authenticateBiometricLogin,
  configureBiometricNextSlot,
  getBiometricConfig,
  getLastLoginUsername,
  isMobileOrTablet,
  isBiometricSupported,
  markBiometricPrompted,
  setLastLoginUsername,
} from "@/lib/biometricConfig";

export default function AdminAuth() {
  const router = useRouter();
  const { login, loading, error } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [biometricReady, setBiometricReady] = useState(false);
  const [loadingBiometric, setLoadingBiometric] = useState(false);
  const [showInstallCard, setShowInstallCard] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIosInstallHint, setIsIosInstallHint] = useState(false);

  useEffect(() => {
    const lastUser = getLastLoginUsername();
    if (lastUser) setUsername(lastUser);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMobileOrTablet()) return;

    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    const userAgent = navigator.userAgent || "";
    const isiOS = /iPhone|iPad|iPod/i.test(userAgent);

    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallCard(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    if (isiOS) {
      setIsIosInstallHint(true);
      setShowInstallCard(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const checkBiometricStatus = async () => {
      if (!username || !isBiometricSupported() || !isMobileOrTablet()) {
        setBiometricReady(false);
        return;
      }
      try {
        const config = await getBiometricConfig(username);
        setBiometricReady(config.credentialIds.length > 0);
      } catch {
        setBiometricReady(false);
      }
    };
    checkBiometricStatus();
  }, [username]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (loading) return;

    const validUser = await login(username, password);

    if (validUser) {
      localStorage.setItem("adminUser", JSON.stringify(validUser));
      setLastLoginUsername(validUser.username);

      const biometricConfig = await getBiometricConfig(validUser.username);
      if (!biometricConfig.prompted) {
        const wantsBiometric = window.confirm(
          "¿Desea colocar huella digital para este usuario?"
        );

        if (wantsBiometric) {
          try {
            const isSupported = isBiometricSupported();
            if (!isSupported) {
              alert("Este celular o navegador no soporta huella digital.");
            } else {
              await configureBiometricNextSlot(validUser.username);
              alert("Huella digital configurada correctamente.");
            }
          } catch (biometricError) {
            alert(
              biometricError?.message ||
                "No se pudo configurar la huella digital."
            );
          }
        }

        await markBiometricPrompted(validUser.username);
      }

      router.push("/home");
    } else {
      setAuthError("Usuario o contraseña incorrectos.");
    }
  };

  const handleAuthWithFingerprint = async () => {
    setAuthError(null);
    if (!username) {
      setAuthError("Ingresá tu usuario para autenticar con huella.");
      return;
    }

    try {
      setLoadingBiometric(true);
      const validUser = await authenticateBiometricLogin(username);
      localStorage.setItem("adminUser", JSON.stringify(validUser));
      setLastLoginUsername(validUser.username);
      router.push("/home");
    } catch (biometricError) {
      setAuthError(biometricError?.message || "No se pudo iniciar con huella.");
    } finally {
      setLoadingBiometric(false);
    }
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallCard(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: "url('/Assets/admin.jpg')",
      }}
    >
      <div className="backdrop-blur-md bg-gradient-to-br from-[#4b1e5a]/60 to-[#1c1c3c]/60 p-8 rounded-3xl w-96 shadow-xl text-white">
        {showInstallCard && (
          <div className="mb-5 rounded-xl border border-verdefluor/40 bg-black/25 p-3">
            <p className="text-sm font-semibold text-verdefluor">
              Instalá la app en tu celular
            </p>
            <p className="mt-1 text-xs text-white/80">
              {isIosInstallHint
                ? "En iPhone/iPad: tocá Compartir y luego 'Agregar a pantalla de inicio'."
                : "Para un acceso más rápido, instalá la app en este dispositivo."}
            </p>
            <div className="mt-2 flex gap-2">
              {!isIosInstallHint && deferredPrompt && (
                <button
                  type="button"
                  onClick={handleInstallApp}
                  className="rounded-lg bg-verdefluor px-3 py-1.5 text-xs font-semibold text-black hover:bg-verdefluort transition"
                >
                  Descargar app
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowInstallCard(false)}
                className="rounded-lg border border-white/30 px-3 py-1.5 text-xs hover:bg-white/10 transition"
              >
                Ahora no
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-center mb-6">
          <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg">
            <img
              src="/Assets/logo.jpg"
              alt="Logo de inicio de sesión"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-center text-lg font-bold mb-6 tracking-wide uppercase">
          Iniciar sesión
        </h2>

        {(authError || error) && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {authError || error}
          </p>
        )}

        <form onSubmit={handleAuth} className="space-y-6 w-full">
          {/* Usuario */}
          <div className="relative">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer w-full bg-transparent border-b-2 border-white/30 text-white px-2 pt-5 pb-2 focus:outline-none focus:border-verdefluor placeholder-transparent"
              required
            />
            <label className="absolute left-2 top-0 text-white/50 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-verdefluor">
              Usuario
            </label>
          </div>

          {/* Contraseña */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-transparent border-b-2 border-white/30 text-white px-2 pt-5 pb-2 focus:outline-none focus:border-verdefluor placeholder-transparent"
              required
            />
            <label className="absolute left-2 top-0 text-white/50 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-verdefluor">
              Contraseña
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-3 flex items-center gap-1 text-white/70 hover:text-white text-xs"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showPassword ? "Ocultar" : "Mostrar"}</span>
            </button>
          </div>

          {/* Iniciar sesión con contraseña */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-800 text-white font-semibold py-2 rounded-full shadow hover:opacity-90 transition"
          >
            {loading ? "Ingresando..." : "INGRESAR"}
          </button>
          {biometricReady && (
            <button
              type="button"
              onClick={handleAuthWithFingerprint}
              disabled={loadingBiometric}
              className="w-full border border-verdefluor text-verdefluor font-semibold py-2 rounded-full hover:bg-verdefluor/10 transition flex items-center justify-center gap-2"
            >
              <Fingerprint size={16} />
              {loadingBiometric ? "Verificando huella..." : "Ingresar con huella"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
