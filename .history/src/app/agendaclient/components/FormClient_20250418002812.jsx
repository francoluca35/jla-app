"use client";
import BackArrow from "@/app/components/BackArrow";
import { useState, useEffect } from "react";
import useAddClient from "@/hooks/useAddClient";
import Swal from "sweetalert2";

const FormClient = () => {
  const [date, setDate] = useState("");
  const [problemType, setProblemType] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [esSena, setEsSena] = useState(null);
  const [montoSena, setMontoSena] = useState("");
  const [montoTotal, setMontoTotal] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [branch, setBranch] = useState("");
  const [showList, setShowList] = useState(false);
  const { addClient, loading } = useAddClient();
  const [clientList, setClientList] = useState([]);

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
    setFormaPago("");
    setEsSena(null);
    setMontoSena("");
    setMontoTotal("");
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
        monto: parseFloat(montoSena) || 0,
      });
      sertec.push({
        tipo: "pago total del trabajo",
        monto: parseFloat(montoTotal) || 0,
      });
    } else if (problemType === "presupuesto") {
      if (esSena === "si") {
        sertec.push({ tipo: "seña", monto: parseFloat(montoSena) || 0 });
        sertec.push({
          tipo: "totalidad del trabajo",
          monto: parseFloat(montoTotal) || 0,
        });
      } else if (esSena === "no") {
        sertec.push({
          tipo: "totalidad del trabajo",
          monto: parseFloat(montoTotal) || 0,
        });
      }
    }

    const formData = {
      clientName,
      branch,
      date,
      problemType,
      formaPago,
      esSena,
      amount: parseFloat(montoSena) || 0,
      totalTrabajo: parseFloat(montoTotal) || 0,
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
      }).then(resetForm);
    } else {
      Swal.fire({
        title: "Error",
        text: resultado?.error || "Hubo un problema",
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
              onClick={() => setShowList((prev) => !prev)}
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
              <ul className="divide-y divide-gray-200">
                {clientList.map((name, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setClientName(name);
                      setShowList(false);
                    }}
                    className="cursor-pointer px-4 py-2 hover:bg-green-100 text-black"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <label>Sucursal (opcional)</label>
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
              resetForm();
              setProblemType("arreglo");
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
              resetForm();
              setProblemType("presupuesto");
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
            <select
              value={formaPago}
              onChange={(e) => setFormaPago(e.target.value)}
              className="rounded-full px-4 py-2 bg-gray-300 text-black"
            >
              <option value="">Seleccionar</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="ambos">Ambos</option>
            </select>

            {problemType === "presupuesto" && formaPago && (
              <>
                <label>¿Es seña?</label>
                <select
                  value={esSena || ""}
                  onChange={(e) => setEsSena(e.target.value)}
                  className="rounded-full px-4 py-2 bg-gray-300 text-black"
                >
                  <option value="">Seleccionar</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </>
            )}

            {(problemType === "arreglo" ||
              (problemType === "presupuesto" && esSena === "si")) && (
              <input
                type="number"
                placeholder={
                  problemType === "arreglo"
                    ? "% del total abonado"
                    : "Monto de la seña"
                }
                value={montoSena}
                onChange={(e) => setMontoSena(e.target.value)}
                className="rounded-full px-4 py-2 bg-gray-300 text-black"
              />
            )}

            {(problemType === "arreglo" ||
              esSena === "si" ||
              esSena === "no") && (
              <input
                type="number"
                placeholder="Totalidad del trabajo"
                value={montoTotal}
                onChange={(e) => setMontoTotal(e.target.value)}
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
          placeholder="Descripción"
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
