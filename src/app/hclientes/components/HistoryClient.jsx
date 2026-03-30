"use client";
import React, { useState, useEffect } from "react";
import useClientes from "@/hooks/useClient";
import Swal from "sweetalert2";

export default function HistoryClient() {
  const { clientes, loading, error, refetch, eliminarCliente, editarCliente } =
    useClientes();

  const [filter, setFilter] = useState("Todos");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(null);

  useEffect(() => {
    if (selectedClient) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedClient]);

  if (loading) return <div className="text-gray-600 py-8">Cargando...</div>;
  if (error) return <div className="text-red-600 py-8">Error cargando datos</div>;

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
    const { totalTrabajo } = editedClient;

    const updatedClient = {
      ...editedClient,
    };

    await editarCliente(updatedClient);

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

    await editarCliente({
      ...selectedClient,
      estado: "terminado",
      fechaTerminado: new Date().toISOString().split("T")[0], // guarda "2025-04-29"
    });

    setSelectedClient(actualizado);
    refetch();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historial de Clientes</h1>
        <p className="text-gray-500 mt-1 text-sm">Ver y gestionar clientes e ingresos</p>
      </header>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["Todos", "Servicio T.", "Presupuesto"].map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFilter(tipo)}
            className={`rounded-lg px-5 py-2 text-sm font-medium border transition-colors ${
              filter === tipo
                ? "bg-verdefluor text-black border-verdefluor"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="min-w-[650px]">
          <div className="grid grid-cols-6 border-b border-gray-200 bg-gray-50 text-gray-700 text-sm font-semibold">
            <div className="p-3 text-left">Nombre</div>
            <div className="p-3 text-left">Sucursal</div>
            <div className="p-3 text-left">Fecha</div>
            <div className="p-3 text-left">Tipo</div>
            <div className="p-3 text-left">Estado</div>
            <div className="p-3 text-center">+</div>
          </div>

          {filteredClientes.map((cliente, index) => (
            <div
              key={index}
              className={`grid grid-cols-6 text-sm text-gray-800 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              } hover:bg-gray-50 border-b border-gray-100 last:border-0`}
            >
              <div className="p-2 text-black break-words">
                {cliente.clientName}
              </div>
              <div className="p-2 text-black">{cliente.branch}</div>
              <div className="p-2 text-black">
                {cliente.problemType === "presupuesto" &&
                cliente.estado === "terminado" ? (
                  <div className="flex flex-col items-center">
                    <span className="line-through text-sm text-red-500">
                      {cliente.date
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("/")}
                    </span>
                    <span className="text-md font-bold text-black">
                      {cliente.fechaTerminado
                        ? cliente.fechaTerminado.split("-").reverse().join("/")
                        : ""}
                    </span>
                  </div>
                ) : (
                  <span>
                    {cliente.date?.slice(0, 10).split("-").reverse().join("/")}
                  </span>
                )}
              </div>

              <div className="p-2 text-black">
                {cliente.problemType === "arreglo"
                  ? "ar"
                  : cliente.problemType === "presupuesto"
                  ? "pr"
                  : "-"}
              </div>
              <div
                className={`p-2 font-semibold text-sm ${
                  cliente.problemType === "arreglo" ||
                  cliente.estado === "terminado"
                    ? "text-gray-600"
                    : "text-amber-700"
                }`}
              >
                {cliente.problemType === "arreglo" ||
                cliente.estado === "terminado"
                  ? "terminado"
                  : "en curso"}
              </div>

              <div
                className="p-2 text-gray-600 hover:text-verdefluor cursor-pointer font-medium text-center"
                onClick={() => setSelectedClient(cliente)}
              >
                +
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DETALLES */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto px-2 sm:px-4 py-6 flex justify-center items-start">
          <div className="bg-white w-full max-w-3xl mx-auto rounded-xl shadow-xl border border-gray-200 px-4 py-6 sm:px-6 sm:py-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Detalles del cliente
            </h2>
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                {[
                  { label: "Nombre", key: "clientName" },
                  { label: "Sucursal", key: "branch" },
                  { label: "Fecha", key: "date", type: "date" },
                  { label: "Tipo", key: "problemType" },
                  { label: "Forma de pago", key: "paymentOption" },
                  { label: "Método de pago", key: "paymentMethod" },
                  { label: "Efectivo", key: "efectivo", type: "number" },
                  {
                    label: "Transferencia",
                    key: "transferencia",
                    type: "number",
                  },
                  {
                    label: "Total del trabajo",
                    key: "totalTrabajo",
                    type: "number",
                  },
                  { label: "Estado", key: "estado", type: "select" },
                  ,
                  {
                    label: "Descripción",
                    key: "description",
                    type: "textarea",
                  },
                ].map(({ label, key, type = "text" }) => (
                  <div key={key}>
                    <label className="block font-medium text-gray-700 mb-1 text-sm">
                      {label}:
                    </label>
                    {type === "textarea" ? (
                      <textarea
                        rows={3}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        value={editedClient?.[key] || ""}
                        onChange={(e) =>
                          setEditedClient({
                            ...editedClient,
                            [key]: e.target.value,
                          })
                        }
                      />
                    ) : type === "select" && key === "estado" ? (
                      <select
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        value={editedClient?.estado || "en curso"}
                        onChange={(e) =>
                          setEditedClient({
                            ...editedClient,
                            estado: e.target.value,
                          })
                        }
                      >
                        <option value="en curso">En curso</option>
                        <option value="terminado">Terminado</option>
                      </select>
                    ) : (
                      <input
                        type={type}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        value={
                          type === "date"
                            ? editedClient?.[key]
                              ? new Date(editedClient[key])
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                            : editedClient?.[key] || ""
                        }
                        onChange={(e) =>
                          setEditedClient({
                            ...editedClient,
                            [key]:
                              type === "number"
                                ? Number(e.target.value)
                                : e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                <div className="space-y-2">
                  <p>
                    <strong>Nombre:</strong> {selectedClient.clientName}
                  </p>
                  <p>
                    <strong>Sucursal:</strong> {selectedClient.branch}
                  </p>
                  <p>
                    <strong>Tipo:</strong> {selectedClient.problemType}
                  </p>
                  <p>
                    <strong>Forma de pago:</strong>{" "}
                    {selectedClient.paymentOption}
                  </p>
                  <p>
                    <strong>Método de pago:</strong>{" "}
                    {selectedClient.paymentMethod}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Efectivo:</strong> ${selectedClient.efectivo}
                  </p>
                  <p>
                    <strong>Transferencia:</strong> $
                    {selectedClient.transferencia}
                  </p>
                  <p>
                    <strong>Total del trabajo:</strong> $
                    {selectedClient.totalTrabajo}
                  </p>
                  <p>
                    <strong>Estado:</strong> {selectedClient.estado}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {selectedClient.description}
                  </p>
                </div>
              </div>
            )}

            {/* SERVICIOS */}
            <div className="mt-6">
              <span className="font-semibold text-gray-800 text-sm">Servicios</span>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
                {(isEditing
                  ? editedClient?.sertec || []
                  : selectedClient.sertec
                )?.map((s, i) => {
                  const fueAnulada = s.anulada === true;
                  const anulables = [
                    "seña",
                    "arreglo",
                    "% del total abonado",
                    "seña efectivo",
                    "seña transferencia",
                  ];
                  const esAnulable = anulables.includes(s.tipo);

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
                        {isEditing ? (
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1"
                            value={editedClient?.sertec?.[i]?.monto}
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
                          onClick={async () => {
                            const confirm = await Swal.fire({
                              title: `¿Cancelar ${s.tipo}?`,
                              text: "Esta acción marcará el servicio como anulado.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Sí, cancelar",
                              cancelButtonText: "No, mantener",
                            });

                            if (confirm.isConfirmed) {
                              anularServicio(i);
                            }
                          }}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Cancelar {s.tipo}
                        </button>
                      )}
                    </li>
                  );
                })}

                {/* Total pendiente por pagar */}
                <li className="flex justify-between items-center gap-2">
                  <span className="font-semibold">Total por pagar:</span>
                  <span className="font-semibold text-red-600">
                    $
                    {selectedClient.amount -
                      selectedClient.sertec.find(
                        (service) => service.tipo === "seña transferencia"
                      )?.monto}
                  </span>
                </li>
              </ul>
            </div>

            {/* BOTONES */}
            <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleGuardarCambios}
                    className="w-full sm:w-auto flex-1 bg-verdefluor hover:bg-verdefluort text-black font-semibold py-2 rounded-lg"
                  >
                    Guardar cambios
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedClient(null);
                    }}
                    className="w-full sm:w-auto flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditedClient({
                        ...selectedClient,
                        sertec: [...selectedClient.sertec],
                      });
                    }}
                    className="w-full sm:w-auto flex-1 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded-lg"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(selectedClient._id)}
                    className="w-full sm:w-auto flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
                  >
                    Eliminar
                  </button>
                  {selectedClient.estado !== "terminado" && (
                    <button
                      onClick={async () => {
                        const actualizado = {
                          ...selectedClient,
                          estado: "terminado",
                        };
                        await editarCliente({
                          ...selectedClient,
                          estado: "terminado",
                          fechaTerminado: new Date()
                            .toISOString()
                            .split("T")[0],
                        });
                        setSelectedClient(actualizado);
                        refetch();
                      }}
                      className="w-full sm:w-auto flex-1 bg-verdefluor hover:bg-verdefluort text-black font-semibold py-2 rounded-lg"
                    >
                      Marcar como terminado
                    </button>
                  )}
                </>
              )}
              <button
                onClick={() => {
                  setSelectedClient(null);
                  setIsEditing(false);
                  setEditedClient(null);
                }}
                className="w-full sm:w-auto flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
