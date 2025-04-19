"use client";
import BackArrow from "@/app/components/BackArrow";
import { useState, useEffect } from "react";
import useAddClient from "@/hooks/useAddClient";
import Swal from "sweetalert2";

const FormClient = () => {
  const [date, setDate] = useState("");
  const [problemType, setProblemType] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [branch, setBranch] = useState("");
  const [totalTrabajo, setTotalTrabajo] = useState("");
  const [showList, setShowList] = useState(false);
  const [esSena, setEsSena] = useState(null);
  const [efectivo, setEfectivo] = useState("");
  const [transferencia, setTransferencia] = useState("");

  const { addClient, loading } = useAddClient();
  const [clientList, setClientList] = useState([]);

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString());

    fetch("/api/nombres")
      .then(async (res) => {
        if (!res.ok) throw new Error("Error al obtener nombres");
        return res.json();
      })
      .then((data) => setClientList(data))
      .catch((err) => {
        console.error("Error al cargar nombres:", err);
        setClientList([]);
      });
  }, []);

  const resetForm = () => {
    setProblemType("");
    setPaymentOption("");
    setPaymentMethod("");
    setAmount("");
    setTotalTrabajo("");
    setDescription("");
    setClientName("");
    setBranch("");
    setEsSena(null);
    setEfectivo("");
    setTransferencia("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let sertec = [];
    let option = "";

    if (esSena === "si") {
      option = "seña";
      if (paymentMethod === "efectivo") {
        sertec.push({ tipo: "seña efectivo", monto: parseFloat(amount) || 0 });
      } else if (paymentMethod === "transferencia") {
        sertec.push({
          tipo: "seña transferencia",
          monto: parseFloat(amount) || 0,
        });
      } else if (paymentMethod === "ambos") {
        sertec.push({
          tipo: "seña efectivo",
          monto: parseFloat(efectivo) || 0,
        });
        sertec.push({
          tipo: "seña transferencia",
          monto: parseFloat(transferencia) || 0,
        });
      }
      sertec.push({
        tipo: "totalidad del trabajo",
        monto: parseFloat(totalTrabajo) || 0,
      });
    }

    if (esSena === "no") {
      option = "pago total";
      if (paymentMethod === "ambos") {
        sertec.push({ tipo: "efectivo", monto: parseFloat(efectivo) || 0 });
        sertec.push({
          tipo: "transferencia",
          monto: parseFloat(transferencia) || 0,
        });
      }
      sertec.push({
        tipo: "pago total del trabajo",
        monto: parseFloat(totalTrabajo) || 0,
      });
    }

    const finalAmount = parseFloat(totalTrabajo) || 0;

    const formData = {
      clientName,
      branch,
      date,
      problemType,
      paymentOption: option,
      paymentMethod,
      amount: finalAmount,
      totalTrabajo: finalAmount,
      efectivo: parseFloat(efectivo) || 0,
      transferencia: parseFloat(transferencia) || 0,
      description,
      estado: "en curso",
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

        {/* Nombre Cliente */}
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
              onClick={() => setShowList((prev) => !prev)}
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

        {/* Sucursal */}
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

        {/* Fecha */}
        <label>Fecha</label>
        <input
          type="text"
          value={date}
          readOnly
          className="rounded-full text-center px-4 py-2 bg-gray-300 text-black"
        />

        {/* Tipo de problema */}
        <label>Tipo de problema</label>
        <div className="flex bg-gray-300 rounded-full p-1 justify-between">
          <button
            type="button"
            onClick={() => {
              setProblemType("arreglo");
              setPaymentMethod("");
              setEsSena(null);
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
              setEsSena(null);
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

        {/* Método de pago */}
        <label className="font-semibold">Forma de pago</label>
        <div className="flex gap-2">
          {["efectivo", "transferencia", "ambos"].map((metodo) => {
            const activo = paymentMethod === metodo;
            return (
              <button
                key={metodo}
                type="button"
                onClick={() => {
                  setPaymentMethod(metodo);
                  setEsSena(null);
                  setAmount("");
                  setEfectivo("");
                  setTransferencia("");
                }}
                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all duration-200 border ${
                  activo
                    ? "bg-green-500 text-white border-green-600 shadow-md"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
              >
                {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
              </button>
            );
          })}
        </div>

        {/* ¿Es seña? */}
        {paymentMethod && (
          <>
            <label className="font-semibold">¿Es seña?</label>
            <div className="flex gap-2">
              {["si", "no"].map((val) => {
                const activo = esSena === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setEsSena(val);
                      setAmount("");
                      setEfectivo("");
                      setTransferencia("");
                      setTotalTrabajo("");
                    }}
                    className={`flex-1 py-2 px-4 rounded-full font-medium transition-all duration-200 border ${
                      activo
                        ? "bg-green-500 text-white border-green-600 shadow-md"
                        : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {val === "si" ? "Sí" : "No"}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Campos si es SEÑA */}
        {esSena === "si" && (
          <>
            {paymentMethod === "ambos" && (
              <>
                <input
                  type="number"
                  placeholder="Seña en efectivo"
                  value={efectivo}
                  onChange={(e) => setEfectivo(e.target.value)}
                  className="rounded-full px-4 py-2 bg-gray-300 text-black"
                />
                <input
                  type="number"
                  placeholder="Seña en transferencia"
                  value={transferencia}
                  onChange={(e) => setTransferencia(e.target.value)}
                  className="rounded-full px-4 py-2 bg-gray-300 text-black"
                />
              </>
            )}
            {paymentMethod !== "ambos" && (
              <input
                type="number"
                placeholder="Monto de la seña"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-full px-4 py-2 bg-gray-300 text-black"
              />
            )}
            <input
              type="number"
              placeholder="Total del trabajo"
              value={totalTrabajo}
              onChange={(e) => setTotalTrabajo(e.target.value)}
              className="rounded-full px-4 py-2 bg-gray-300 text-black"
            />
          </>
        )}

        {/* Campos si NO es SEÑA */}
        {esSena === "no" && (
          <>
            {paymentMethod === "ambos" && (
              <>
                <input
                  type="number"
                  placeholder="Pago en efectivo"
                  value={efectivo}
                  onChange={(e) => setEfectivo(e.target.value)}
                  className="rounded-full px-4 py-2 bg-gray-300 text-black"
                />
                <input
                  type="number"
                  placeholder="Pago en transferencia"
                  value={transferencia}
                  onChange={(e) => setTransferencia(e.target.value)}
                  className="rounded-full px-4 py-2 bg-gray-300 text-black"
                />
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

        {/* Descripción */}
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
