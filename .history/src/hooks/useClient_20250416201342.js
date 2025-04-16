"use client";
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


return {
  clientes,
  loading,
  error,
  refetch: fetchClientes,
  eliminarCliente,
  editarCliente, // 👈 importante
};

