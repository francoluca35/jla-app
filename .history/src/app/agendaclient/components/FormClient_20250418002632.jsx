"use client";
import BackArrow from "@/app/components/BackArrow";
import { useState, useEffect } from "react";
import useAddClient from "@/hooks/useAddClient";
import Swal from "sweetalert2";

const FormClient = () => {
  const [date, setDate] = useState("");
  const [problemType, setProblemType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(""); // efectivo, transferencia o ambos
  const [isSena, setIsSena] = useState(""); // sí o no
  const [amount, setAmount] = useState("");
  const [totalTrabajo, setTotalTrabajo] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [branch, setBranch] = useState("");
  const [showList, setShowList] = useState(false);
  const [clientList, setClientList] = useState([]);

  const { addClient, loading } = useAddClient();

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString());
    fetch("/api/nombres")
      .then((res) => res.json())
      .then((data) => setClientList(data))
      .catch(() => setClientList([]));
  }, []);

  const resetForm = () => {
    setProblemType("");
    setPaymentMethod("");
    setIsSena("");
    setAmount("");
    setTotalTrabajo("");
    setDescription("");
    setClientName("");
    setBranch("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let sertec = [];

    if (paymentMethod) {
      if (isSena === "sí") {
        sertec.push({
          tipo: "seña",
          forma: paymentMethod,
          monto: parseFloat(amount) || 0,
        });
        sertec.push({
          tipo: "totalidad del trabajo",
          forma: paymentMethod,
          monto: parseFloat(totalTrabajo) || 0,
        });
      } else {
        sertec.push({
          tipo: "pago total",
          forma: paymentMethod,
          monto: parseFloat(totalTrabajo) || 0,
        });
      }
    }

    const formData = {
      clientName,
      branch,
      date,
      problemType,
      paymentMethod,
      isSena,
      description,
      estado: "en curso", // ✅ nuevo campo
      sertec,
    };

    const resultado = await addClient(formData);

    if (resultado?.success) {
      Swal.fire({
        title: "¡Éxito!",
        text: "Cliente guardado con éxito.",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(resetForm);
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
        <div className="relative">
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="rounded-full px-4 py-2 bg-gray-300 text-black w-full"
            placeholder="Escribí o seleccioná un cliente existente"
            required
          />
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={() => setShowList(!showList)}
              className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 ${
                showList
                  ? "bg-red-100 text-red-600 border-red-400 hover:bg-red-200"
                  : "bg-blue-100 text-blue-600 border-blue-400 hover:bg-blue-200"
              }`}
            >
              {showList ? "Ocultar clientes" : "Ver lista de clientes"}
            </button>
          </div>
          {showList && clientList.length > 0 && (
            <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-xl w-full max-h-40 overflow-y-auto shadow-lg">
              <p className="text-sm font-semibold p-2 text-gray-600 bg-gray-100 rounded-t-xl">
                Clientes guardados:
              </p>
              <ul className="divide-y divide-gray-200">
                {clientList.map((name, i) => (
                  <li
                    key={i}
                    className="cursor-pointer px-4 py-2 hover:bg-green-100 transition text-black"
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
          placeholder="Sucursal"
        />

        <label>Fecha</label>
        <input
          type="text"
          value={date}
          readOnly
          className="rounded-full text-center px-4 py-2 bg-gray-300 text-black"
        />

        <label>Forma de pago</label>
        <div className="flex justify-between gap-2">
          {["efectivo", "transferencia", "ambos"].map((forma) => (
            <label key={forma} className="flex-1">
              <input
                type="radio"
                name="forma"
                checked={paymentMethod === forma}
                onChange={() => {
                  setPaymentMethod(forma);
                  setIsSena("");
                  setAmount("");
                  setTotalTrabajo("");
                }}
              />
              <span className="ml-2 capitalize">{forma}</span>
            </label>
          ))}
        </div>

        {paymentMethod && (
          <>
            <label>¿Es seña?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="sena"
                  checked={isSena === "sí"}
                  onChange={() => {
                    setIsSena("sí");
                    setAmount("");
                    setTotalTrabajo("");
                  }}
                />
                Sí
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="sena"
                  checked={isSena === "no"}
                  onChange={() => {
                    setIsSena("no");
                    setAmount("");
                    setTotalTrabajo("");
                  }}
                />
                No
              </label>
            </div>

            {isSena === "sí" && (
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

            {isSena === "no" && (
              <input
                type="number"
                placeholder="Totalidad del trabajo"
                value={totalTrabajo}
                onChange={(e) => setTotalTrabajo(e.target.value)}
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
