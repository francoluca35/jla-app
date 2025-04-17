"use client";
import React, { useState } from "react";
import useClientes from "@/hooks/useClient";
import Swal from "sweetalert2";

export default function HistoryClient() {
  const { clientes, loading, error, refetch, eliminarCliente, editarCliente } =
    useClientes();

  const [filter, setFilter] = useState("Todos");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(null);

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

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al cliente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      await eliminarCliente(id);
      setSelectedClient(null);
      refetch();
    }
  };

  const handleGuardarCambios = async () => {
    await editarCliente(editedClient);
    setIsEditing(false);
    setSelectedClient(null);
    setEditedClient(null);
    refetch();
  };

  const anularServicio = async (index) => {
    const actualizado = {
      ...selectedClient,
      sertec: selectedClient.sertec.map((item, idx) =>
        idx === index ? { ...item, anulada: true } : item
      ),
    };

    await editarCliente(actualizado);
    refetch();
  };

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

      <div className="w-full bg-verdefluort max-w-4xl grid grid-cols-5 text-center font-semibold">
        <div className="p-2 text-black font-bold">Nombre</div>
        <div className="p-2 text-black font-bold">Sucursal</div>
        <div className="p-2 text-black font-bold">Fecha</div>
        <div className="p-2 text-black font-bold">Tipo</div>
        <div className="p-2 text-white font-bold">+</div>

        {filteredClientes.map((cliente, index) => (
          <React.Fragment key={index}>
            <div className="p-2 bg-[#84b89b] text-black">
              {cliente.clientName}
            </div>
            <div className="p-2 text-black">{cliente.branch}</div>
            <div className="p-2 text-black">
              {new Date(cliente.date).toLocaleDateString()}
            </div>
            <div className="p-2 text-black">{cliente.problemType}</div>
            <div
              className="p-2 text-white hover:text-green-600 cursor-pointer"
              onClick={() => {
                setSelectedClient(cliente);
              }}
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

            <div className="space-y-4 text-left text-gray-800">
              {isEditing ? (
                <>
                  <input
                    className="w-full border p-2 rounded"
                    value={editedClient?.clientName || ""}
                    onChange={(e) =>
                      setEditedClient({
                        ...editedClient,
                        clientName: e.target.value,
                      })
                    }
                  />
                  <input
                    className="w-full border p-2 rounded"
                    value={editedClient?.branch || ""}
                    onChange={(e) =>
                      setEditedClient({
                        ...editedClient,
                        branch: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={editedClient?.amount || ""}
                    onChange={(e) =>
                      setEditedClient({
                        ...editedClient,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                  <textarea
                    className="w-full border p-2 rounded"
                    value={editedClient?.description || ""}
                    onChange={(e) =>
                      setEditedClient({
                        ...editedClient,
                        description: e.target.value,
                      })
                    }
                  />
                </>
              ) : (
                <>
                  <p>
                    <span className="font-semibold text-green-600">
                      Nombre:
                    </span>{" "}
                    {selectedClient.clientName}
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">
                      Sucursal:
                    </span>{" "}
                    {selectedClient.branch}
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">Monto:</span>{" "}
                    ${selectedClient.amount}
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">
                      Descripción:
                    </span>{" "}
                    {selectedClient.description}
                  </p>
                </>
              )}

              <div>
                <span className="font-semibold text-green-600">Servicios:</span>
                <ul className="list-disc pl-6 mt-1 text-gray-700">
                  {(isEditing
                    ? editedClient?.sertec || selectedClient.sertec
                    : selectedClient.sertec
                  )?.map((s, i) => {
                    const fueAnulada = s.anulada === true;
                    const anulables = [
                      "seña",
                      "arreglo",
                      "% del total abonado",
                    ];
                    const esAnulable = anulables.includes(s.tipo);
                    const esEditable =
                      s.tipo === "totalidad del trabajo" ||
                      s.tipo === "pago total del trabajo";

                    return (
                      <li
                        key={i}
                        className={`flex justify-between items-start gap-2 ${
                          fueAnulada
                            ? "line-through text-red-600 font-medium"
                            : ""
                        }`}
                      >
                        <div className="flex-1">
                          <span className="block font-semibold">{s.tipo}</span>

                          {isEditing && esEditable ? (
                            <input
                              type="number"
                              value={
                                editedClient?.sertec?.[i]?.monto || s.monto
                              }
                              className="w-full border rounded px-2 py-1 mt-1"
                              onChange={(e) => {
                                const newSertec = [...editedClient.sertec];
                                newSertec[i].monto = Number(e.target.value);
                                setEditedClient({
                                  ...editedClient,
                                  sertec: newSertec,
                                });
                              }}
                            />
                          ) : (
                            <span className="block">${s.monto}</span>
                          )}

                          {fueAnulada && (
                            <span className="text-sm">(anulado)</span>
                          )}
                        </div>

                        {!fueAnulada && esAnulable && !isEditing && (
                          <button
                            onClick={() => anularServicio(i)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Cancelar {s.tipo}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {isEditing ? (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleGuardarCambios}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedClient(null);
                  }}
                  className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleEliminar(selectedClient._id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditedClient({
                      ...selectedClient,
                      sertec: [...selectedClient.sertec],
                    });
                  }}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg"
                >
                  Editar
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedClient(null);
                setIsEditing(false);
                setEditedClient(null);
              }}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
