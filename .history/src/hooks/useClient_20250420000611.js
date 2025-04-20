import { useEffect, useState } from "react";
import axios from "axios";

export default function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientes = async () => {
    try {
      const res = await axios.get("/api/clientes");
      setClientes(res.data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarCliente = async (id) => {
    try {
      await axios.delete(`/api/clientes?id=${id}`);
    } catch (err) {
      console.error("Error eliminando cliente:", err);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const editarCliente = async (cliente) => {
    try {
      await axios.put("/api/clientes", cliente);
    } catch (err) {
      console.error("Error editando cliente:", err);
    }
  };

  // Calcula clientes nuevos por semana y mes
  const calcularClientesNuevos = () => {
    const ahora = new Date();
    const semanaInicio = new Date(ahora);
    semanaInicio.setDate(ahora.getDate() - ahora.getDay()); // Lunes de la semana actual
    const mesInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1); // Primer día del mes actual

    const clientesNuevosSemana = clientes.filter((cliente) => {
      const fechaRegistro = new Date(cliente.fechaRegistro);
      return fechaRegistro >= semanaInicio;
    });

    const clientesNuevosMes = clientes.filter((cliente) => {
      const fechaRegistro = new Date(cliente.fechaRegistro);
      return fechaRegistro >= mesInicio;
    });

    return {
      nuevosPorSemana: clientesNuevosSemana.length,
      nuevosPorMes: clientesNuevosMes.length,
    };
  };

  return {
    clientes,
    loading,
    error,
    refetch: fetchClientes,
    eliminarCliente,
    editarCliente,
    calcularClientesNuevos, // Devuelve la cantidad de nuevos clientes por semana y mes
  };
}
