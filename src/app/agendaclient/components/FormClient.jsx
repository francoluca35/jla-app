"use client";

import { useState, useEffect, useMemo } from "react";
import useAddClient from "@/hooks/useAddClient";
import Swal from "sweetalert2";
import { ArrowLeft, Plus, Trash2, Wrench, FileText } from "lucide-react";

function formatFechaLarga(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("es-AR", {
      dateStyle: "full",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function formatMoneda(n) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);
}

const UNIDADES_MATERIA_PRIMA = [
  { value: "unidad", label: "Unidad" },
  { value: "litros", label: "Litros" },
  { value: "kilos", label: "Kilos" },
];

function labelUnidadMP(value) {
  const f = UNIDADES_MATERIA_PRIMA.find((u) => u.value === value);
  return f?.label ?? "Unidad";
}

function cantidadMateriaPrima(row) {
  const c = Number(row.cantidad);
  return Number.isFinite(c) && c > 0 ? c : 1;
}

function subtotalLineaMateriaPrima(row) {
  return (Number(row.precio) || 0) * cantidadMateriaPrima(row);
}

export default function FormClient() {
  const [modo, setModo] = useState(null);
  const { addClient, loading } = useAddClient();
  const [clientList, setClientList] = useState([]);
  const [showList, setShowList] = useState(false);

  const [date, setDate] = useState("");

  const [stNombre, setStNombre] = useState("");
  const [stDireccion, setStDireccion] = useState("");
  const [stPaymentMethod, setStPaymentMethod] = useState("");
  const [stImporte, setStImporte] = useState("");
  const [stEfectivo, setStEfectivo] = useState("");
  const [stTransferencia, setStTransferencia] = useState("");
  const [stDescripcion, setStDescripcion] = useState("");

  const [prNombre, setPrNombre] = useState("");
  const [prSucursal, setPrSucursal] = useState("");
  const [prTipoFabricacion, setPrTipoFabricacion] = useState("");
  const [prMateriaItems, setPrMateriaItems] = useState([]);
  const [prMpNombre, setPrMpNombre] = useState("");
  const [prMpPrecio, setPrMpPrecio] = useState("");
  const [prMpUnidad, setPrMpUnidad] = useState("unidad");
  const [prMpCantidad, setPrMpCantidad] = useState("1");
  const [prPresupuestoFinal, setPrPresupuestoFinal] = useState("");
  const [prDejaSena, setPrDejaSena] = useState(false);
  const [prMontoSena, setPrMontoSena] = useState("");
  const [prPaymentMethod, setPrPaymentMethod] = useState("efectivo");
  const [prSenaEfectivo, setPrSenaEfectivo] = useState("");
  const [prSenaTransferencia, setPrSenaTransferencia] = useState("");
  const [prNotas, setPrNotas] = useState("");

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString());
  }, []);

  useEffect(() => {
    fetch("/api/nombres")
      .then(async (res) => {
        if (!res.ok) throw new Error("Error al obtener nombres");
        return res.json();
      })
      .then((data) => setClientList(Array.isArray(data) ? data : []))
      .catch(() => setClientList([]));
  }, []);

  const totalMateriaPrima = useMemo(
    () => prMateriaItems.reduce((acc, row) => acc + subtotalLineaMateriaPrima(row), 0),
    [prMateriaItems]
  );

  const importeAQuedar = useMemo(() => {
    const pf = Number(prPresupuestoFinal) || 0;
    return Math.max(0, pf - totalMateriaPrima);
  }, [prPresupuestoFinal, totalMateriaPrima]);

  const resetTodo = () => {
    setModo(null);
    setStNombre("");
    setStDireccion("");
    setStPaymentMethod("");
    setStImporte("");
    setStEfectivo("");
    setStTransferencia("");
    setStDescripcion("");
    setPrNombre("");
    setPrSucursal("");
    setPrTipoFabricacion("");
    setPrMateriaItems([]);
    setPrMpNombre("");
    setPrMpPrecio("");
    setPrMpUnidad("unidad");
    setPrMpCantidad("1");
    setPrPresupuestoFinal("");
    setPrDejaSena(false);
    setPrMontoSena("");
    setPrPaymentMethod("efectivo");
    setPrSenaEfectivo("");
    setPrSenaTransferencia("");
    setPrNotas("");
    setShowList(false);
    setDate(new Date().toISOString());
  };

  const agregarMateriaPrima = () => {
    const nombre = prMpNombre.trim();
    const precio = Number(prMpPrecio);
    const cantidad = Number(prMpCantidad);
    if (!nombre || !Number.isFinite(precio) || precio < 0) {
      Swal.fire({ title: "Revisá", text: "Nombre y precio válidos para la materia prima.", icon: "info" });
      return;
    }
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      Swal.fire({ title: "Revisá", text: "Ingresá una cantidad mayor a cero.", icon: "info" });
      return;
    }
    setPrMateriaItems((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length}`,
        nombre,
        precio,
        cantidad,
        unidad: prMpUnidad,
      },
    ]);
    setPrMpNombre("");
    setPrMpPrecio("");
    setPrMpCantidad("1");
  };

  const quitarMateriaPrima = (id) => {
    setPrMateriaItems((prev) => prev.filter((x) => x.id !== id));
  };

  function buildSertecServicioTecnico() {
    const total = Number(stImporte) || 0;
    const sertec = [];
    if (stPaymentMethod === "ambos") {
      sertec.push({ tipo: "efectivo", monto: Number(stEfectivo) || 0 });
      sertec.push({ tipo: "transferencia", monto: Number(stTransferencia) || 0 });
    }
    sertec.push({ tipo: "pago total del trabajo", monto: total });
    return { sertec, option: "pago total", finalAmount: total };
  }

  function buildSertecPresupuesto() {
    const totalTrabajo = Number(prPresupuestoFinal) || 0;
    const sertec = [];
    let option = "";

    if (prDejaSena) {
      option = "seña";
      if (prPaymentMethod === "efectivo") {
        sertec.push({ tipo: "seña efectivo", monto: Number(prMontoSena) || 0 });
      } else if (prPaymentMethod === "transferencia") {
        sertec.push({ tipo: "seña transferencia", monto: Number(prMontoSena) || 0 });
      } else {
        sertec.push({ tipo: "seña efectivo", monto: Number(prSenaEfectivo) || 0 });
        sertec.push({ tipo: "seña transferencia", monto: Number(prSenaTransferencia) || 0 });
      }
      sertec.push({ tipo: "totalidad del trabajo", monto: totalTrabajo });
    } else {
      option = "pago total";
      sertec.push({ tipo: "pago total del trabajo", monto: totalTrabajo });
    }

    return { sertec, option, finalAmount: totalTrabajo };
  }

  const handleSubmitServicio = async (e) => {
    e.preventDefault();
    if (!stNombre.trim() || !stDireccion.trim() || !stPaymentMethod) {
      Swal.fire({ title: "Faltan datos", text: "Completá nombre, dirección y forma de pago.", icon: "warning" });
      return;
    }
    const total = Number(stImporte);
    if (!Number.isFinite(total) || total <= 0) {
      Swal.fire({ title: "Importe", text: "Ingresá un importe del servicio válido.", icon: "warning" });
      return;
    }
    if (stPaymentMethod === "ambos") {
      const ef = Number(stEfectivo) || 0;
      const tr = Number(stTransferencia) || 0;
      if (ef + tr <= 0) {
        Swal.fire({ title: "Montos", text: "Completá efectivo y/o transferencia.", icon: "warning" });
        return;
      }
    }

    const { sertec, option, finalAmount } = buildSertecServicioTecnico();
    const desc = [stDescripcion.trim(), stDireccion.trim() ? `Dirección: ${stDireccion.trim()}` : ""]
      .filter(Boolean)
      .join("\n");

    const body = {
      clientName: stNombre.trim(),
      branch: "",
      direccion: stDireccion.trim(),
      date,
      problemType: "arreglo",
      paymentOption: option,
      paymentMethod: stPaymentMethod,
      amount: finalAmount,
      totalTrabajo: finalAmount,
      efectivo: stPaymentMethod === "ambos" ? Number(stEfectivo) || 0 : 0,
      transferencia: stPaymentMethod === "ambos" ? Number(stTransferencia) || 0 : 0,
      description: desc || stDescripcion.trim(),
      estado: "terminado",
      fechaTerminado: new Date().toISOString().split("T")[0],
      sertec,
    };

    const resultado = await addClient(body);
    if (resultado?.success) {
      Swal.fire({ title: "Guardado", text: "Servicio técnico registrado.", icon: "success" }).then(resetTodo);
    } else {
      Swal.fire({ title: "Error", text: resultado?.error || "No se pudo guardar.", icon: "error" });
    }
  };

  const handleSubmitPresupuesto = async (e) => {
    e.preventDefault();
    if (!prNombre.trim() || !prTipoFabricacion.trim()) {
      Swal.fire({ title: "Faltan datos", text: "Nombre del cliente y tipo de fabricación son obligatorios.", icon: "warning" });
      return;
    }
    const pf = Number(prPresupuestoFinal);
    if (!Number.isFinite(pf) || pf <= 0) {
      Swal.fire({ title: "Presupuesto", text: "Ingresá el presupuesto final.", icon: "warning" });
      return;
    }
    if (prDejaSena) {
      if (prPaymentMethod === "ambos") {
        const a = Number(prSenaEfectivo) || 0;
        const b = Number(prSenaTransferencia) || 0;
        if (a + b <= 0) {
          Swal.fire({ title: "Seña", text: "Completá monto de seña en efectivo y/o transferencia.", icon: "warning" });
          return;
        }
      } else {
        const ms = Number(prMontoSena);
        if (!Number.isFinite(ms) || ms <= 0) {
          Swal.fire({ title: "Seña", text: "Ingresá cuánto deja el cliente de seña.", icon: "warning" });
          return;
        }
      }
    }

    const { sertec, option, finalAmount } = buildSertecPresupuesto();
    const materiaItemsClean = prMateriaItems.map(({ nombre, precio, unidad, cantidad }) => {
      const c = Number(cantidad);
      const cantOk = Number.isFinite(c) && c > 0 ? c : 1;
      return {
        nombre,
        precio: Number(precio) || 0,
        cantidad: cantOk,
        unidad: unidad && ["unidad", "litros", "kilos"].includes(unidad) ? unidad : "unidad",
      };
    });
    const desc = [prTipoFabricacion.trim(), prNotas.trim()].filter(Boolean).join("\n\n");

    const body = {
      clientName: prNombre.trim(),
      branch: prSucursal.trim(),
      tipoFabricacion: prTipoFabricacion.trim(),
      materiaPrimaDetalle: materiaItemsClean,
      date,
      problemType: "presupuesto",
      paymentOption: option,
      paymentMethod: prDejaSena ? prPaymentMethod : prPaymentMethod,
      amount: finalAmount,
      totalTrabajo: finalAmount,
      efectivo: prDejaSena && prPaymentMethod === "ambos" ? Number(prSenaEfectivo) || 0 : prDejaSena && prPaymentMethod === "efectivo" ? Number(prMontoSena) || 0 : 0,
      transferencia:
        prDejaSena && prPaymentMethod === "ambos"
          ? Number(prSenaTransferencia) || 0
          : prDejaSena && prPaymentMethod === "transferencia"
          ? Number(prMontoSena) || 0
          : 0,
      description: desc,
      estado: "en curso",
      sertec,
      presupuestoGanancia: {
        totalPresupuesto: finalAmount,
        totalMateriaPrima: totalMateriaPrima,
        gananciaNeta: importeAQuedar,
        materiaPrimaEstado: "calculado",
        modalidadPago: prDejaSena ? "seña" : "pago_total",
        itemsMateriaPrima: materiaItemsClean,
      },
    };

    const resultado = await addClient(body);
    if (resultado?.success) {
      Swal.fire({ title: "Guardado", text: "Presupuesto registrado.", icon: "success" }).then(resetTodo);
    } else {
      Swal.fire({ title: "Error", text: resultado?.error || "No se pudo guardar.", icon: "error" });
    }
  };

  const shell =
    "min-h-[calc(100vh-5.5rem)] w-full max-w-5xl mx-auto flex flex-col text-black";

  if (modo === null) {
    return (
      <div className={shell}>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-black">Agenda de clientes</h1>
          <p className="text-gray-500 mt-1 text-sm">Elegí qué querés registrar</p>
        </header>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <button
            type="button"
            onClick={() => {
              setShowList(false);
              setModo("servicio");
            }}
            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-10 shadow-sm transition-all hover:border-verdefluor hover:shadow-md text-left text-black"
          >
            <div className="rounded-2xl bg-blue-100 p-5 group-hover:bg-verdefluor transition-colors">
              <Wrench className="w-12 h-12 shrink-0 text-blue-800 group-hover:text-black" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Servicio técnico</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Cliente, dirección, forma de pago e importe del trabajo en sitio.
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowList(false);
              setModo("presupuesto");
            }}
            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-10 shadow-sm transition-all hover:border-verdefluor hover:shadow-md text-left text-black"
          >
            <div className="rounded-2xl bg-yellow-100 p-5 group-hover:bg-verdefluor transition-colors">
              <FileText className="w-12 h-12 shrink-0 text-yellow-900 group-hover:text-black" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Presupuesto</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Fabricación, materia prima, presupuesto final, margen y seña opcional.
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (modo === "servicio") {
    return (
      <div className={shell}>
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setModo(null)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 text-gray-800" strokeWidth={2.25} />
            Volver
          </button>
        </div>
        <h1 className="text-2xl font-bold text-black mb-1">Servicio técnico</h1>
        <p className="text-gray-500 text-sm mb-6">Completá los datos del trabajo</p>

        <form
          onSubmit={handleSubmitServicio}
          className="flex-1 flex flex-col gap-5 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Nombre del cliente</span>
              <div className="relative mt-1">
                <div className="flex items-center gap-2 w-full rounded-xl border border-gray-300 bg-white px-2">
                  <input
                    value={stNombre}
                    onChange={(e) => setStNombre(e.target.value)}
                    required
                    className="flex-1 bg-transparent px-2 py-3 text-black outline-none"
                    placeholder="Nombre o razón social"
                  />
                  <button
                    type="button"
                    onClick={() => setShowList((v) => !v)}
                    className="inline-flex items-center justify-center min-w-[56px] h-8 text-xs text-gray-500 hover:text-gray-800 px-2 rounded-lg border border-gray-200 bg-white"
                  >
                    {showList ? "Cerrar" : "Lista"}
                  </button>
                </div>
                {showList && clientList.length > 0 && (
                  <ul className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg text-sm">
                    {clientList.map((name, i) => (
                      <li
                        key={i}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-50"
                        onClick={() => {
                          setStNombre(name);
                          setShowList(false);
                        }}
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Dirección</span>
              <input
                value={stDireccion}
                onChange={(e) => setStDireccion(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-black"
                placeholder="Calle, número, localidad"
              />
            </label>

            <div className="md:col-span-2 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha actual</span>
              <p className="text-black font-medium mt-1">{formatFechaLarga(date)}</p>
            </div>

            <div className="md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Forma de pago</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {["efectivo", "transferencia", "ambos"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setStPaymentMethod(m);
                      setStEfectivo("");
                      setStTransferencia("");
                    }}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium border transition-colors ${
                      stPaymentMethod === m
                        ? "bg-verdefluor text-black border-verdefluor"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {stPaymentMethod === "ambos" && (
              <>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Efectivo</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={stEfectivo}
                    onChange={(e) => setStEfectivo(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Transferencia</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={stTransferencia}
                    onChange={(e) => setStTransferencia(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </label>
              </>
            )}

            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Importe del servicio</span>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={stImporte}
                onChange={(e) => setStImporte(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-black"
                placeholder="0"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Descripción del trabajo</span>
              <textarea
                value={stDescripcion}
                onChange={(e) => setStDescripcion(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-black resize-y min-h-[120px]"
                placeholder="Detalle del servicio realizado o a realizar"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading || !stPaymentMethod}
              className="bg-verdefluor hover:bg-verdefluort text-black font-semibold px-8 py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? "Guardando…" : "Guardar servicio técnico"}
            </button>
            <button type="button" onClick={() => setModo(null)} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={shell}>
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setModo(null)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5 shrink-0 text-gray-800" strokeWidth={2.25} />
          Volver
        </button>
      </div>
      <h1 className="text-2xl font-bold text-black mb-1">Presupuesto</h1>
      <p className="text-gray-500 text-sm mb-6">Materia prima, totales y seña</p>

      <form
        onSubmit={handleSubmitPresupuesto}
        className="flex-1 flex flex-col gap-6 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm"
      >
        <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha actual</span>
          <p className="text-black font-medium mt-1">{formatFechaLarga(date)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Nombre del cliente</span>
            <div className="relative mt-1">
              <div className="flex items-center gap-2 w-full rounded-xl border border-gray-300 bg-white px-2">
                <input
                  value={prNombre}
                  onChange={(e) => setPrNombre(e.target.value)}
                  required
                  className="flex-1 bg-transparent px-2 py-3 outline-none"
                  placeholder="Cliente"
                />
                <button
                  type="button"
                  onClick={() => setShowList((v) => !v)}
                  className="inline-flex items-center justify-center min-w-[56px] h-8 text-xs text-gray-500 hover:text-gray-800 px-2 rounded-lg border border-gray-200 bg-white"
                >
                  {showList ? "Cerrar" : "Lista"}
                </button>
              </div>
              {showList && clientList.length > 0 && (
                <ul className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg text-sm">
                  {clientList.map((name, i) => (
                    <li
                      key={i}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-50"
                      onClick={() => {
                        setPrNombre(name);
                        setShowList(false);
                      }}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Sucursal</span>
            <span className="text-gray-400 text-xs ml-1">(opcional)</span>
            <input
              value={prSucursal}
              onChange={(e) => setPrSucursal(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Sucursal"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Tipo de fabricación</span>
            <input
              value={prTipoFabricacion}
              onChange={(e) => setPrTipoFabricacion(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Ej. mesada inox, vitrina, etc."
            />
          </label>
        </div>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
          <h3 className="text-sm font-semibold text-black mb-3">Gastos — materia prima</h3>
          {prMateriaItems.length > 0 && (
            <ul className="space-y-2 mb-4">
              {prMateriaItems.map((row) => {
                const q = cantidadMateriaPrima(row);
                const sub = subtotalLineaMateriaPrima(row);
                return (
                <li
                  key={row.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm"
                >
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-gray-800 font-medium truncate">{row.nombre}</span>
                      <span className="text-xs text-gray-600 tabular-nums font-medium">
                        Cant.: {q}
                      </span>
                      <span className="text-xs font-medium text-gray-600 shrink-0 bg-gray-100 px-2 py-0.5 rounded-md w-fit">
                        {labelUnidadMP(row.unidad)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 tabular-nums">
                      {formatMoneda(row.precio)} c/u → {formatMoneda(sub)}
                    </span>
                  </div>
                  <span className="tabular-nums text-black font-semibold">{formatMoneda(sub)}</span>
                  <button
                    type="button"
                    onClick={() => quitarMateriaPrima(row.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                    aria-label="Quitar"
                  >
                    <Trash2 className="w-4 h-4 shrink-0 text-red-600" strokeWidth={2} />
                  </button>
                </li>
              );
              })}
            </ul>
          )}
          <div className="flex flex-col lg:flex-row gap-2 lg:items-end flex-wrap">
            <label className="flex-1 min-w-[140px] block">
              <span className="text-xs text-gray-600">Ítem</span>
              <input
                value={prMpNombre}
                onChange={(e) => setPrMpNombre(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-black"
                placeholder="Ej. acero inox"
              />
            </label>
            <label className="w-full sm:w-28 block">
              <span className="text-xs text-gray-600">Cantidad</span>
              <input
                type="number"
                inputMode="decimal"
                min="0.0001"
                step="any"
                value={prMpCantidad}
                onChange={(e) => setPrMpCantidad(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-black tabular-nums"
                placeholder="1"
              />
            </label>
            <label className="w-full sm:w-40 block">
              <span className="text-xs text-gray-600">Unidad</span>
              <select
                value={prMpUnidad}
                onChange={(e) => setPrMpUnidad(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-black bg-white"
              >
                {UNIDADES_MATERIA_PRIMA.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="w-full sm:w-36 block">
              <span className="text-xs text-gray-600">Precio c/u</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={prMpPrecio}
                onChange={(e) => setPrMpPrecio(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-black"
                placeholder="0"
              />
            </label>
            <button
              type="button"
              onClick={agregarMateriaPrima}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-verdefluor text-black border border-gray-300 px-4 py-2.5 text-sm font-semibold hover:bg-verdefluort"
            >
              <Plus className="w-4 h-4 shrink-0 text-black" strokeWidth={2.25} />
              Agregar
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-700">
            Total materia prima: <strong className="tabular-nums">{formatMoneda(totalMateriaPrima)}</strong>
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Presupuesto final</span>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={prPresupuestoFinal}
              onChange={(e) => setPrPresupuestoFinal(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Total cotizado al cliente"
            />
          </label>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 flex flex-col justify-center">
            <span className="text-xs font-medium text-emerald-800 uppercase tracking-wide">Importe a quedar</span>
            <p className="text-xl font-bold text-emerald-900 tabular-nums mt-1">{formatMoneda(importeAQuedar)}</p>
            <p className="text-xs text-emerald-700 mt-1">Presupuesto final − gastos de materia prima</p>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-gray-200 p-4 hover:bg-gray-50/80">
          <input
            type="checkbox"
            checked={prDejaSena}
            onChange={(e) => {
              setPrDejaSena(e.target.checked);
              if (!e.target.checked) {
                setPrMontoSena("");
                setPrSenaEfectivo("");
                setPrSenaTransferencia("");
              }
            }}
            className="mt-1 rounded border-gray-300 accent-verdefluor"
          />
          <div>
            <span className="font-medium text-black">Deja seña</span>
            <p className="text-sm text-gray-500 mt-0.5">Marcá si el cliente abona una seña ahora.</p>
          </div>
        </label>

        {prDejaSena && (
          <div className="rounded-xl border border-gray-200 p-5 space-y-4 bg-gray-50/50">
            <span className="text-sm font-medium text-gray-700">Cómo abona la seña</span>
            <div className="flex flex-wrap gap-2">
              {["efectivo", "transferencia", "ambos"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPrPaymentMethod(m)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium border ${
                    prPaymentMethod === m
                      ? "bg-verdefluor text-black border-verdefluor"
                      : "border-gray-300 text-gray-700 bg-white"
                  }`}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
            {prPaymentMethod === "ambos" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-gray-600">Seña efectivo</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={prSenaEfectivo}
                    onChange={(e) => setPrSenaEfectivo(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-600">Seña transferencia</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={prSenaTransferencia}
                    onChange={(e) => setPrSenaTransferencia(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5"
                  />
                </label>
              </div>
            ) : (
              <label className="block max-w-sm">
                <span className="text-sm font-medium text-gray-700">Cuánto deja de seña</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={prMontoSena}
                  onChange={(e) => setPrMontoSena(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
                  placeholder="Monto"
                />
              </label>
            )}
          </div>
        )}

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Notas adicionales</span>
          <span className="text-gray-400 text-xs ml-1">(opcional)</span>
          <textarea
            value={prNotas}
            onChange={(e) => setPrNotas(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 resize-y"
            placeholder="Observaciones"
          />
        </label>

        <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-verdefluor hover:bg-verdefluort text-black font-semibold px-8 py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? "Guardando…" : "Guardar presupuesto"}
          </button>
          <button type="button" onClick={() => setModo(null)} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
