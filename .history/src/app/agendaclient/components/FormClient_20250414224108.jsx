"use client";
import BackArrow from "@/app/components/BackArrow";
import { useState, useEffect } from "react";
import useAddClient from "@/hooks/useAddClient";
import Swal from "sweetalert2"; // Importar SweetAlert2

const FormClient = () => {
  const [date, setDate] = useState("");
  const [problemType, setProblemType] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [branch, setBranch] = useState("");

  const { addClient, loading, error, success } = useAddClient();

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString()); // Fecha correcta para Mongo
  }, []);

  const resetForm = () => {
    setProblemType("");
    setPaymentOption("");
    setAmount("");
    setDescription("");
    setClientName("");
    setBranch("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let sertec = [];

    if (problemType === "arreglo") {
      sertec.push({ tipo: "arreglo", monto: parseFloat(amount) || 0 });
    } else if (problemType === "presupuesto" && paymentOption) {
      sertec.push({ tipo: paymentOption, monto: parseFloat(amount) || 0 });
    }

    const formData = {
      clientName,
      branch,
      date,
      problemType,
      paymentOption,
      amount: parseFloat(amount) || 0,
      description,
      sertec,
    };

    await addClient(formData);

    if (success) {
      // Mostrar alerta moderna
      Swal.fire({
        title: "¡Éxito!",
        text: "Cliente guardado con éxito.",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        resetForm(); // Limpiar el formulario después de que el usuario presione "Aceptar"
      });
    } else {
      // En caso de error
      Swal.fire({
        title: "Error",
        text: error || "Hubo un problema al guardar el cliente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1f1f22] text-white p-4 flex flex-col gap-4 w-full max-w-md mx-auto rounded-md"
    >
      <BackArrow />
      <h2 className="text-center text-2xl font-bold">Cliente Nuevo</h2>

      <label>Nombre cliente</label>
      <input
        type="text"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="rounded-full px-4 py-2 bg-gray-300 text-black"
        placeholder="Nombre del cliente"
        required
      />

      <label>
        Sucursal <span className="text-sm">(no requerido)</span>
      </label>
      <input
        type="text"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        className="rounded-full px-4 py-2 bg-gray-300 text-black"
        placeholder="Sucursal"
      />

      <label>Fecha</label>
      <input
        type="text"
        value={date}
        readOnly
        className="rounded-full text-center px-4 py-2 bg-gray-300 text-black"
      />

      <label>Tipo de problema</label>
      <div className="flex bg-gray-300 rounded-full p-1 justify-between">
        <button
          type="button"
          onClick={() => {
            setProblemType("arreglo");
            setPaymentOption("pago total");
            setAmount("");
          }}
          className={`px-4 py-2 rounded-full w-1/2 ${
            problemType === "arreglo" ? "bg-green-500 text-black" : "text-black"
          }`}
        >
          Arreglo
        </button>
        <button
          type="button"
          onClick={() => {
            setProblemType("presupuesto");
            setPaymentOption("");
            setAmount("");
          }}
          className={`px-4 py-2 rounded-full w-1/2 ${
            problemType === "presupuesto"
              ? "bg-green-500 text-black"
              : "text-black"
          }`}
        >
          Presupuesto
        </button>
      </div>

      {problemType === "arreglo" && (
        <input
          type="number"
          placeholder="Pago total"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-full px-4 py-2 bg-gray-300 text-black"
        />
      )}

      {problemType === "presupuesto" && (
        <>
          <div className="bg-gray-300 text-black p-2 rounded-md flex gap-4 justify-around">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pago"
                checked={paymentOption === "seña"}
                onChange={() => setPaymentOption("seña")}
              />
              Seña
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pago"
                checked={paymentOption === "pago total"}
                onChange={() => setPaymentOption("pago total")}
              />
              Pago Total
            </label>
          </div>

          {paymentOption && (
            <input
              type="number"
              placeholder={`Monto - ${
                paymentOption === "seña" ? "Seña" : "Pago Total"
              }`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-full px-4 py-2 bg-gray-300 text-black"
            />
          )}
        </>
      )}

      <label>Descripción</label>
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="rounded-lg px-4 py-2 bg-gray-300 text-black min-h-[100px]"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-black font-bold rounded-full py-2"
      >
        {loading ? "Guardando..." : "GUARDAR"}
      </button>
    </form>
  );
};

export default FormClient;
