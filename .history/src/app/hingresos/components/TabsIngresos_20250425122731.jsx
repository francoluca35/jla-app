"use client";
import React, { useState } from "react";
import useIngresos from "@/hooks/useIngresos";

function TabsIngresos() {
  const {
    calcularTotal,
    calcularTotalCombinado,
    obtenerFiltrados,
    setFiltro,
    filtro,
    subFiltro,
    setSubFiltro,
    eliminarIngreso,
    editarIngreso,
  } = useIngresos();

  const datos = obtenerFiltrados().filter((item) => {
    if (item.problemType === "presupuesto" && item.estado !== "terminado") {
      return false;
    }
    return true;
  });

  const [modoEliminar, setModoEliminar] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});

  const toggleSeleccionado = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleEliminar = async () => {
    if (seleccionados.length === 0) return alert("No seleccionaste ninguno");
    await eliminarIngreso(seleccionados);
    setSeleccionados([]);
    setModoEliminar(false);
  };

  const handleEditar = () => {
    if (seleccionados.length !== 1) return alert("Seleccioná uno solo");

    const item = datos.find((i) => i._id === seleccionados[0]);
    setEditando(item);

    setForm({
      clientName: item.clientName || "",
      branch: item.branch || "",
      problemType: item.problemType || "",
      paymentOption: item.paymentOption || "",
      amount: item.amount || "",
    });
  };

  const confirmarEdicion = async () => {
    const updatedData = {
      ...form,
      amount: parseFloat(form.amount),
    };

    await editarIngreso(editando._id, updatedData);

    refetch();
    setModoEditar(false);
    setEditando(null);
    setSeleccionados([]);
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundImage: "url('/Assets/formclient.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-white tracking-wider">
        HISTORIAL DE INGRESOS
      </h1>

      {/* Filtros */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap justify-center">
        <button
          key="todos"
          onClick={() => setFiltro("todos")}
          className={`rounded-full px-6 py-2 font-bold border-2 transition ${
            filtro === "todos"
              ? "bg-verdefluor text-black"
              : "bg-verdepanel text-white"
          }`}
        >
          Todos
        </button>
        <button
          key="servicioT"
          onClick={() => setFiltro("arreglo")}
          className={`rounded-full px-6 py-2 font-bold border-2 transition ${
            filtro === "arreglo"
              ? "bg-verdefluor text-black"
              : "bg-verdepanel text-white"
          }`}
        >
          Servicio T.
        </button>
        <button
          key="presupuesto"
          onClick={() => setFiltro("presupuesto")}
          className={`rounded-full px-6 py-2 font-bold border-2 transition ${
            filtro === "presupuesto"
              ? "bg-verdefluor text-black"
              : "bg-verdepanel text-white"
          }`}
        >
          Presupuesto
        </button>
      </div>

      {/* Subfiltros */}
      {filtro === "presupuesto" && (
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setSubFiltro("todos")}
            className={`px-4 py-2 rounded ${
              subFiltro === "todos"
                ? "bg-green-300 text-black"
                : "bg-green-700 text-white"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSubFiltro("seña")}
            className={`px-4 py-2 rounded ${
              subFiltro === "seña"
                ? "bg-green-300 text-black"
                : "bg-green-700 text-white"
            }`}
          >
            Seña
          </button>
          <button
            onClick={() => setSubFiltro("pago total")}
            className={`px-4 py-2 rounded ${
              subFiltro === "pago total"
                ? "bg-green-300 text-black"
                : "bg-green-700 text-white"
            }`}
          >
            Pago total
          </button>
        </div>
      )}

      {/* Botones eliminar / editar */}
      <div className="flex justify-center mb-4 gap-4 flex-wrap">
        {!modoEliminar ? (
          <button
            onClick={() => {
              setModoEliminar(true);
              setModoEditar(false);
            }}
            className="bg-red-700 text-white px-4 py-2 rounded font-semibold hover:bg-red-800 transition"
          >
            Eliminar
          </button>
        ) : (
          <>
            <button
              onClick={handleEliminar}
              className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition"
            >
              Eliminar seleccionados
            </button>
            <button
              onClick={() => {
                setModoEliminar(false);
                setSeleccionados([]);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded font-semibold hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </>
        )}

        {!modoEditar ? (
          <button
            onClick={() => {
              setModoEditar(true);
              setModoEliminar(false);
            }}
            className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition"
          >
            Editar
          </button>
        ) : (
          <>
            <button
              onClick={handleEditar}
              className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Editar seleccionado
            </button>
            <button
              onClick={() => {
                setModoEditar(false);
                setSeleccionados([]);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded font-semibold hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border border-green-700 bg-black bg-opacity-60 text-white rounded">
          <thead>
            <tr className="bg-green-600 text-black">
              {(modoEliminar || modoEditar) && (
                <th className="p-3 border border-green-700">✔️</th>
              )}
              <th className="p-3 border border-green-700">Cliente</th>
              <th className="p-3 border border-green-700">Sucursal</th>
              <th className="p-3 border border-green-700">Tipo</th>
              <th className="p-3 border border-green-700">Pago</th>
              <th className="p-3 border border-green-700">Monto</th>
              <th className="p-3 border border-green-700">Estado</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item, index) => (
              <tr key={item._id || index} className="text-center">
                {(modoEliminar || modoEditar) && (
                  <td className="p-3 border border-green-700">
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(item._id)}
                      onChange={() => toggleSeleccionado(item._id)}
                    />
                  </td>
                )}
                <td className="p-3 border border-green-700">
                  {item.clientName}
                </td>
                <td className="p-3 border border-green-700">{item.branch}</td>
                <td className="p-3 border border-green-700">
                  {item.problemType}
                </td>
                <td className="p-3 border border-green-700">
                  {item.paymentOption || "-"}
                </td>
                <td className="p-3 border border-green-700">${item.amount}</td>
                <td className="p-3 border border-green-700">
                  {["arreglo", "presupuesto"].includes(item.problemType) ? (
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${
                        item.estado === "terminado"
                          ? "bg-green-600 text-white"
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {item.estado || "-"}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-green-600 text-black font-bold text-center">
              <td
                className="p-3 border border-green-700"
                colSpan={modoEliminar || modoEditar ? 5 : 4}
              >
                Total
              </td>
              <td className="p-3 border border-green-700">
                $
                {filtro === "todos"
                  ? calcularTotalCombinado()
                  : calcularTotal()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal simple de edición */}
      {editando && (
        <div className="bg-black bg-opacity-70 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar ingreso</h2>
            {[
              "clientName",
              "branch",
              "problemType",
              "paymentOption",
              "amount",
            ].map((campo) => (
              <div className="mb-3" key={campo}>
                <label className="block text-sm font-medium capitalize mb-1">
                  {campo}
                </label>
                <input
                  type={campo === "amount" ? "number" : "text"}
                  value={form[campo]}
                  onChange={(e) =>
                    setForm({ ...form, [campo]: e.target.value })
                  }
                  className="w-full p-2 border border-gray-400 rounded"
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditando(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEdicion}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TabsIngresos;
