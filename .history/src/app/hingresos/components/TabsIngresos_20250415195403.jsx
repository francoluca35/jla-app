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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ingresos</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-4 py-2 rounded ${
            filtro === "todos" ? "bg-blue-600 text-white" : "bg-blue-200"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro("arreglo")}
          className={`px-4 py-2 rounded ${
            filtro === "arreglo" ? "bg-green-600 text-white" : "bg-green-200"
          }`}
        >
          Servicio Técnico (Arreglo)
        </button>
        <button
          onClick={() => setFiltro("presupuesto")}
          className={`px-4 py-2 rounded ${
            filtro === "presupuesto"
              ? "bg-purple-600 text-white"
              : "bg-purple-200"
          }`}
        >
          Presupuesto
        </button>
      </div>

      {filtro === "presupuesto" && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSubFiltro("todos")}
            className={`px-4 py-2 rounded ${
              subFiltro === "todos" ? "bg-gray-600 text-white" : "bg-gray-200"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSubFiltro("seña")}
            className={`px-4 py-2 rounded ${
              subFiltro === "seña"
                ? "bg-yellow-600 text-white"
                : "bg-yellow-200"
            }`}
          >
            Seña
          </button>
          <button
            onClick={() => setSubFiltro("pago total")}
            className={`px-4 py-2 rounded ${
              subFiltro === "pago total"
                ? "bg-orange-600 text-white"
                : "bg-orange-200"
            }`}
          >
            Pago total
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border">Sucursal</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Monto</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 border">{item.clientName}</td>
                <td className="p-2 border">{item.branch}</td>
                <td className="p-2 border">{item.problemType}</td>
                <td className="p-2 border">${item.amount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold text-center">
              <td className="p-2 border" colSpan="3">
                Total
              </td>
              <td className="p-2 border">${calcularTotal()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default TabsIngresos;
