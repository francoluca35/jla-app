import React from "react";

function TabsEstadisticas() {
  return (
    <div>
      {/* Tabla */}
      <div className="bg-verdefluor bg-opacity-90 rounded-lg p-6 backdrop-blur-md shadow-lg text-sm w-full max-w-xs text-white">
        <table className="table-auto border-collapse w-full text-center">
          <thead>
            <tr>
              <th className="p-2 border border-white/30">Datos</th>
              <th className="p-2 border border-white/30">Semanal</th>
              <th className="p-2 border border-white/30">Mensual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-white/30">Clientes</td>
              <td className="p-2 border border-white/30">clientes nuevos</td>
              <td className="p-2 border border-white/30">clientes nuevos</td>
            </tr>
            <tr>
              <td className="p-2 border border-white/30">Gastos</td>
              <td className="p-2 border border-white/30">
                total gasto semanal
              </td>
              <td className="p-2 border border-white/30">
                total gasto mensual
              </td>
            </tr>
            <tr>
              <td className="p-2 border border-white/30">Ingresos</td>
              <td className="p-2 border border-white/30">
                total ingreso semanal
              </td>
              <td className="p-2 border border-white/30">
                total ingreso mensual
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabsEstadisticas;
