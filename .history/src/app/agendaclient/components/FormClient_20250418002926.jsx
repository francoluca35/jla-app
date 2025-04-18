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
    setIsSena(null);
    setAmount("");
    setTotalTrabajo("");
    setDescription("");
    setClientName("");
    setBranch("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sertec = [];
    if (isSena === "si") {
      sertec.push({ tipo: "seña", monto: parseFloat(amount) || 0 });
      sertec.push({
        tipo: "totalidad del trabajo",
        monto: parseFloat(totalTrabajo) || 0,
      });
    } else {
      sertec.push({
        tipo: "pago total del trabajo",
        monto: parseFloat(totalTrabajo) || 0,
      });
    }

    const formData = {
      clientName,
      branch,
      date,
      problemType,
      paymentMethod,
      amount: parseFloat(amount) || 0,
      totalTrabajo: parseFloat(totalTrabajo) || 0,
      description,
      sertec,
      estado: "en curso",
    };

    const resultado = await addClient(formData);

    if (resultado?.success) {
      Swal.fire({
        title: "¡Éxito!",
        text: "Cliente guardado con éxito.",
        icon: "success",
      }).then(() => resetForm());
    } else {
      Swal.fire({
        title: "Error",
        text: resultado?.error || "Hubo un problema al guardar.",
        icon: "error",
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
            required
          />
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={() => setShowList(!showList)}
              className={`px-3 py-1 text-sm rounded-full border ${
                showList
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
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
              setPaymentMethod("");
              setIsSena(null);
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

        <label>Forma de pago</label>
        <div className="flex gap-2">
          {["efectivo", "transferencia", "ambos"].map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="formaPago"
                checked={paymentMethod === opt}
                onChange={() => setPaymentMethod(opt)}
              />
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </label>
          ))}
        </div>

        {paymentMethod && (
          <div>
            <label>¿Es seña?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="isSena"
                  value="si"
                  checked={isSena === "si"}
                  onChange={() => setIsSena("si")}
                />{" "}
                Sí
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="isSena"
                  value="no"
                  checked={isSena === "no"}
                  onChange={() => setIsSena("no")}
                />{" "}
                No
              </label>
            </div>
          </div>
        )}

        {paymentMethod && isSena && (
          <>
            {isSena === "si" && (
              <>
                <input
                  type="number"
                  placeholder="Seña"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-full px-4 py-2 bg-gray-300 text-black"
                />
                <input
                  type="number"
                  placeholder="Total del trabajo"
                  value={totalTrabajo}
                  onChange={(e) => setTotalTrabajo(e.target.value)}
                  className="rounded-full px-4 py-2 bg-gray-300 text-black"
                />
              </>
            )}
            {isSena === "no" && (
              <input
                type="number"
                placeholder="Total del trabajo"
                value={totalTrabajo}
                onChange={(e) => setTotalTrabajo(e.target.value)}
                className="rounded-full px-4 py-2 bg-gray-300 text-black"
              />
            )}
          </>
        )}

        <label>Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg px-4 py-2 bg-gray-300 text-black min-h-[100px]"
          placeholder="Describa el trabajo..."
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
