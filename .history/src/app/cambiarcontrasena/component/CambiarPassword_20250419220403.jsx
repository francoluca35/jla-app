// /components/CambiarPassword.jsx
import { useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useCambiarPassword from "@/hooks/useCambiarPassword";

export default function CambiarPassword() {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [verActual, setVerActual] = useState(false);
  const [verNueva, setVerNueva] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const router = useRouter();
  const { cambiarPassword, loading } = useCambiarPassword();

  const username =
    JSON.parse(localStorage.getItem("adminUser"))?.username || "jlatec";

  const handleCambio = async (e) => {
    e.preventDefault();

    if (nueva !== confirmar) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    // Obtener el token de la cookie de sesión (esto se hace automáticamente si se configura correctamente)
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
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/Assets/admin.jpg')" }}
    >
      <form
        onSubmit={handleCambio}
        className="bg-black bg-opacity-90 text-white p-6 rounded-xl w-full max-w-sm flex flex-col gap-5 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center">Cambiar Contraseña</h2>

        {/* Actual */}
        <div className="relative">
          <label className="text-sm">Contraseña actual</label>
          <input
            type={verActual ? "text" : "password"}
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-white text-black outline-none pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setVerActual(!verActual)}
            className="absolute right-3 top-[35px] text-gray-600"
          >
            {verActual ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Nueva */}
        <div className="relative">
          <label className="text-sm">Nueva contraseña</label>
          <input
            type={verNueva ? "text" : "password"}
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-white text-black outline-none pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setVerNueva(!verNueva)}
            className="absolute right-3 top-[35px] text-gray-600"
          >
            {verNueva ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirmar */}
        <div className="relative">
          <label className="text-sm">Confirmar nueva contraseña</label>
          <input
            type={verConfirmar ? "text" : "password"}
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-white text-black outline-none pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setVerConfirmar(!verConfirmar)}
            className="absolute right-3 top-[35px] text-gray-600"
          >
            {verConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex justify-center items-center gap-2 bg-verdefluor text-black font-bold py-2 rounded-full hover:bg-verdefluort transition"
        >
          <Save size={16} /> {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
