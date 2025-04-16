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
        <div className="p-2  text-black font-bold">Nombre</div>
        <div className="p-2  text-black font-bold">Sucursal</div>
        <div className="p-2  text-black font-bold">Fecha</div>
        <div className="p-2  text-black font-bold">Tipo</div>
        <div className="p-2  text-white font-bold ">+</div>

        {filteredClientes.map((cliente, index) => (
          <React.Fragment key={index}>
            <div className="p-2 bg-[#84b89b] text-black">
              {cliente.clientName}
            </div>
            <div className="p-2  text-black">{cliente.branch}</div>
            <div className="p-2  text-black">
              {new Date(cliente.date).toLocaleDateString()}
            </div>
            <div className="p-2  text-black">{cliente.problemType}</div>
            <div
              className="p-2  text-white hover:text-green-600 cursor-pointer"
              onClick={() => setSelectedClient(cliente)}
            >
              +
            </div>
          </React.Fragment>
        ))}
      </div>

      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-green-800 mb-6">
              Detalles del Cliente
            </h2>

            <div className="space-y-3 text-left text-gray-800">
              <p>
                <span className="font-semibold text-green-600">Nombre:</span>{" "}
                {selectedClient.clientName}
              </p>
              <p>
                <span className="font-semibold text-green-600">Sucursal:</span>{" "}
                {selectedClient.branch}
              </p>
              <p>
                <span className="font-semibold text-green-600">Fecha:</span>{" "}
                {new Date(selectedClient.date).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold text-green-600">Pago:</span>{" "}
                {selectedClient.paymentOption}
              </p>
              <p>
                <span className="font-semibold text-green-600">
                  Monto Total:
                </span>{" "}
                ${selectedClient.amount}
              </p>

              <div>
                <span className="font-semibold text-green-600">Servicios:</span>
                <ul className="list-disc pl-6 mt-1 text-gray-700">
                  {selectedClient.sertec.map((s, i) => (
                    <li key={i}>
                      {s.tipo} — <span className="font-medium">${s.monto}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p>
                <span className="font-semibold text-green-600">
                  Descripción:
                </span>{" "}
                {selectedClient.description}
              </p>
            </div>

            <button
              onClick={() => setSelectedClient(null)}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
