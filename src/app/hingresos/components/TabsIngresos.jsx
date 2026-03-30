"use client";
import React, { useState } from "react";
import useIngresos from "@/hooks/useIngresos";

function TabsIngresos() {
  const {
    fetchData,
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

    fetchData();
    setModoEditar(false);
    setEditando(null);
    setSeleccionados([]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historial de Ingresos</h1>
        <p className="text-gray-500 mt-1 text-sm">Consultar y gestionar ingresos por tipo</p>
      </header>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: "todos", label: "Todos" },
          { key: "arreglo", label: "Servicio T." },
          { key: "presupuesto", label: "Presupuesto" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            className={`rounded-lg px-5 py-2 text-sm font-medium border transition-colors ${
              filtro === key
                ? "bg-verdefluor text-black border-verdefluor"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtro === "presupuesto" && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {["todos", "seña", "pago total"].map((sub) => (
            <button
              key={sub}
              onClick={() => setSubFiltro(sub)}
              className={`rounded-lg px-4 py-2 text-sm font-medium border transition-colors ${
                subFiltro === sub
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {sub === "todos" ? "Todos" : sub === "seña" ? "Seña" : "Pago total"}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {!modoEliminar ? (
          <button
            onClick={() => { setModoEliminar(true); setModoEditar(false); }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
          >
            Eliminar
          </button>
        ) : (
          <>
            <button onClick={handleEliminar} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
              Eliminar seleccionados
            </button>
            <button onClick={() => { setModoEliminar(false); setSeleccionados([]); }} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">
              Cancelar
            </button>
          </>
        )}
        {!modoEditar ? (
          <button
            onClick={() => { setModoEditar(true); setModoEliminar(false); }}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900"
          >
            Editar
          </button>
        ) : (
          <>
            <button onClick={handleEditar} className="bg-verdefluor text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-verdefluort">
              Editar seleccionado
            </button>
            <button onClick={() => { setModoEditar(false); setSeleccionados([]); }} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">
              Cancelar
            </button>
          </>
        )}
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-700 text-sm font-semibold">
              {(modoEliminar || modoEditar) && <th className="p-3 text-left w-10">✓</th>}
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Sucursal</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Pago</th>
              <th className="p-3 text-left">Monto</th>
              <th className="p-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item, index) => (
              <tr key={item._id || index} className={`text-sm text-gray-800 border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                {(modoEliminar || modoEditar) && (
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(item._id)}
                      onChange={() => toggleSeleccionado(item._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                )}
                <td className="p-3">{item.clientName}</td>
                <td className="p-3">{item.branch}</td>
                <td className="p-3">{item.problemType}</td>
                <td className="p-3">{item.paymentOption || "-"}</td>
                <td className="p-3 font-medium">${item.amount}</td>
                <td className="p-3">
                  {["arreglo", "presupuesto"].includes(item.problemType) ? (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.estado === "terminado" ? "bg-gray-200 text-gray-700" : "bg-amber-100 text-amber-800"}`}>
                      {item.estado || "-"}
                    </span>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold text-gray-900 text-sm">
              <td className="p-3" colSpan={modoEliminar || modoEditar ? 6 : 5}>Total</td>
              <td className="p-3">${filtro === "todos" ? calcularTotalCombinado() : calcularTotal()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {editando && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Editar ingreso</h2>
            {["clientName", "branch", "problemType", "paymentOption", "amount"].map((campo) => (
              <div className="mb-3" key={campo}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{campo}</label>
                <input
                  type={campo === "amount" ? "number" : "text"}
                  value={form[campo]}
                  onChange={(e) => setForm({ ...form, [campo]: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditando(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">
                Cancelar
              </button>
              <button onClick={confirmarEdicion} className="bg-verdefluor text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-verdefluort">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TabsIngresos;
