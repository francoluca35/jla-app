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
  const [montoEfectivo, setMontoEfectivo] = useState("");
  const [montoTransferencia, setMontoTransferencia] = useState("");
  const [totalTrabajo, setTotalTrabajo] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [branch, setBranch] = useState("");
  const [showList, setShowList] = useState(false);
  const [clientList, setClientList] = useState([]);

  const { addClient, loading } = useAddClient();

  useEffect(() => {
    setDate(new Date().toISOString());
    fetch("/api/nombres")
      .then((res) => res.json())
      .then((data) => setClientList(data))
      .catch(() => setClientList([]));
  }, []);

  const resetForm = () => {
    setProblemType("");
    setPaymentMethod("");
    setIsSena(null);
    setMontoEfectivo("");
    setMontoTransferencia("");
    setTotalTrabajo("");
    setDescription("");
    setClientName("");
    setBranch("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let sertec = [];
    if (isSena === "si") {
      if (paymentMethod === "efectivo") {
        sertec.push({
          tipo: "seña efectivo",
          monto: parseFloat(montoEfectivo),
        });
      } else if (paymentMethod === "transferencia") {
        sertec.push({
          tipo: "seña transferencia",
          monto: parseFloat(montoTransferencia),
        });
      } else if (paymentMethod === "ambos") {
        sertec.push({
          tipo: "seña efectivo",
          monto: parseFloat(montoEfectivo),
        });
        sertec.push({
          tipo: "seña transferencia",
          monto: parseFloat(montoTransferencia),
        });
      }
    }

    sertec.push({
      tipo: "pago total del trabajo",
      monto: parseFloat(totalTrabajo),
    });

    const formData = {
      clientName,
      branch,
      date,
      problemType,
      paymentMethod,
      isSena,
      montoEfectivo: parseFloat(montoEfectivo) || 0,
      montoTransferencia: parseFloat(montoTransferencia) || 0,
      totalTrabajo: parseFloat(totalTrabajo) || 0,
      description,
      estado: "en curso",
      sertec,
    };

    const resultado = await addClient(formData);
    if (resultado?.success) {
      Swal.fire("¡Éxito!", "Cliente guardado con éxito.", "success").then(
        resetForm
      );
    } else {
      Swal.fire("Error", resultado?.error || "Hubo un problema.", "error");
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
        <div className="relative">
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="rounded-full px-4 py-2 bg-gray-300 text-black w-full"
            required
          />
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={() => setShowList(!showList)}
              className={`px-3 py-1 text-sm rounded-full border ${
                showList
                  ? "bg-red-100 text-red-600 border-red-400"
                  : "bg-blue-100 text-blue-600 border-blue-400"
              }`}
            >
              {showList ? "Ocultar clientes" : "Ver lista de clientes"}
            </button>
          </div>
          {showList && clientList.length > 0 && (
            <div className="absolute z-10 mt-2 bg-white border rounded-xl w-full max-h-40 overflow-y-auto shadow-lg">
              <ul className="divide-y">
                {clientList.map((name, i) => (
                  <li
                    key={i}
                    className="cursor-pointer px-4 py-2 hover:bg-green-100 text-black"
                    onClick={() => {
                      setClientName(name);
                      setShowList(false);
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <label>
          Sucursal <span className="text-sm">(opcional)</span>
        </label>
        <input
          type="text"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="rounded-full px-4 py-2 bg-gray-300 text-black"
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
              setPaymentMethod("");
              setIsSena(null);
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
              setPaymentMethod("");
              setIsSena(null);
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

        {(problemType === "arreglo" || problemType === "presupuesto") && (
          <>
            <label>Forma de pago</label>
            <div className="text-black bg-gray-100 p-2 rounded flex gap-4">
              {["efectivo", "transferencia", "ambos"].map((opt) => (
                <label key={opt} className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="formaPago"
                    value={opt}
                    checked={paymentMethod === opt}
                    onChange={() => {
                      setPaymentMethod(opt);
                      setIsSena(null);
                    }}
                  />{" "}
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </label>
              ))}
            </div>

            <label>¿Es seña?</label>
            <div className="text-black bg-gray-100 p-2 rounded flex gap-4">
              {["si", "no"].map((opt) => (
                <label key={opt} className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="sena"
                    value={opt}
                    checked={isSena === opt}
                    onChange={() => setIsSena(opt)}
                  />{" "}
                  {opt === "si" ? "Sí" : "No"}
                </label>
              ))}
            </div>

            {isSena === "si" && (
              <>
                {(paymentMethod === "efectivo" ||
                  paymentMethod === "ambos") && (
                  <input
                    type="number"
                    placeholder="Monto en efectivo"
                    value={montoEfectivo}
                    onChange={(e) => setMontoEfectivo(e.target.value)}
                    className="rounded-full px-4 py-2 bg-gray-300 text-black"
                  />
                )}
                {(paymentMethod === "transferencia" ||
                  paymentMethod === "ambos") && (
                  <input
                    type="number"
                    placeholder="Monto en transferencia"
                    value={montoTransferencia}
                    onChange={(e) => setMontoTransferencia(e.target.value)}
                    className="rounded-full px-4 py-2 bg-gray-300 text-black"
                  />
                )}
              </>
            )}

            <input
              type="number"
              placeholder="Pago total del trabajo"
              value={totalTrabajo}
              onChange={(e) => setTotalTrabajo(e.target.value)}
              className="rounded-full px-4 py-2 bg-gray-300 text-black"
            />
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
