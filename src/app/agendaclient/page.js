import React, { Suspense } from "react";
import DashboardLayout from "../components/DashboardLayout";
import FormClient from "./components/FormClient";

const Loading = () => <div className="text-center text-black">Cargando...</div>;

function agendaclient() {
  return (
    <DashboardLayout>
      <div className="text-black [&_input]:text-black [&_textarea]:text-black [&_select]:text-black [&_option]:text-black">
        <Suspense fallback={<Loading />}>
          <FormClient />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

export default agendaclient;
