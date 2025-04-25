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
  useEffect(() => {
    fetchClientes();
  }, []);

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

  const getRangoDeSemana = (fecha) => {
    const inicioSemana = fecha.getDate() - fecha.getDay() + 1; // Lunes de la semana
    const finSemana = inicioSemana + 6; // Domingo de la semana
    const primerDiaSemana = new Date(fecha.setDate(inicioSemana));
    primerDiaSemana.setHours(0, 0, 0, 0); // Aseguramos que la hora sea 00:00:00
    const ultimoDiaSemana = new Date(fecha.setDate(finSemana));
    ultimoDiaSemana.setHours(23, 59, 59, 999); // Aseguramos que la hora sea 23:59:59
    return { primerDiaSemana, ultimoDiaSemana };
  };

  // Función para obtener el primer y último día del mes
  const getPrimerYUltimoDiaDelMes = (fecha) => {
    const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    primerDia.setHours(0, 0, 0, 0); // Aseguramos que la hora sea 00:00:00
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    ultimoDia.setHours(23, 59, 59, 999); // Aseguramos que la hora sea 23:59:59
    return { primerDia, ultimoDia };
  };

  // Calcular clientes nuevos
  const calcularClientesNuevos = (
    fechaInicioSemana,
    fechaFinSemana,
    fechaInicioMes,
    fechaFinMes
  ) => {
    const clientesPorSemana = clientes.filter((cliente) => {
      const fecha = new Date(cliente.date);
      return fecha >= fechaInicioSemana && fecha <= fechaFinSemana;
    });

    const clientesPorMes = clientes.filter((cliente) => {
      const fecha = new Date(cliente.date);
      return fecha >= fechaInicioMes && fecha <= fechaFinMes;
    });

    return {
      nuevosPorSemana: clientesPorSemana.length,
      nuevosPorMes: clientesPorMes.length,
    };
  };

  // Calcular los gastos e ingresos por semana y mes
  const calcularGastosEIngresos = (
    fechaInicioSemana,
    fechaFinSemana,
    fechaInicioMes,
    fechaFinMes
  ) => {
    const clientesPorSemana = clientes.filter((cliente) => {
      const fecha = new Date(cliente.date);
      return fecha >= fechaInicioSemana && fecha <= fechaFinSemana;
    });

    const clientesPorMes = clientes.filter((cliente) => {
      const fecha = new Date(cliente.date);
      return fecha >= fechaInicioMes && fecha <= fechaFinMes;
    });

    const ingresosPorSemana = clientesPorSemana.reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0
    );
    const ingresosPorMes = clientesPorMes.reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0
    );

    return { ingresosPorSemana, ingresosPorMes };
  };

  return {
    clientes,
    loading,
    error,
    eliminarCliente,
    editarCliente,
    refetch: fetchClientes,
    calcularClientesNuevos,
    calcularGastosEIngresos,
  };
}
