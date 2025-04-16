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
                ? "bg-green-400 text-black"
                : "bg-[#364A39] text-white"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="w-full bg-green-800/50 max-w-4xl grid grid-cols-5 text-center">
        <div className="p-2 bg-[#1f2c26] text-green-400 font-bold">Nombre</div>
        <div className="p-2 bg-[#1f2c26] text-green-400 font-bold">
          Sucursal
        </div>
        <div className="p-2 bg-[#1f2c26] text-green-400 font-bold">Fecha</div>
        <div className="p-2 bg-[#1f2c26] text-green-400 font-bold">Tipo</div>
        <div className="p-2 bg-[#1f2c26] text-green-400 font-bold">+</div>

        {filteredClientes.map((cliente, index) => (
          <React.Fragment key={index}>
            <div className="p-2 bg-[#84b89b] text-black">
              {cliente.clientName}
            </div>
            <div className="p-2 bg-[#1f2c26] text-white">{cliente.branch}</div>
            <div className="p-2 bg-[#84b89b] text-black">
              {new Date(cliente.date).toLocaleDateString()}
            </div>
            <div className="p-2 bg-[#1f2c26] text-white">
              {cliente.problemType}
            </div>
            <div
              className="p-2 bg-[#1f2c26] text-white cursor-pointer"
              onClick={() => setSelectedClient(cliente)}
            >
              +
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
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
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
