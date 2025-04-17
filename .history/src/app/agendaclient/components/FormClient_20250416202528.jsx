"use client";
import BackArrow from "@/app/components/BackArrow";
import { useState, useEffect } from "react";
import useAddClient from "@/hooks/useAddClient";
import Swal from "sweetalert2";

const FormClient = () => {
  const [date, setDate] = useState("");
  const [problemType, setProblemType] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [branch, setBranch] = useState("");
  const [totalTrabajo, setTotalTrabajo] = useState("");

  const { addClient, loading } = useAddClient();

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString());
  }, []);

  const resetForm = () => {
    setProblemType("");
    setPaymentOption("");
    setAmount("");
    setTotalTrabajo("");
    setDescription("");
    setClientName("");
    setBranch("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let sertec = [];

    if (problemType === "arreglo") {
      sertec.push({
        tipo: "% del total abonado",
        monto: parseFloat(amount) || 0,
      });
      sertec.push({
        tipo: "pago total del trabajo",
        monto: parseFloat(totalTrabajo) || 0,
      });
    } else if (problemType === "presupuesto") {
      if (paymentOption === "seña") {
        sertec.push({
          tipo: "seña",
          monto: parseFloat(amount) || 0,
        });
        sertec.push({
          tipo: "totalidad del trabajo",
          monto: parseFloat(totalTrabajo) || 0,
        });
      } else if (paymentOption === "pago total") {
        sertec.push({
          tipo: "pago total",
          monto: parseFloat(amount) || 0,
        });
      }
    }

    const formData = {
      clientName,
      branch,
      date,
      problemType,
      paymentOption,
      amount: parseFloat(amount) || 0,
      totalTrabajo: parseFloat(totalTrabajo) || 0,
      description,
      sertec,
    };

    const resultado = await addClient(formData);

    if (resultado?.success) {
      Swal.fire({
        title: "¡Éxito!",
        text: "Cliente guardado con éxito.",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        resetForm();
      });
    } else {
      Swal.fire({
        title: "Error",
        text: resultado?.error || "Hubo un problema al guardar el cliente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div
      className="min-h-screen p-6 text-white"
      style={{
        backgroundImage: "url('/Assets/formclient.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-black bg-opacity-70 p-6 flex flex-col gap-4 w-full max-w-md mx-auto rounded-xl"
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
          Sucursal <span className="text-sm">(opcional)</span>
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
              setPaymentOption("");
              setAmount("");
              setTotalTrabajo("");
            }}
            className={`px-4 py-2 rounded-full w-1/2 ${
              problemType === "arreglo"
                ? "bg-green-500 text-black"
                : "text-black"
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
              setTotalTrabajo("");
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
          <>
            <input
              type="number"
              placeholder="% del total abonado"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-full px-4 py-2 bg-gray-300 text-black"
            />
            <input
              type="number"
              placeholder="Pago total del trabajo"
              value={totalTrabajo}
              onChange={(e) => setTotalTrabajo(e.target.value)}
              className="rounded-full px-4 py-2 bg-gray-300 text-black"
            />
          </>
        )}

        {problemType === "presupuesto" && (
          <>
            <div className="bg-gray-300 text-black p-2 rounded-md flex gap-4 justify-around">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pago"
                  checked={paymentOption === "seña"}
                  onChange={() => {
                    setPaymentOption("seña");
                    setAmount("");
                    setTotalTrabajo("");
                  }}
                />
                Seña
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pago"
                  checked={paymentOption === "pago total"}
                  onChange={() => {
                    setPaymentOption("pago total");
                    setAmount("");
                    setTotalTrabajo("");
                  }}
                />
                Pago Total
              </label>
            </div>

            {paymentOption === "seña" && (
              <>
                <input
                  type="number"
                  placeholder="Monto de la seña"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-full px-4 py-2 bg-gray-300 text-black"
                />
                <input
                  type="number"
                  placeholder="Totalidad del trabajo"
                  value={totalTrabajo}
                  onChange={(e) => setTotalTrabajo(e.target.value)}
                  className="rounded-full px-4 py-2 bg-gray-300 text-black"
                />
              </>
            )}

            {paymentOption === "pago total" && (
              <input
                type="number"
                placeholder="Monto total del trabajo"
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
          className="bg-verdefluor hover:bg-verdefluort text-black font-bold rounded-full py-2"
        >
          {loading ? "Guardando..." : "GUARDAR"}
        </button>
      </form>
    </div>
  );
};

export default FormClient;
