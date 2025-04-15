"use client";
import BackArrow from "@/app/components/BackArrow";
// FormClient.jsx
import { useState, useEffect } from "react";

const FormClient = () => {
  const [date, setDate] = useState("");
  const [problemType, setProblemType] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // yyyy-mm-dd
    setDate(formattedDate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      problemType,
      paymentOption,
      amount,
      description,
      date,
    };
    console.log("Guardar cliente:", formData);
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
        className="rounded-full px-4 py-2 bg-gray-300 text-black"
        placeholder="Nombre del cliente"
        required
      />
      <label>
        Sucursal <span className="text-sm">(no requerido)</span>
      </label>
      <input
        type="text"
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

      {/* Si es PRESUPUESTO → mostrar radios + input */}
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
        className="bg-green-500 text-black font-bold rounded-full py-2"
      >
        GUARDAR
      </button>
    </form>
  );
};

export default FormClient;
