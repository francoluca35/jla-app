"use client";
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

    const esArreglo = problemType === "arreglo";

    if (esArreglo) {
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
    } else if (esSena === "si") {
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
    } else if (esSena === "no") {
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
      ...(problemType === "presupuesto" && esSena === "si"
        ? {
            presupuestoGanancia: {
              totalPresupuesto: finalAmount,
              materiaPrimaEstado: "pendiente",
              gananciaNeta: null,
              totalMateriaPrima: null,
            },
          }
        : {}),
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
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agenda de Clientes</h1>
        <p className="text-gray-500 mt-1 text-sm">Cargar nuevo cliente o presupuesto</p>
      </header>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-4"
      >
        <label className="text-sm font-medium text-gray-700">Nombre del cliente</label>
        <div className="relative">
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-verdefluor focus:border-verdefluor"
            placeholder="Escribí o seleccioná un cliente existente"
            required
          />
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setShowList((prev) => !prev)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {showList ? "Ocultar lista" : "Ver lista de clientes"}
            </button>
          </div>
          {showList && clientList.length > 0 && (
            <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg w-full max-h-40 overflow-y-auto shadow-lg">
              <p className="text-xs font-medium text-gray-500 p-2 bg-gray-50 border-b border-gray-100">
                Clientes guardados
              </p>
              <ul className="divide-y divide-gray-100">
                {clientList.map((name, i) => (
                  <li
                    key={i}
                    className="cursor-pointer px-4 py-2.5 text-gray-800 hover:bg-gray-50 text-sm"
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

        <label className="text-sm font-medium text-gray-700">
          Sucursal <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-verdefluor focus:border-verdefluor"
          placeholder="Sucursal"
        />

        <label className="text-sm font-medium text-gray-700">Fecha</label>
        <input
          type="text"
          value={date}
          readOnly
          className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-700 text-center"
        />

        <label className="text-sm font-medium text-gray-700">Tipo de problema</label>
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          {["arreglo", "presupuesto"].map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => {
                setProblemType(tipo);
                setPaymentMethod("");
                setEsSena(null);
              }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                problemType === tipo
                  ? "bg-verdefluor text-black"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tipo === "arreglo" ? "S. tecnico" : "Presupuesto"}
            </button>
          ))}
        </div>

        <label className="text-sm font-medium text-gray-700">Forma de pago</label>
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
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                  activo
                    ? "bg-verdefluor text-black border-verdefluor"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
              </button>
            );
          })}
        </div>

        {paymentMethod && problemType === "presupuesto" && (
          <>
            <label className="text-sm font-medium text-gray-700">¿Es seña?</label>
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
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                      activo
                        ? "bg-verdefluor text-black border-verdefluor"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {val === "si" ? "Sí" : "No"}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {problemType === "arreglo" && paymentMethod && (
          <>
            {paymentMethod === "ambos" && (
              <>
                <input
                  type="number"
                  placeholder="Pago en efectivo"
                  value={efectivo}
                  onChange={(e) => setEfectivo(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
                <input
                  type="number"
                  placeholder="Pago en transferencia"
                  value={transferencia}
                  onChange={(e) => setTransferencia(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
              </>
            )}
            <input
              type="number"
              placeholder="Pago total del trabajo"
              value={totalTrabajo}
              onChange={(e) => setTotalTrabajo(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
            />
          </>
        )}

        {esSena === "si" && problemType === "presupuesto" && (
          <>
            {paymentMethod === "ambos" && (
              <>
                <input
                  type="number"
                  placeholder="Seña en efectivo"
                  value={efectivo}
                  onChange={(e) => setEfectivo(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
                <input
                  type="number"
                  placeholder="Seña en transferencia"
                  value={transferencia}
                  onChange={(e) => setTransferencia(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
              </>
            )}
            {paymentMethod !== "ambos" && (
              <input
                type="number"
                placeholder="Monto de la seña"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
              />
            )}
            <input
              type="number"
              placeholder="Total del trabajo"
              value={totalTrabajo}
              onChange={(e) => setTotalTrabajo(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
            />
          </>
        )}

        {esSena === "no" && problemType === "presupuesto" && (
          <>
            {paymentMethod === "ambos" && (
              <>
                <input
                  type="number"
                  placeholder="Pago en efectivo"
                  value={efectivo}
                  onChange={(e) => setEfectivo(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
                <input
                  type="number"
                  placeholder="Pago en transferencia"
                  value={transferencia}
                  onChange={(e) => setTransferencia(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
              </>
            )}
            <input
              type="number"
              placeholder="Pago total del trabajo"
              value={totalTrabajo}
              onChange={(e) => setTotalTrabajo(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
            />
          </>
        )}

        <label className="text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          placeholder="Descripción del trabajo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 min-h-[100px] placeholder-gray-400 focus:ring-2 focus:ring-verdefluor focus:border-verdefluor"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-verdefluor hover:bg-verdefluort text-black font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
};

export default FormClient;
