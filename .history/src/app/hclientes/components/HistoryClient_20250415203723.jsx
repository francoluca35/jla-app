"use client";

import { useState } from "react";
import useClientes from "@/hooks/useClient";

export default function HistoryClient() {
  const { clientes, loading, error } = useClientes();
  const [filter, setFilter] = useState("Todos");

  if (loading) return <div className="text-white">Cargando...</div>;
  if (error) return <div className="text-red-500">Error cargando datos</div>;

  const filteredClientes =
    filter === "Todos"
      ? clientes
      : clientes.filter((cliente) => cliente.tipo === filter);

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{
        backgroundImage: "url('/fondo-textura.png')",
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
      <div className="w-full max-w-4xl grid grid-cols-5 text-center">
        <div className="p-2 bg-[#1f2c26] text-green-400 font-bold">Nombre</div>
        <div className="p-2 bg-[#1f2c26] text-green-400 font-bold">Empresa</div>
        <div className="p-2 bg-[#1f2c26] text-green-400 font-bold">Fecha</div>
        <div className="p-2 bg-[#1f2c26] text-green-400 font-bold">Tipo</div>
        <div className="p-2 bg-[#1f2c26] text-green-400 font-bold">+</div>

        {filteredClientes.map((cliente, index) => (
          <React.Fragment key={index}>
            <div className="p-2 bg-[#84b89b] text-black">{cliente.nombre}</div>
            <div className="p-2 bg-[#1f2c26] text-white">
              {cliente.empresa || "-"}
            </div>
            <div className="p-2 bg-[#84b89b] text-black">{cliente.fecha}</div>
            <div className="p-2 bg-[#1f2c26] text-white">{cliente.tipo}</div>
            <div className="p-2 bg-[#1f2c26] text-white">+</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
