"use client";
import React, { useState } from "react";
import useClientes from "@/hooks/useClientes";

function hingresos() {
  const { clientes, loading, error } = useClientes();

  const [filtros, setFiltros] = useState({
    nombre: "",
    desde: "",
    hasta: "",
    pago: "",
  });

  const filtrarClientes = () => {
    return clientes.filter((cliente) => {
      const nombreMatch = cliente.clientName
        .toLowerCase()
        .includes(filtros.nombre.toLowerCase());

      const pagoMatch = filtros.pago
        ? cliente.paymentOption === filtros.pago
        : true;

      const fecha = new Date(cliente.date);
      const desdeMatch = filtros.desde
        ? new Date(filtros.desde) <= fecha
        : true;
      const hastaMatch = filtros.hasta
        ? new Date(filtros.hasta) >= fecha
        : true;

      return nombreMatch && pagoMatch && desdeMatch && hastaMatch;
    });
  };

  if (loading) return <p className="p-4">Cargando clientes...</p>;
  if (error)
    return <p className="p-4 text-red-500">Error al cargar los clientes</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ingresos de Clientes</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtros.nombre}
          onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={filtros.desde}
          onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={filtros.hasta}
          onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <select
          value={filtros.pago}
          onChange={(e) => setFiltros({ ...filtros, pago: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="">Todos los pagos</option>
          <option value="pago total">Pago total</option>
          <option value="presupuesto">Presupuesto</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Sucursal</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Tipo de problema</th>
              <th className="p-2 border">Opción de pago</th>
              <th className="p-2 border">Monto</th>
              <th className="p-2 border">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {filtrarClientes().map((cliente) => (
              <tr key={cliente._id} className="border-t">
                <td className="p-2 border">{cliente.clientName}</td>
                <td className="p-2 border">{cliente.branch}</td>
                <td className="p-2 border">
                  {new Date(cliente.date).toLocaleDateString()}
                </td>
                <td className="p-2 border">{cliente.problemType}</td>
                <td className="p-2 border">{cliente.paymentOption}</td>
                <td className="p-2 border">
                  ${cliente.amount.toLocaleString()}
                </td>
                <td className="p-2 border">{cliente.description}</td>
              </tr>
            ))}
            {filtrarClientes().length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default hingresos;
