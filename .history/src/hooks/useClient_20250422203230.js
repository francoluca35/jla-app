import { useEffect, useState } from "react";
import axios from "axios";

export default function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener los datos de clientes
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

  // Llamada inicial para obtener los clientes
  useEffect(() => {
    fetchClientes();
  }, []);

  const calcularClientesNuevos = (
    fechaInicioSemana,
    fechaFinSemana,
    fechaInicioMes,
    fechaFinMes
  ) => {
    // Filtrar clientes por semana y mes
    const clientesPorSemana = clientes.filter((cliente) => {
      const fecha = new Date(cliente.date); // Usamos el campo 'date'
      return fecha >= fechaInicioSemana && fecha <= fechaFinSemana;
    });

    const clientesPorMes = clientes.filter((cliente) => {
      const fecha = new Date(cliente.date); // Usamos el campo 'date'
      return fecha >= fechaInicioMes && fecha <= fechaFinMes;
    });

    // Devolver la cantidad de clientes nuevos en semana y mes
    return {
      nuevosPorSemana: clientesPorSemana.length,
      nuevosPorMes: clientesPorMes.length,
    };
  };

  // Función para calcular los gastos e ingresos por semana y mes
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
    refetch: fetchClientes,
    calcularClientesNuevos,
    calcularGastosEIngresos,
  };
}
