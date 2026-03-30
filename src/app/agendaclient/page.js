import React, { Suspense } from "react";
import DashboardLayout from "../components/DashboardLayout";
import FormClient from "./components/FormClient";

const Loading = () => <div className="text-center text-neutral-600">Cargando...</div>;

function agendaclient() {
  return (
    <DashboardLayout>
      <Suspense fallback={<Loading />}>
        <FormClient />
      </Suspense>
    </DashboardLayout>
  );
}

export default agendaclient;
