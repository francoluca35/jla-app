import React from "react";
import useIngresos from "@/hooks/useIngresos";

function TabsIngresos() {
  const {
    calcularTotal,
    obtenerFiltrados,
    setFiltro,
    filtro,
    subFiltro,
    setSubFiltro,
  } = useIngresos();

  const datos = obtenerFiltrados();

  return (
    <div className="p-4 bg-[#2b2b2b] min-h-screen text-white font-sans">
      <h1 className="text-center text-2xl font-bold mb-6 tracking-wide">
        HISTORIAL DE INGRESOS
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-6 py-2 rounded-full font-semibold ${
            filtro === "todos" ? "bg-green-700 text-white" : "bg-green-900"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro("arreglo")}
          className={`px-6 py-2 rounded-full font-semibold ${
            filtro === "arreglo" ? "bg-green-500 text-black" : "bg-green-900"
          }`}
        >
          Servicio T.
        </button>
        <button
          onClick={() => setFiltro("presupuesto")}
          className={`px-6 py-2 rounded-full font-semibold ${
            filtro === "presupuesto"
              ? "bg-green-700 text-white"
              : "bg-green-900"
          }`}
        >
          Presupuesto
        </button>
      </div>

      {filtro === "presupuesto" && (
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setSubFiltro("todos")}
            className={`px-6 py-2 rounded-full font-semibold ${
              subFiltro === "todos" ? "bg-gray-600 text-white" : "bg-gray-800"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSubFiltro("seña")}
            className={`px-6 py-2 rounded-full font-semibold ${
              subFiltro === "seña" ? "bg-yellow-500 text-black" : "bg-gray-800"
            }`}
          >
            Seña
          </button>
          <button
            onClick={() => setSubFiltro("pago total")}
            className={`px-6 py-2 rounded-full font-semibold ${
              subFiltro === "pago total"
                ? "bg-orange-500 text-black"
                : "bg-gray-800"
            }`}
          >
            Pago total
          </button>
        </div>
      )}

      <div className="overflow-x-auto mx-auto max-w-4xl">
        <table className="w-full border border-green-800 bg-[#1e1e1e]">
          <thead>
            <tr className="bg-green-700 text-black">
              <th className="p-3 border border-green-800">Cliente</th>
              <th className="p-3 border border-green-800">Sucursal</th>
              <th className="p-3 border border-green-800">Tipo</th>
              <th className="p-3 border border-green-800">Pago</th>
              <th className="p-3 border border-green-800">Monto</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 border border-green-800">
                  {item.clientName}
                </td>
                <td className="p-2 border border-green-800">{item.branch}</td>
                <td className="p-2 border border-green-800">
                  {item.problemType}
                </td>
                <td className="p-2 border border-green-800">
                  {item.paymentOption || "-"}
                </td>
                <td className="p-2 border border-green-800">${item.amount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-green-700 text-black font-bold text-center">
              <td className="p-3 border border-green-800" colSpan="4">
                Total:
              </td>
              <td className="p-3 border border-green-800">
                ${calcularTotal()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default TabsIngresos;
