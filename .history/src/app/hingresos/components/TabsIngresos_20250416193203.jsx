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
    eliminarIngreso,
  } = useIngresos();

  const datos = obtenerFiltrados();

  const [modoEliminar, setModoEliminar] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);

  const toggleSeleccionado = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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

      {/* Botones de filtro principal */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-6 py-3 rounded transition-all duration-200 font-semibold ${
            filtro === "todos"
              ? "bg-green-300 text-black"
              : "bg-green-700 text-white"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro("arreglo")}
          className={`px-6 py-3 rounded transition-all duration-200 font-semibold ${
            filtro === "arreglo"
              ? "bg-green-300 text-black"
              : "bg-green-700 text-white"
          }`}
        >
          Servicio T.
        </button>
        <button
          onClick={() => setFiltro("presupuesto")}
          className={`px-6 py-3 rounded transition-all duration-200 font-semibold ${
            filtro === "presupuesto"
              ? "bg-green-300 text-black"
              : "bg-green-700 text-white"
          }`}
        >
          Presupuesto
        </button>
      </div>

      {/* Subfiltros para presupuesto */}
      {filtro === "presupuesto" && (
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setSubFiltro("todos")}
            className={`px-4 py-2 rounded transition-all duration-200 font-medium ${
              subFiltro === "todos"
                ? "bg-green-300 text-black"
                : "bg-green-700 text-white"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSubFiltro("seña")}
            className={`px-4 py-2 rounded transition-all duration-200 font-medium ${
              subFiltro === "seña"
                ? "bg-green-300 text-black"
                : "bg-green-700 text-white"
            }`}
          >
            Seña
          </button>
          <button
            onClick={() => setSubFiltro("pago total")}
            className={`px-4 py-2 rounded transition-all duration-200 font-medium ${
              subFiltro === "pago total"
                ? "bg-green-300 text-black"
                : "bg-green-700 text-white"
            }`}
          >
            Pago total
          </button>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border border-green-700 bg-black bg-opacity-60 text-white rounded">
          <thead>
            <tr className="bg-green-600 text-black">
              <th className="p-3 border border-green-700">Cliente</th>
              <th className="p-3 border border-green-700">Sucursal</th>
              <th className="p-3 border border-green-700">Tipo</th>
              <th className="p-3 border border-green-700">Pago</th>
              <th className="p-3 border border-green-700">Monto</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item, index) => (
              <tr key={index} className="text-center">
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
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-green-600 text-black font-bold text-center">
              <td className="p-3 border border-green-700" colSpan="4">
                Total
              </td>
              <td className="p-3 border border-green-700">
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
