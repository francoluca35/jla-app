"use client";
import BackArrow from "@/app/components/BackArrow";
import { useState, useEffect } from "react";
import useAddClient from "@/hooks/useAddClient";
import Swal from "sweetalert2";

const FormClient = () => {
  const [date, setDate] = useState("");
  const [problemType, setProblemType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSena, setIsSena] = useState(null);
  const [amount, setAmount] = useState("");
  const [totalTrabajo, setTotalTrabajo] = useState("");
  const [efectivo, setEfectivo] = useState("");
  const [transferencia, setTransferencia] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [branch, setBranch] = useState("");
  const [estado] = useState("en curso");

  const { addClient, loading } = useAddClient();

  useEffect(() => {
    setDate(new Date().toISOString());
  }, []);

  const resetForm = () => {
    setProblemType("");
    setPaymentMethod("");
    setIsSena(null);
    setAmount("");
    setTotalTrabajo("");
    setEfectivo("");
    setTransferencia("");
    setDescription("");
    setClientName("");
    setBranch("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pagos = [];
    if (paymentMethod === "efectivo") {
      pagos.push({ forma: "efectivo", monto: parseFloat(amount) || 0 });
    } else if (paymentMethod === "transferencia") {
      pagos.push({ forma: "transferencia", monto: parseFloat(amount) || 0 });
    } else if (paymentMethod === "ambos") {
      if (isSena) {
        pagos.push({ forma: "efectivo", monto: parseFloat(efectivo) || 0 });
        pagos.push({
          forma: "transferencia",
          monto: parseFloat(transferencia) || 0,
        });
        pagos.push({ forma: "total", monto: parseFloat(totalTrabajo) || 0 });
      } else {
        pagos.push({ forma: "efectivo", monto: parseFloat(efectivo) || 0 });
        pagos.push({
          forma: "transferencia",
          monto: parseFloat(transferencia) || 0,
        });
        pagos.push({ forma: "total", monto: parseFloat(totalTrabajo) || 0 });
      }
    }

    const formData = {
      clientName,
      branch,
      date,
      problemType,
      paymentMethod,
      isSena,
      estado,
      pagos,
      description,
    };

    const resultado = await addClient(formData);
    if (resultado?.success) {
      Swal.fire({ title: "¡Guardado!", icon: "success" });
      resetForm();
    } else {
      Swal.fire({ title: "Error", text: resultado?.error, icon: "error" });
    }
  };

  return (
    <div
      className="min-h-screen p-6 text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/Assets/formclient.png')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-black bg-opacity-70 p-6 rounded-xl max-w-md mx-auto space-y-4"
      >
        <BackArrow />
        <h2 className="text-2xl font-bold text-center">Cliente Nuevo</h2>

        <input
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Nombre cliente"
          className="w-full rounded-full px-4 py-2 bg-gray-300 text-black"
          required
        />

        <input
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          placeholder="Sucursal (opcional)"
          className="w-full rounded-full px-4 py-2 bg-gray-300 text-black"
        />

        <input
          value={date}
          readOnly
          className="w-full rounded-full px-4 py-2 bg-gray-300 text-black text-center"
        />

        <div className="flex rounded-full bg-gray-300 overflow-hidden">
          <button
            type="button"
            onClick={() => setProblemType("arreglo")}
            className={`w-1/2 py-2 ${
              problemType === "arreglo"
                ? "bg-green-500 text-black"
                : "text-black"
            }`}
          >
            Arreglo
          </button>
          <button
            type="button"
            onClick={() => setProblemType("presupuesto")}
            className={`w-1/2 py-2 ${
              problemType === "presupuesto"
                ? "bg-green-500 text-black"
                : "text-black"
            }`}
          >
            Presupuesto
          </button>
        </div>

        <div className="space-y-2">
          <p className="font-semibold">Forma de pago</p>
          <label>
            <input
              type="radio"
              name="forma"
              onChange={() => setPaymentMethod("efectivo")}
            />{" "}
            Efectivo
          </label>
          <label>
            <input
              type="radio"
              name="forma"
              onChange={() => setPaymentMethod("transferencia")}
            />{" "}
            Transferencia
          </label>
          <label>
            <input
              type="radio"
              name="forma"
              onChange={() => setPaymentMethod("ambos")}
            />{" "}
            Ambos
          </label>
        </div>

        {(paymentMethod === "ambos" || paymentMethod) && (
          <div className="space-y-2">
            <p className="font-semibold">¿Es seña?</p>
            <label>
              <input
                type="radio"
                name="sena"
                onChange={() => setIsSena(true)}
              />{" "}
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="sena"
                onChange={() => setIsSena(false)}
              />{" "}
              No
            </label>
          </div>
        )}

        {paymentMethod === "ambos" && !isSena && (
          <>
            <input
              placeholder="Pago en efectivo"
              value={efectivo}
              onChange={(e) => setEfectivo(e.target.value)}
              className="w-full rounded-full px-4 py-2 bg-gray-300 text-black"
            />
            <input
              placeholder="Pago transferencia"
              value={transferencia}
              onChange={(e) => setTransferencia(e.target.value)}
              className="w-full rounded-full px-4 py-2 bg-gray-300 text-black"
            />
            <input
              placeholder="Pago total del trabajo"
              value={totalTrabajo}
              onChange={(e) => setTotalTrabajo(e.target.value)}
              className="w-full rounded-full px-4 py-2 bg-gray-300 text-black"
            />
          </>
        )}

        {(paymentMethod === "efectivo" ||
          paymentMethod === "transferencia") && (
          <input
            placeholder="Monto total del trabajo"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-full px-4 py-2 bg-gray-300 text-black"
          />
        )}

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
          className="w-full rounded-lg px-4 py-2 bg-gray-300 text-black min-h-[100px]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-verdefluor hover:bg-verdefluort text-black font-bold rounded-full py-2"
        >
          {loading ? "Guardando..." : "GUARDAR"}
        </button>
      </form>
    </div>
  );
};

export default FormClient;
