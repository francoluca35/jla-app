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

  const calcularClientesNuevos = (
    fechaInicioSemana,
    fechaFinSemana,
    fechaInicioMes,
    fechaFinMes
  ) => {
    console.log("Fecha de inicio de la semana:", fechaInicioSemana);
    console.log("Fecha de fin de la semana:", fechaFinSemana);
    console.log("Fecha de inicio del mes:", fechaInicioMes);
    console.log("Fecha de fin del mes:", fechaFinMes);

    const clientesNuevosSemana = clientes.filter((cliente) => {
      const fechaRegistro = new Date(cliente.fechaRegistro);
      console.log("Fecha de registro del cliente:", fechaRegistro);
      return (
        fechaRegistro >= fechaInicioSemana && fechaRegistro <= fechaFinSemana
      );
    });

    const clientesNuevosMes = clientes.filter((cliente) => {
      const fechaRegistro = new Date(cliente.fechaRegistro);
      console.log("Fecha de registro del cliente:", fechaRegistro);
      return fechaRegistro >= fechaInicioMes && fechaRegistro <= fechaFinMes;
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
