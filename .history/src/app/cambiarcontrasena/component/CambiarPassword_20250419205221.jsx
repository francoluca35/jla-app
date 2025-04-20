"use client";

import { useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useCambiarPassword from "@/hooks/useCambiarPassword";

export default function CambiarPassword() {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [ver, setVer] = useState(false);
  const router = useRouter();
  const { cambiarPassword, loading } = useCambiarPassword();

  const username = "jlatec"; // 🔐 podés cambiar esto si lo tenés logueado

  const handleCambio = async (e) => {
    e.preventDefault();

    const result = await cambiarPassword(username, actual, nueva);

    if (result.success) {
      Swal.fire(
        "Éxito",
        "Contraseña actualizada correctamente",
        "success"
      ).then(() => router.push("/home"));
    } else {
      Swal.fire("Error", result.error || "Error desconocido", "error");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/Assets/admin.jpg')" }}
    >
      <form
        onSubmit={handleCambio}
        className="bg-black bg-opacity-80 text-white p-6 rounded-lg w-full max-w-sm flex flex-col gap-4 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center">Cambiar Contraseña</h2>

        <div>
          <label className="text-sm">Contraseña actual</label>
          <input
            type="password"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-white text-black outline-none"
            required
          />
        </div>

        <div className="relative">
          <label className="text-sm">Nueva contraseña</label>
          <input
            type={ver ? "text" : "password"}
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-white text-black outline-none pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setVer(!ver)}
            className="absolute right-3 top-[38px] text-gray-600"
          >
            {ver ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex justify-center items-center gap-2 bg-verdefluor text-black font-bold py-2 rounded-full hover:bg-verdefluort transition"
        >
          <Save size={16} /> {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
