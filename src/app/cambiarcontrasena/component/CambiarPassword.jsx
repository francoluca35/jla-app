"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useCambiarPassword from "@/hooks/useCambiarPassword";

function CambiarPassword() {
  const [username, setUsername] = useState("jlatec");
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [verActual, setVerActual] = useState(false);
  const [verNueva, setVerNueva] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const router = useRouter();
  const { cambiarPassword, loading } = useCambiarPassword();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("adminUser");
      if (storedUser) {
        setUsername(JSON.parse(storedUser)?.username || "jlatec");
      }
    }
  }, []);

  const handleCambio = async (e) => {
    e.preventDefault();

    if (nueva !== confirmar) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    const result = await cambiarPassword(username, actual, nueva);

    if (result.success) {
      Swal.fire(
        "Éxito",
        "Contraseña actualizada correctamente",
        "success"
      ).then(() => {
        router.push("/home");
      });
    } else {
      Swal.fire("Error", result.error || "Error desconocido", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cambiar contraseña</h1>
        <p className="text-gray-500 mt-1 text-sm">Actualizar tu contraseña de acceso</p>
      </header>

      <form
        onSubmit={handleCambio}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-5"
      >
        <div className="relative">
          <label className="text-sm font-medium text-gray-700 block mb-1">Contraseña actual</label>
          <input
            type={verActual ? "text" : "password"}
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 pr-10 focus:ring-2 focus:ring-verdefluor focus:border-verdefluor"
            required
          />
          <button
            type="button"
            onClick={() => setVerActual(!verActual)}
            className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
          >
            {verActual ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <label className="text-sm font-medium text-gray-700 block mb-1">Nueva contraseña</label>
          <input
            type={verNueva ? "text" : "password"}
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 pr-10 focus:ring-2 focus:ring-verdefluor focus:border-verdefluor"
            required
          />
          <button
            type="button"
            onClick={() => setVerNueva(!verNueva)}
            className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
          >
            {verNueva ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <label className="text-sm font-medium text-gray-700 block mb-1">Confirmar nueva contraseña</label>
          <input
            type={verConfirmar ? "text" : "password"}
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 pr-10 focus:ring-2 focus:ring-verdefluor focus:border-verdefluor"
            required
          />
          <button
            type="button"
            onClick={() => setVerConfirmar(!verConfirmar)}
            className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
          >
            {verConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex justify-center items-center gap-2 bg-verdefluor hover:bg-verdefluort text-black font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70"
        >
          <Save size={16} /> {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}

export default CambiarPassword;
