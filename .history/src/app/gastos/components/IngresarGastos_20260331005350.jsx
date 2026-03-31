"use client";
import React, { useState } from "react";
import useAddGasto from "@/hooks/useAddGasto";
import clsx from "clsx";
import { ArrowLeft, Boxes, ReceiptText, Wallet } from "lucide-react";

const UNIDADES = ["kg", "unidad", "litros"];
const METODOS_PAGO = ["efectivo", "transferencia", "debito", "credito"];

const createItem = () => ({
  material: "",
  cantidad: "",
  unidad: "kg",
  precio: "",
});

const getTodayDateInput = () => new Date().toISOString().split("T")[0];

const IngresarGastos = () => {
  const [tipo, setTipo] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: "",
    lugar: "",
    precio: "",
  });
  const [empleado, setEmpleado] = useState("");
  const [diasDeTrabajo, setDiasDeTrabajo] = useState([]);
  const [tiposDePago, setTiposDePago] = useState([]);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [fechaCompra, setFechaCompra] = useState(getTodayDateInput());
  const [compraVaria, setCompraVaria] = useState(false);
  const [itemsCompra, setItemsCompra] = useState([createItem()]);

  const { addGasto, loading, error, success } = useAddGasto();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleDiaTrabajo = (dia) => {
    setDiasDeTrabajo((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const toggleTipoDePago = (tipoPago) => {
    setTiposDePago((prev) =>
      prev.includes(tipoPago)
        ? prev.filter((item) => item !== tipoPago)
        : [...prev, tipoPago]
    );
  };

  const updateItem = (index, field, value) => {
    setItemsCompra((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItemRow = () => {
    setItemsCompra((prev) => [...prev, createItem()]);
  };

  const removeItemRow = (index) => {
    setItemsCompra((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const resetCompraForm = () => {
    setFormData({ descripcion: "", lugar: "", precio: "" });
    setMetodoPago("efectivo");
    setFechaCompra(getTodayDateInput());
    setCompraVaria(false);
    setItemsCompra([createItem()]);
  };

  const totalEncargado = itemsCompra.reduce((acc, item) => {
    const cantidad = Number(item.cantidad) || 0;
    const precio = Number(item.precio) || 0;
    return acc + cantidad * precio;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let gasto;

    if (tipo === "sueldos") {
      gasto = {
        tipo,
        empleado,
        diasDeTrabajo,
        tipodepago: tiposDePago,
        precio: parseFloat(formData.precio),
        fecha: new Date(),
      };
    } else {
      const compraItems = compraVaria ? itemsCompra : [itemsCompra[0]];
      const itemsLimpios = compraItems
        .map((item) => ({
          material: item.material.trim(),
          cantidad: Number(item.cantidad),
          unidad: item.unidad,
          precio: Number(item.precio),
          subtotal: (Number(item.cantidad) || 0) * (Number(item.precio) || 0),
        }))
        .filter((item) => item.material && item.cantidad > 0 && item.precio > 0);

      if (itemsLimpios.length === 0) return;

      const total = itemsLimpios.reduce((acc, item) => acc + item.subtotal, 0);
      const etiquetaTipo = tipo === "stockear" ? "Stockear" : "Gastos Varios";

      gasto = {
        tipo,
        descripcion:
          formData.descripcion.trim() ||
          `${etiquetaTipo} - ${compraVaria ? "Compra varia" : itemsLimpios[0].material}`,
        lugar: formData.lugar.trim(),
        compraVaria,
        items: itemsLimpios,
        metodoPago,
        tipodepago: [metodoPago],
        precio: total,
        totalEncargado: total,
        totalPagado: total,
        fechaCompra,
        fecha: new Date(fechaCompra),
      };
    }

    await addGasto(gasto);

    if (!error) {
      if (tipo === "sueldos") {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        resetCompraForm();
      }
    }
  };

  const titleByTipo = (value) => {
    if (value === "stockear") return "Stockear";
    if (value === "gastoVario") return "Gastos Varios";
    return "Sueldo";
  };

  const subtitleByTipo = (value) => {
    if (value === "stockear") return "Carga materiales para stock con fecha y metodo de pago.";
    if (value === "gastoVario") return "Registra compras varias con los mismos datos de stock.";
    return "Registra pagos de sueldos del personal.";
  };

  if (tipo === null) {
    return (
      <div className="min-h-[calc(100vh-5.5rem)] w-full max-w-5xl mx-auto flex flex-col text-black">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-black">Ingreso de Gastos</h1>
          <p className="text-gray-500 mt-1 text-sm">Elegi que tipo de gasto queres registrar</p>
        </header>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <button
            type="button"
            onClick={() => setTipo("stockear")}
            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-verdefluor hover:shadow-md text-left text-black"
          >
            <div className="rounded-2xl bg-blue-100 p-5 group-hover:bg-verdefluor transition-colors">
              <Boxes className="w-12 h-12 shrink-0 text-blue-800 group-hover:text-black" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Stockear</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Materiales, cantidades por unidad, fecha de compra y total.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTipo("gastoVario")}
            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-verdefluor hover:shadow-md text-left text-black"
          >
            <div className="rounded-2xl bg-amber-100 p-5 group-hover:bg-verdefluor transition-colors">
              <ReceiptText className="w-12 h-12 shrink-0 text-amber-800 group-hover:text-black" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Gastos Varios</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Carga gastos de compra con modalidad simple o compra varia.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTipo("sueldos")}
            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-verdefluor hover:shadow-md text-left text-black"
          >
            <div className="rounded-2xl bg-emerald-100 p-5 group-hover:bg-verdefluor transition-colors">
              <Wallet className="w-12 h-12 shrink-0 text-emerald-800 group-hover:text-black" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Sueldo</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Registra pago a empleados con dias trabajados y forma de pago.
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5.5rem)] w-full max-w-5xl mx-auto flex flex-col text-black">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setTipo(null)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5 shrink-0 text-gray-800" strokeWidth={2.25} />
          Volver
        </button>
      </div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-black">{titleByTipo(tipo)}</h1>
        <p className="text-gray-500 mt-1 text-sm">{subtitleByTipo(tipo)}</p>
      </header>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tipo === "sueldos" ? (
            <>
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Empleado</span>
                <input
                  type="text"
                  value={empleado}
                  onChange={(e) => setEmpleado(e.target.value)}
                  required
                  placeholder="Nombre del empleado"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
              </label>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Dias de trabajo</p>
                <div className="flex flex-wrap gap-2">
                  {["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"].map((dia) => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => toggleDiaTrabajo(dia)}
                      className={clsx(
                        "px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                        diasDeTrabajo.includes(dia)
                          ? "bg-verdefluor text-black border-verdefluor"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Forma de pago</p>
                <div className="flex flex-wrap gap-2">
                  {["efectivo", "transferencia"].map((tipoPago) => (
                    <label
                      key={tipoPago}
                      className={clsx(
                        "cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                        tiposDePago.includes(tipoPago)
                          ? "bg-verdefluor text-black border-verdefluor"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={tiposDePago.includes(tipoPago)}
                        onChange={() => toggleTipoDePago(tipoPago)}
                        className="hidden"
                      />
                      {tipoPago.charAt(0).toUpperCase() + tipoPago.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Importe a pagar</span>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  placeholder="Monto en pesos"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
              </label>
            </>
          ) : (
            <>
              <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={compraVaria}
                  onChange={(e) => setCompraVaria(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Compra varia
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Lugar de compra</span>
                <input
                  type="text"
                  name="lugar"
                  value={formData.lugar}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
              </label>

              <div className="space-y-3">
                {(compraVaria ? itemsCompra : [itemsCompra[0]]).map((item, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-700">Material {index + 1}</p>
                      {compraVaria && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(index)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Material"
                      value={item.material}
                      onChange={(e) => updateItem(index, "material", e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Cantidad"
                        value={item.cantidad}
                        onChange={(e) => updateItem(index, "cantidad", e.target.value)}
                        required
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                      />
                      <select
                        value={item.unidad}
                        onChange={(e) => updateItem(index, "unidad", e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                      >
                        {UNIDADES.map((unidad) => (
                          <option key={unidad} value={unidad}>
                            {unidad}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Precio unitario"
                        value={item.precio}
                        onChange={(e) => updateItem(index, "precio", e.target.value)}
                        required
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                      />
                    </div>
                  </div>
                ))}
                {compraVaria && (
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
                  >
                    + Agregar material
                  </button>
                )}
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Fecha de compra</span>
                <input
                  type="date"
                  value={fechaCompra}
                  onChange={(e) => setFechaCompra(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Metodo de pago</span>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                >
                  {METODOS_PAGO.map((metodo) => (
                    <option key={metodo} value={metodo}>
                      {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Descripcion del gasto</span>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  placeholder={
                    tipo === "stockear"
                      ? "Ej: Compra para armado de equipos."
                      : "Ej: Compra eventual para mantenimiento, limpieza, etc."
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 resize-y min-h-[90px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si lo dejas vacio, se completa automaticamente con el tipo de gasto y material.
                </p>
              </label>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 space-y-1">
                <p>
                  Total encargado: <strong>${totalEncargado.toFixed(2)}</strong>
                </p>
                <p>
                  Total pagado ({metodoPago}): <strong>${totalEncargado.toFixed(2)}</strong>
                </p>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-verdefluor hover:bg-verdefluort text-black font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70"
          >
            {loading
              ? "Guardando..."
              : tipo === "stockear"
                ? "Anadir gasto de stock"
                : tipo === "gastoVario"
                  ? "Anadir gasto vario"
                  : "Guardar gasto"}
          </button>

          {success && (
            <p className="text-sm font-medium text-green-600">Gasto guardado correctamente.</p>
          )}
          {error && <p className="text-sm text-red-600">Error: {error}</p>}
        </form>
      </div>
    </div>
  );
};

export default IngresarGastos;
