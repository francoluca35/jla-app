import React, { Suspense } from "react";
import FormClient from "./components/FormClient";

// Puedes colocar un mensaje o un componente de carga aquí
const Loading = () => <div className="text-center text-white">Cargando...</div>;

function AgendaClient() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <FormClient />
      </Suspense>
    </div>
  );
}

export default agendaclient;
