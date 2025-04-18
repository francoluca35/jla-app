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
  const [showList, setShowList] = useState(false);
  const [formaPago, setFormaPago] = useState("");
  const [efectivoMonto, setEfectivoMonto] = useState("");
  const [transferMonto, setTransferMonto] = useState("");

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
    setAmount("");
    setTotalTrabajo("");
    setDescription("");
    setClientName("");
    setBranch("");
    setFormaPago("");
    setEfectivoMonto("");
    setTransferMonto("");
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
        sertec.push({ tipo: "seña", monto: parseFloat(amount) || 0 });
        sertec.push({
          tipo: "totalidad del trabajo",
          monto: parseFloat(totalTrabajo) || 0,
        });
      } else if (paymentOption === "pago total") {
        sertec.push({ tipo: "pago total", monto: parseFloat(amount) || 0 });
      }
    }

    let formaPagoArray = [];
    if (formaPago === "efectivo") {
      formaPagoArray.push({ tipo: "efectivo", monto: parseFloat(amount) || 0 });
    } else if (formaPago === "transferencia") {
      formaPagoArray.push({
        tipo: "transferencia",
        monto: parseFloat(amount) || 0,
      });
    } else if (formaPago === "ambos") {
      formaPagoArray.push(
        { tipo: "efectivo", monto: parseFloat(efectivoMonto) || 0 },
        { tipo: "transferencia", monto: parseFloat(transferMonto) || 0 }
      );
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
      formaPago: formaPagoArray,
      estado: "en curso",
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

        <label>Tipo de trabajo</label>
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

        {problemType === "presupuesto" && (
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
              />{" "}
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
              />{" "}
              Pago Total
            </label>
          </div>
        )}

        {problemType && (
          <>
            <label>Forma de Pago</label>
            <div className="flex gap-4 bg-gray-300 rounded-full p-2 text-black">
              {["efectivo", "transferencia", "ambos"].map((tipo) => (
                <label className="flex gap-2 items-center" key={tipo}>
                  <input
                    type="radio"
                    name="formaPago"
                    value={tipo}
                    checked={formaPago === tipo}
                    onChange={() => {
                      setFormaPago(tipo);
                      setEfectivoMonto("");
                      setTransferMonto("");
                    }}
                  />{" "}
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </label>
              ))}
            </div>

            {formaPago === "efectivo" && (
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-full px-4 py-2 bg-gray-300 text-black"
                placeholder="Monto efectivo"
              />
            )}

            {formaPago === "transferencia" && (
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-full px-4 py-2 bg-gray-300 text-black"
                placeholder="Monto transferencia"
              />
            )}

            {formaPago === "ambos" && (
              <>
                <input
                  type="number"
                  value={efectivoMonto}
                  onChange={(e) => setEfectivoMonto(e.target.value)}
                  className="rounded-full px-4 py-2 bg-gray-300 text-black"
                  placeholder="Monto efectivo"
                />
                <input
                  type="number"
                  value={transferMonto}
                  onChange={(e) => setTransferMonto(e.target.value)}
                  className="rounded-full px-4 py-2 bg-gray-300 text-black"
                  placeholder="Monto transferencia"
                />
              </>
            )}

            <input
              type="number"
              placeholder="Totalidad del trabajo"
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
