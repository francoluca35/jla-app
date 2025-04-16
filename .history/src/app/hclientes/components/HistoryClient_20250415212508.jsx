"use client";
import React, { useState } from "react";
import useClientes from "@/hooks/useClient";

export default function HistoryClient() {
  const { clientes, loading, error } = useClientes();
  const [filter, setFilter] = useState("Todos");
  const [selectedClient, setSelectedClient] = useState(null);

  if (loading) return <div className="text-white">Cargando...</div>;
  if (error) return <div className="text-red-500">Error cargando datos</div>;

  const filteredClientes =
    filter === "Todos"
      ? clientes
      : clientes.filter((cliente) =>
          filter === "Servicio T."
            ? cliente.problemType === "arreglo"
            : cliente.problemType !== "arreglo"
        );

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{
        backgroundImage: "url('/Assets/formclient.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-black font-bold text-lg mb-6 tracking-wide">
        HISTORIAL DE INGRESOS
      </h1>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        {["Todos", "Servicio T.", "Presupuesto"].map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFilter(tipo)}
            className={`rounded-full px-6 py-2 font-bold border-2 transition ${
              filter === tipo
                ? "bg-verdefluor text-black"
                : "bg-verdepanel text-white"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      <div className="w-full  bg-verdefluort max-w-4xl grid grid-cols-5 text-center font-semibold">
        <div className="p-2 bg-tabla text-black font-bold">Nombre</div>
        <div className="p-2 bg-tabla text-black font-bold">Sucursal</div>
        <div className="p-2 bg-tabla text-black font-bold">Fecha</div>
        <div className="p-2 bg-tabla text-black font-bold">Tipo</div>
        <div className="p-2 bg-tabla text-white font-bold ">+</div>

        {filteredClientes.map((cliente, index) => (
          <React.Fragment key={index}>
            <div className="p-2 bg-[#84b89b] text-black">
              {cliente.clientName}
            </div>
            <div className="p-2 bg-tabla text-black">{cliente.branch}</div>
            <div className="p-2 bg-[#84b89b] text-black">
              {new Date(cliente.date).toLocaleDateString()}
            </div>
            <div className="p-2 bg-tabla text-black">{cliente.problemType}</div>
            <div
              className="p-2 bg-tabla text-white hover:text-green-600 cursor-pointer"
              onClick={() => setSelectedClient(cliente)}
            >
              +
            </div>
          </React.Fragment>
        ))}
      </div>

      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-verdepanel text-center rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Detalles del Cliente</h2>

            <div className="mb-2">
              <strong>Nombre:</strong> {selectedClient.clientName}
            </div>
            <div className="mb-2">
              <strong>Sucursal:</strong> {selectedClient.branch}
            </div>
            <div className="mb-2">
              <strong>Fecha:</strong>{" "}
              {new Date(selectedClient.date).toLocaleString()}
            </div>
            <div className="mb-2">
              <strong>Tipo de Problema:</strong> {selectedClient.problemType}
            </div>
            <div className="mb-2">
              <strong>Pago:</strong> {selectedClient.paymentOption}
            </div>
            <div className="mb-2">
              <strong>Monto Total:</strong> ${selectedClient.amount}
            </div>
            <div className="mb-2">
              <strong>Descripción:</strong> {selectedClient.description}
            </div>
            <div className="mb-2">
              <strong>Servicios:</strong>
              <ul className="list-disc pl-5">
                {selectedClient.sertec.map((s, i) => (
                  <li key={i}>
                    {s.tipo} - ${s.monto}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedClient(null)}
              className="mt-4 bg-green-900 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
