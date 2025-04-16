import React, { Suspense } from "react";
import FormClient from "./components/FormClient";

// Puedes colocar un mensaje o un componente de carga aquí
const Loading = () => <div className="text-center text-white">Cargando...</div>;

function agendaclient() {
  return (
    <div
      className="text-white p-4 flex flex-col gap-4 w-full max-w-md mx-auto rounded-md"
      style={{
        backgroundImage: 'url("/Assets/formclient.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Suspense fallback={<Loading />}>
        <FormClient />
      </Suspense>
    </div>
  );
}

export default agendaclient;
