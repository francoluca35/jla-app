// /components/CambiarPassword.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import useCambiarPassword from "@/hooks/useCambiarPassword";

export default function CambiarPassword() {
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const { cambiarPassword, loading } = useCambiarPassword();

  const handleCambio = async (e) => {
    e.preventDefault();

    if (nueva !== confirmar) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    const result = await cambiarPassword(nueva);

    if (result.success) {
      Swal.fire("Éxito", "Contraseña actualizada correctamente", "success");
    } else {
      Swal.fire("Error", result.error || "Error desconocido", "error");
    }
  };

  return (
    <form onSubmit={handleCambio}>
      <label>Nueva Contraseña</label>
      <input
        type="password"
        value={nueva}
        onChange={(e) => setNueva(e.target.value)}
        required
      />
      <label>Confirmar Nueva Contraseña</label>
      <input
        type="password"
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar Cambios"}
      </button>
    </form>
  );
}
