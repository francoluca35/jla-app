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
              src="/Assets/logo.jpg" // ← cambiá esta ruta si tu logo está en otra ubicación
              alt="Login Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-center text-lg font-bold mb-6 tracking-wide uppercase">
          Login
        </h2>

        {(authError || error) && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {authError || error}
          </p>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-white/70" size={18} />
            <input
              type="text"
              placeholder="Email ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-white/30 text-white pl-10 pb-2 pt-3 focus:outline-none focus:border-verdefluor placeholder-white/50"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-white/70" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/30 text-white pl-10 pb-2 pt-3 focus:outline-none focus:border-verdefluor placeholder-white/50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-white/60"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 text-sm">
            <input
              id="showPass"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="accent-verdefluor"
            />
            <label htmlFor="showPass">Mostrar contraseña</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-2 rounded-full shadow hover:opacity-90 transition"
          >
            {loading ? "Ingresando..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
