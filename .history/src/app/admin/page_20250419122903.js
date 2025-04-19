"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useLogin from "../../hooks/useLogin";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function AdminAuth() {
  const router = useRouter();
  const { login, loading, error } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="backdrop-blur-md bg-gradient-to-br from-[#4b1e5a]/60 to-[#1c1c3c]/60 p-8 rounded-3xl w-96 shadow-xl text-white">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden  shadow-lg">
            <img
              src="/Assets/logo.jpg"
              alt="Login Logo"
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
          {/* Email */}
          <div className="relative">
            <input
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer w-full bg-transparent border-b-2 border-white/30 text-white px-2 pt-5 pb-2 focus:outline-none focus:border-verdefluor placeholder-transparent"
              required
            />
            <label className="absolute left-2 top-0 text-white/50 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-verdefluor">
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-transparent border-b-2 border-white/30 text-white px-2 pt-5 pb-2 focus:outline-none focus:border-verdefluor placeholder-transparent"
              required
            />
            <label className="absolute left-2 top-0 text-white/50 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-verdefluor">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-4 text-white/60"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Mostrar contraseña */}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2 rounded-full shadow hover:opacity-90 transition"
          >
            {loading ? "Ingresando..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
