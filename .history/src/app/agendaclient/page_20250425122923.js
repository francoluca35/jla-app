import React, { Suspense } from "react";
import FormClient from "./components/FormClient";

const Loading = () => <div className="text-center text-white">Cargando...</div>;

function agendaclient() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <FormClient />
      </Suspense>
    </div>
  );
}

export default agendaclient;
