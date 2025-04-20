import React, { Suspense } from "react";
import CambiarPassword from "./component/CambiarPassword";

function cambiarcontrasena() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <CambiarPassword />
      </Suspense>
    </div>
  );
}

export default cambiarcontrasena;
