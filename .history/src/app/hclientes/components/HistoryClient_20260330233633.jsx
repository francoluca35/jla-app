"use client";

import React, { useState, useMemo } from "react";
import useClientes from "@/hooks/useClient";
import Swal from "sweetalert2";
import {
  Activity,
  Banknote,
  Building2,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Factory,
  FileText,
  LayoutGrid,
  Loader2,
  MapPin,
  Minus,
  Package,
  PackageOpen,
  Pencil,
  Receipt,
  Save,
  Trash2,
  User,
  Wallet,
  Wrench,
  X,
} from "lucide-react";

function formatMoneda(n) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);
}

function labelUnidadMP(value) {
  const map = { unidad: "Unidad", litros: "Litros", kilos: "Kilos" };
  return map[value] ?? "Unidad";
}

function cantidadItemMP(item) {
  const c = Number(item.cantidad);
  return Number.isFinite(c) && c > 0 ? c : 1;
}

function subtotalItemMP(item) {
  return (Number(item.precio) || 0) * cantidadItemMP(item);
}

function presupuestoTotalCliente(c) {
  return Number(c.totalTrabajo ?? c.amount ?? 0) || 0;
}

function itemsMateriaPrima(c) {
  const a = c.materiaPrimaDetalle;
  const b = c.presupuestoGanancia?.itemsMateriaPrima;
  if (Array.isArray(a) && a.length) return a;
  if (Array.isArray(b) && b.length) return b;
  return [];
}

function totalMateriaPrimaCliente(c) {
  const stored = c.presupuestoGanancia?.totalMateriaPrima;
  if (stored != null && Number.isFinite(Number(stored))) return Number(stored) || 0;
  return itemsMateriaPrima(c).reduce((acc, it) => acc + subtotalItemMP(it), 0);
}

function importeNetoPresupuesto(c) {
  const g = c.presupuestoGanancia?.gananciaNeta;
  if (g != null && Number.isFinite(Number(g))) return Number(g) || 0;
  return Math.max(0, presupuestoTotalCliente(c) - totalMateriaPrimaCliente(c));
}

function tieneMateriaPrima(c) {
  if (c.problemType !== "presupuesto") return false;
  return itemsMateriaPrima(c).length > 0;
}

function labelQueSeFabrica(c) {
  if (c.problemType === "arreglo") return "Servicio técnico";
  const tf = (c.tipoFabricacion || "").trim();
  if (tf) return tf;
  const first = (c.description || "").trim().split("\n")[0];
  return first || "—";
}

function formatFechaCorta(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toISOString().slice(0, 10).split("-").reverse().join("/");
  } catch {
    return String(iso).slice(0, 10);
  }
}

function celdaFechaTabla(c) {
  if (c.problemType === "presupuesto" && c.estado === "terminado") {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="line-through text-black opacity-50 text-xs tabular-nums">{formatFechaCorta(c.date)}</span>
        <span className="font-semibold text-black text-sm tabular-nums flex items-center gap-1">
          <CalendarCheck className="w-3.5 h-3.5 text-black shrink-0" strokeWidth={2} />
          {c.fechaTerminado ? c.fechaTerminado.split("-").reverse().join("/") : "—"}
        </span>
      </div>
    );
  }
  return (
    <span className="tabular-nums text-black flex items-center gap-1.5">
      <Calendar className="w-3.5 h-3.5 text-black shrink-0" strokeWidth={2} />
      {formatFechaCorta(c.date)}
    </span>
  );
}

function estadoLabel(c) {
  if (c.problemType === "arreglo" || c.estado === "terminado") return "Terminado";
  return "En curso";
}

function DetailSection({ icon: Icon, title, children, accent = "slate" }) {
  const ring =
    accent === "emerald"
      ? "text-black bg-emerald-50 border-emerald-100"
      : accent === "violet"
      ? "text-black bg-violet-50 border-violet-100"
      : accent === "amber"
      ? "text-black bg-amber-50 border-amber-100"
      : "text-black bg-slate-50 border-slate-200";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/80">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${ring}`}
        >
          <Icon className="w-5 h-5" strokeWidth={2} />
        </span>
        <h3 className="text-sm font-semibold text-black tracking-tight">{title}</h3>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, className = "" }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <span className="mt-0.5 text-black shrink-0">
        <Icon className="w-4 h-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-black uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-black mt-0.5 break-words">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export default function HistoryClient() {
  const { clientes, loading, error, refetch, eliminarCliente, editarCliente } = useClientes();

  const [filter, setFilter] = useState("Todos");
  const [detailClient, setDetailClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(null);

  const detailId = detailClient?._id != null ? String(detailClient._id) : null;

  const filteredClientes = useMemo(() => {
    if (filter === "Todos") return clientes;
    return clientes.filter((c) =>
      filter === "Servicio T." ? c.problemType === "arreglo" : c.problemType !== "arreglo"
    );
  }, [clientes, filter]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-black">
        <Loader2 className="w-10 h-10 animate-spin text-verdefluor" strokeWidth={2} />
        <p className="text-sm font-medium">Cargando historial…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-black text-sm font-medium">
        No se pudieron cargar los datos. Intentá de nuevo más tarde.
      </div>
    );
  }

  const toggleDetalle = (c) => {
    const id = c._id != null ? String(c._id) : null;
    if (id && id === detailId) {
      setDetailClient(null);
      setIsEditing(false);
      setEditedClient(null);
    } else {
      setDetailClient(c);
      setIsEditing(false);
      setEditedClient(null);
    }
  };

  const cerrarDetalle = () => {
    setDetailClient(null);
    setIsEditing(false);
    setEditedClient(null);
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al cliente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      await eliminarCliente(id);
      cerrarDetalle();
      refetch();
    }
  };

  const handleGuardarCambios = async () => {
    await editarCliente(editedClient);
    setIsEditing(false);
    setDetailClient(null);
    setEditedClient(null);
    refetch();
  };

  const anularServicio = async (index) => {
    const confirm = await Swal.fire({
      title: `¿Cancelar ${detailClient.sertec[index]?.tipo}?`,
      text: "Esta acción marcará el servicio como anulado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, mantener",
    });

    if (!confirm.isConfirmed) return;

    const actualizado = {
      ...detailClient,
      sertec: detailClient.sertec.map((item, idx) =>
        idx === index ? { ...item, anulada: true } : item
      ),
    };

    await editarCliente({
      ...detailClient,
      estado: "terminado",
      fechaTerminado: new Date().toISOString().split("T")[0],
    });

    setDetailClient(actualizado);
    refetch();
  };

  const montoPendientePagar = (c) => {
    const amount = Number(c.amount) || 0;
    const senaTr = c.sertec?.find((s) => s.tipo === "seña transferencia")?.monto;
    const tr = Number(senaTr) || 0;
    return amount - tr;
  };

  const renderDetalleCompleto = () => {
    const c = isEditing ? editedClient : detailClient;
    if (!c) return null;

    const esPresupuesto = c.problemType === "presupuesto";
    const esArreglo = c.problemType === "arreglo";
    const itemsMP = itemsMateriaPrima(c);
    const totalMP = totalMateriaPrimaCliente(c);
    const totalPresu = presupuestoTotalCliente(c);
    const neto = importeNetoPresupuesto(c);

    return (
      <div className="space-y-4 sm:space-y-5">
        <DetailSection icon={User} title="Cliente" accent="slate">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoItem icon={User} label="Nombre" value={c.clientName} />
            <InfoItem icon={Building2} label="Sucursal" value={c.branch?.trim() || "—"} />
            <InfoItem icon={Calendar} label="Fecha de registro" value={formatFechaCorta(c.date)} />
            {c.fechaTerminado && (
              <InfoItem
                icon={CalendarCheck}
                label="Fecha terminado"
                value={c.fechaTerminado.split("-").reverse().join("/")}
              />
            )}
            {c.direccion && (
              <InfoItem icon={MapPin} label="Dirección" value={c.direccion} className="sm:col-span-2" />
            )}
            <InfoItem icon={Activity} label="Estado" value={c.estado || "—"} />
          </div>
        </DetailSection>

        {esArreglo && (
          <DetailSection icon={Wrench} title="Servicio técnico" accent="violet">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-black uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5" strokeWidth={2} />
                  Trabajo / descripción
                </p>
                <p className="text-sm text-black whitespace-pre-wrap rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 leading-relaxed">
                  {c.description?.trim() || "—"}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem icon={CreditCard} label="Forma de pago" value={c.paymentOption || "—"} />
                <InfoItem icon={Wallet} label="Método de pago" value={c.paymentMethod || "—"} />
                <InfoItem icon={Banknote} label="Efectivo" value={formatMoneda(c.efectivo)} />
                <InfoItem icon={Receipt} label="Transferencia" value={formatMoneda(c.transferencia)} />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-violet-50 border border-violet-100 px-4 py-3">
                <span className="text-sm font-medium text-black flex items-center gap-2">
                  <CircleDollarSign className="w-4 h-4 text-black shrink-0" strokeWidth={2} />
                  Importe total
                </span>
                <span className="text-lg font-bold text-black tabular-nums">
                  {formatMoneda(c.totalTrabajo ?? c.amount)}
                </span>
              </div>
            </div>
          </DetailSection>
        )}

        {esPresupuesto && (
          <DetailSection icon={Factory} title="Presupuesto y trabajo" accent="emerald">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-black uppercase tracking-wide mb-2">
                  Tipo de fabricación
                </p>
                <p className="text-sm font-medium text-black rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                  {(c.tipoFabricacion || "").trim() || "—"}
                </p>
              </div>
              {(c.description || "").trim() && (
                <div>
                  <p className="text-xs font-medium text-black uppercase tracking-wide mb-2">
                    Notas
                  </p>
                  <p className="text-sm text-black whitespace-pre-wrap rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 leading-relaxed">
                    {c.description.trim()}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4">
                  <div className="flex items-center gap-2 text-black mb-1">
                    <FileText className="w-4 h-4" strokeWidth={2} />
                    <span className="text-xs font-semibold uppercase tracking-wide">Presupuesto total</span>
                  </div>
                  <p className="text-2xl font-bold text-black tabular-nums tracking-tight">
                    {formatMoneda(totalPresu)}
                  </p>
                  <p className="text-xs text-black mt-1">Cotizado al cliente</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                  <div className="flex items-center gap-2 text-black mb-1">
                    <Minus className="w-4 h-4" strokeWidth={2} />
                    <span className="text-xs font-semibold uppercase tracking-wide">Neto (sin MP)</span>
                  </div>
                  <p className="text-2xl font-bold text-black tabular-nums tracking-tight">
                    {formatMoneda(neto)}
                  </p>
                  <p className="text-xs text-black mt-1">Total − materia prima</p>
                </div>
              </div>
            </div>
          </DetailSection>
        )}

        {esPresupuesto && (
          <DetailSection
            icon={itemsMP.length ? Package : PackageOpen}
            title="Materia prima"
            accent="amber"
          >
            {itemsMP.length === 0 ? (
              <p className="text-sm text-black flex items-center gap-2">
                <PackageOpen className="w-4 h-4 text-black" strokeWidth={2} />
                Sin ítems registrados.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-black text-left text-xs font-semibold uppercase tracking-wide">
                      <th className="px-3 py-2.5">Ítem</th>
                      <th className="px-3 py-2.5">Cant.</th>
                      <th className="px-3 py-2.5">Unidad</th>
                      <th className="px-3 py-2.5 text-right">P. unit.</th>
                      <th className="px-3 py-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {itemsMP.map((row, idx) => (
                      <tr key={idx} className="bg-white hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 py-2.5 font-medium text-black">{row.nombre || "—"}</td>
                        <td className="px-3 py-2.5 tabular-nums text-black">{cantidadItemMP(row)}</td>
                        <td className="px-3 py-2.5 text-black">{labelUnidadMP(row.unidad)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-black">
                          {formatMoneda(row.precio)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-black">
                          {formatMoneda(subtotalItemMP(row))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-amber-50/90 border-t border-amber-100">
                      <td colSpan={4} className="px-3 py-3 text-right text-sm font-semibold text-black">
                        Total materia prima
                      </td>
                      <td className="px-3 py-3 text-right text-sm font-bold tabular-nums text-black">
                        {formatMoneda(totalMP)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </DetailSection>
        )}

        <DetailSection icon={Receipt} title="Pagos registrados" accent="slate">
          <ul className="space-y-2">
            {(c.sertec || []).map((s, i) => {
              const fueAnulada = s.anulada === true;
              const anulables = [
                "seña",
                "arreglo",
                "% del total abonado",
                "seña efectivo",
                "seña transferencia",
              ];
              const esAnulable = anulables.includes(s.tipo);

              return (
                <li
                  key={i}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-2.5 ${
                    fueAnulada
                      ? "border-red-100 bg-red-50/50 line-through text-black"
                      : "border-slate-100 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <CreditCard
                      className={`w-4 h-4 shrink-0 mt-0.5 ${fueAnulada ? "text-black opacity-60" : "text-black"}`}
                      strokeWidth={2}
                    />
                    <div>
                      <span className="font-medium text-black block text-sm">{s.tipo}</span>
                      <span className="text-sm tabular-nums text-black">{formatMoneda(s.monto)}</span>
                      {fueAnulada && (
                        <span className="text-xs font-medium text-black not-italic no-underline">Anulado</span>
                      )}
                    </div>
                  </div>
                  {!fueAnulada && esAnulable && !isEditing && (
                    <button
                      type="button"
                      onClick={() => anularServicio(i)}
                      className="text-xs font-medium text-black hover:opacity-80 flex items-center gap-1 shrink-0"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={2} />
                      Anular
                    </button>
                  )}
                </li>
              );
            })}
            <li className="flex items-center justify-between gap-2 pt-3 mt-1 border-t border-slate-200">
              <span className="text-sm font-semibold text-black flex items-center gap-2">
                <Wallet className="w-4 h-4 text-black" strokeWidth={2} />
                Pendiente (referencia)
              </span>
              <span className="text-sm font-bold text-black tabular-nums">
                {formatMoneda(montoPendientePagar(c))}
              </span>
            </li>
          </ul>
        </DetailSection>

        {isEditing && (
          <DetailSection icon={Pencil} title="Editar registro" accent="violet">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Nombre", key: "clientName" },
                { label: "Sucursal", key: "branch" },
                { label: "Fecha", key: "date", type: "date" },
                { label: "Tipo", key: "problemType" },
                { label: "Forma de pago", key: "paymentOption" },
                { label: "Método de pago", key: "paymentMethod" },
                { label: "Efectivo", key: "efectivo", type: "number" },
                { label: "Transferencia", key: "transferencia", type: "number" },
                { label: "Total del trabajo", key: "totalTrabajo", type: "number" },
                { label: "Estado", key: "estado", type: "select" },
                { label: "Descripción", key: "description", type: "textarea" },
              ].map(({ label, key, type = "text" }) => (
                <div key={key} className={type === "textarea" ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-black uppercase tracking-wide mb-1.5">
                    {label}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-black focus:ring-2 focus:ring-verdefluor/40 focus:border-verdefluor outline-none transition-shadow"
                      value={editedClient?.[key] || ""}
                      onChange={(e) =>
                        setEditedClient({
                          ...editedClient,
                          [key]: e.target.value,
                        })
                      }
                    />
                  ) : type === "select" && key === "estado" ? (
                    <select
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-black bg-white focus:ring-2 focus:ring-verdefluor/40 focus:border-verdefluor outline-none"
                      value={editedClient?.estado || "en curso"}
                      onChange={(e) =>
                        setEditedClient({
                          ...editedClient,
                          estado: e.target.value,
                        })
                      }
                    >
                      <option value="en curso">En curso</option>
                      <option value="terminado">Terminado</option>
                    </select>
                  ) : (
                    <input
                      type={type}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-black focus:ring-2 focus:ring-verdefluor/40 focus:border-verdefluor outline-none"
                      value={
                        type === "date"
                          ? editedClient?.[key]
                            ? new Date(editedClient[key]).toISOString().split("T")[0]
                            : ""
                          : editedClient?.[key] ?? ""
                      }
                      onChange={(e) =>
                        setEditedClient({
                          ...editedClient,
                          [key]: type === "number" ? Number(e.target.value) : e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-slate-100">
              <p className="text-xs font-semibold text-black uppercase tracking-wide mb-3 flex items-center gap-2">
                <Receipt className="w-3.5 h-3.5" strokeWidth={2} />
                Montos sertec
              </p>
              <ul className="space-y-2">
                {(editedClient?.sertec || []).map((s, i) => (
                  <li key={i} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm font-medium text-black w-44 shrink-0 truncate" title={s.tipo}>
                      {s.tipo}
                    </span>
                    <input
                      type="number"
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm max-w-xs focus:ring-2 focus:ring-verdefluor/40 outline-none"
                      value={editedClient?.sertec?.[i]?.monto ?? ""}
                      onChange={(e) => {
                        const newSertec = [...editedClient.sertec];
                        newSertec[i] = { ...newSertec[i], monto: Number(e.target.value) };
                        setEditedClient({ ...editedClient, sertec: newSertec });
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </DetailSection>
        )}
      </div>
    );
  };

  const filterTabs = [
    { id: "Todos", label: "Todos", icon: LayoutGrid },
    { id: "Servicio T.", label: "Servicio técnico", icon: Wrench },
    { id: "Presupuesto", label: "Presupuesto", icon: FileText },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-16 px-1 sm:px-0">
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 px-5 py-6 sm:px-8 sm:py-7 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-black shadow-md shrink-0">
              <User className="w-6 h-6" strokeWidth={2} />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                Historial de clientes
              </h1>
              <p className="text-black text-sm mt-1 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 shrink-0 opacity-70" strokeWidth={2} />
                {filteredClientes.length} registro{filteredClientes.length !== 1 ? "s" : ""}
                {filter !== "Todos" && (
                  <span className="text-black">· filtrado</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {filterTabs.map(({ id, label, icon: Icon }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all border ${
                  active
                    ? "bg-verdefluor text-black border-verdefluor shadow-sm"
                    : "bg-white text-black border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[auto_minmax(7rem,1fr)_minmax(5rem,0.75fr)_minmax(7.5rem,0.85fr)_minmax(9rem,1.1fr)_minmax(5.5rem,0.65fr)_5.5rem_3rem] gap-0 items-center px-3 sm:px-4 py-3 bg-slate-50 border-b border-slate-200">
              <div className="w-8" aria-hidden />
              <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider">
                <User className="w-3.5 h-3.5" strokeWidth={2} />
                Nombre
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" strokeWidth={2} />
                Sucursal
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                Fecha
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider min-w-0">
                <Factory className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                Qué se fabrica
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                Estado
              </div>
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-black uppercase tracking-wider">
                <Package className="w-3.5 h-3.5" strokeWidth={2} />
                MP
              </div>
              <div className="sr-only">Detalle</div>
            </div>

            {filteredClientes.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <PackageOpen className="w-12 h-12 text-black mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-black font-medium">No hay registros con este filtro.</p>
                <p className="text-black text-sm mt-1">Probá con &quot;Todos&quot;.</p>
              </div>
            ) : (
              filteredClientes.map((cliente, index) => {
                const id = cliente._id != null ? String(cliente._id) : `idx-${index}`;
                const open = detailId != null && cliente._id != null && String(cliente._id) === detailId;
                const mp = tieneMateriaPrima(cliente);
                const fabrica = labelQueSeFabrica(cliente);
                const esST = cliente.problemType === "arreglo";
                const terminado = cliente.problemType === "arreglo" || cliente.estado === "terminado";

                return (
                  <div key={id} className="border-b border-slate-100 last:border-0">
                    <div
                      className={`grid grid-cols-[auto_minmax(7rem,1fr)_minmax(5rem,0.75fr)_minmax(7.5rem,0.85fr)_minmax(9rem,1.1fr)_minmax(5.5rem,0.65fr)_5.5rem_3rem] gap-0 items-center px-3 sm:px-4 py-3 transition-colors ${
                        open ? "bg-slate-50" : index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      } hover:bg-slate-50/90`}
                    >
                      <div className="flex justify-center pr-1">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                            esST
                              ? "bg-violet-50 border-violet-100 text-black"
                              : "bg-emerald-50 border-emerald-100 text-black"
                          }`}
                          title={esST ? "Servicio técnico" : "Presupuesto"}
                        >
                          {esST ? (
                            <Wrench className="w-4 h-4" strokeWidth={2} />
                          ) : (
                            <FileText className="w-4 h-4" strokeWidth={2} />
                          )}
                        </span>
                      </div>
                      <div className="font-semibold text-black text-sm min-w-0 pr-2">
                        <span className="truncate block" title={cliente.clientName}>
                          {cliente.clientName}
                        </span>
                      </div>
                      <div className="text-sm text-black truncate" title={cliente.branch || ""}>
                        {cliente.branch?.trim() || "—"}
                      </div>
                      <div className="text-sm">{celdaFechaTabla(cliente)}</div>
                      <div className="text-sm text-black min-w-0 pr-1">
                        <span className="truncate block" title={fabrica}>
                          {fabrica}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            terminado
                              ? "bg-slate-100 text-black"
                              : "bg-amber-50 text-black border border-amber-200"
                          }`}
                        >
                          {terminado ? (
                            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          )}
                          {estadoLabel(cliente)}
                        </span>
                      </div>
                      <div className="flex justify-center">
                        {cliente.problemType === "presupuesto" ? (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
                              mp
                                ? "bg-emerald-100 text-black"
                                : "bg-slate-100 text-black"
                            }`}
                            title={mp ? "Con materia prima" : "Sin materia prima"}
                          >
                            {mp ? (
                              <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                            ) : (
                              <Minus className="w-3.5 h-3.5 opacity-50" strokeWidth={2} />
                            )}
                            {mp ? "Sí" : "No"}
                          </span>
                        ) : (
                          <span className="text-black text-lg font-light">·</span>
                        )}
                      </div>
                      <div className="flex justify-center">
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-label={open ? "Cerrar detalle" : "Ver detalle"}
                          onClick={() => toggleDetalle(cliente)}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                            open
                              ? "bg-slate-900 text-white border-slate-900 shadow-md"
                              : "bg-white text-black border-slate-200 hover:border-verdefluor hover:text-black"
                          }`}
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                            strokeWidth={2}
                          />
                        </button>
                      </div>
                    </div>

                    {open && (
                      <div className="px-3 sm:px-5 py-6 bg-gradient-to-b from-slate-50 to-slate-100/80 border-t border-slate-200">
                        <div className="max-w-3xl mx-auto space-y-5">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <h2 className="text-base font-bold text-black flex items-center gap-2">
                              <ClipboardList className="w-5 h-5 text-black" strokeWidth={2} />
                              Detalle del registro
                            </h2>
                            <span className="text-xs font-medium text-black uppercase tracking-wide">
                              ID interno · {String(detailClient._id || "").slice(-8)}
                            </span>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                            {renderDetalleCompleto()}
                          </div>

                          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={handleGuardarCambios}
                                  className="inline-flex items-center justify-center gap-2 flex-1 min-w-[140px] rounded-xl bg-verdefluor hover:bg-verdefluort text-black font-semibold py-3 px-4 border border-slate-900/10 shadow-sm transition-colors"
                                >
                                  <Save className="w-4 h-4" strokeWidth={2} />
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsEditing(false);
                                    setEditedClient(null);
                                  }}
                                  className="inline-flex items-center justify-center gap-2 flex-1 min-w-[140px] rounded-xl bg-white border border-slate-200 text-black font-semibold py-3 px-4 hover:bg-slate-50 transition-colors"
                                >
                                  <X className="w-4 h-4" strokeWidth={2} />
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsEditing(true);
                                    setEditedClient({
                                      ...detailClient,
                                      sertec: [...(detailClient.sertec || [])],
                                    });
                                  }}
                                  className="inline-flex items-center justify-center gap-2 flex-1 min-w-[120px] rounded-xl bg-slate-900 text-white font-semibold py-3 px-4 hover:bg-slate-800 transition-colors"
                                >
                                  <Pencil className="w-4 h-4" strokeWidth={2} />
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEliminar(detailClient._id)}
                                  className="inline-flex items-center justify-center gap-2 flex-1 min-w-[120px] rounded-xl bg-white border border-red-200 text-black font-semibold py-3 px-4 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                                  Eliminar
                                </button>
                                {detailClient.estado !== "terminado" && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const ft = new Date().toISOString().split("T")[0];
                                      await editarCliente({
                                        ...detailClient,
                                        estado: "terminado",
                                        fechaTerminado: ft,
                                      });
                                      setDetailClient({
                                        ...detailClient,
                                        estado: "terminado",
                                        fechaTerminado: ft,
                                      });
                                      refetch();
                                    }}
                                    className="inline-flex items-center justify-center gap-2 flex-1 min-w-[160px] rounded-xl bg-verdefluor hover:bg-verdefluort text-black font-semibold py-3 px-4 border border-slate-900/10 shadow-sm"
                                  >
                                    <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                                    Marcar terminado
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              type="button"
                              onClick={cerrarDetalle}
                              className="inline-flex items-center justify-center gap-2 flex-1 min-w-[120px] rounded-xl bg-white border border-slate-200 text-black font-semibold py-3 px-4 hover:bg-slate-50"
                            >
                              <ChevronDown className="w-4 h-4 rotate-180" strokeWidth={2} />
                              Cerrar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
