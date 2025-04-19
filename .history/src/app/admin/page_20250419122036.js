"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useLogin from "../../hooks/useLogin.js";

export default function AdminAuth() {
  const router = useRouter();
  const { login, loading, error } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (loading) return;

    const validUser = await login(username, password);

    if (validUser) {
      localStorage.setItem("adminUser", JSON.stringify(validUser));
      router.push("/home");
    } else {
      setAuthError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: "url('/Assets/admin.jpg')",
      }}
    >
      <div className="bg-black bg-opacity-80 p-8 rounded-xl w-80 flex flex-col items-center shadow-lg backdrop-blur-sm">
        <img
          src="/Assets/logo.jpg"
          alt="Rapiflex Logo"
          className="w-20 h-20 object-cover rounded-full mb-4 shadow-md"
        />
        <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wide">
          Iniciar Sesión
        </h2>

        {(authError || error) && (
          <p className="text-red-500 text-sm mb-2 text-center">
            {authError || error}
          </p>
        )}

        <form onSubmit={handleAuth} className="w-full flex flex-col gap-5">
          <div>
            <label className="text-white text-sm">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresar usuario"
              className="w-full bg-transparent border-b border-white text-white placeholder-gray-400 py-2 px-1 focus:outline-none focus:border-verdefluor transition duration-200"
              required
            />
          </div>

          <div>
            <label className="text-white text-sm">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresar contraseña"
              className="w-full bg-transparent border-b border-white text-white placeholder-gray-400 py-2 px-1 focus:outline-none focus:border-verdefluor transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-verdefluor text-black font-bold py-2 rounded-full hover:bg-verdefluort transition w-full"
            disabled={loading}
          >
            {loading ? "Cargando..." : "ENTRAR"}
          </button>

          <p className="text-sm text-white text-center hover:underline cursor-pointer">
            ¿Olvidaste tu contraseña?
          </p>
        </form>
      </div>
    </div>
  );
}
