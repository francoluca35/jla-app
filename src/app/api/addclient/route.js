import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📦 Datos recibidos para guardar:", body);

    const client = await clientPromise;
    const db = client.db("jlapp");
    const clientesCollection = db.collection("clientes");
    const gastosCollection = db.collection("gastos");

    const isPresupuesto = body.problemType === "presupuesto";
    const isServicioTecnico = body.problemType === "arreglo";

    let totalMateriaPrima = 0;
    if (Array.isArray(body?.materiaPrimaDetalle)) {
      totalMateriaPrima = body.materiaPrimaDetalle.reduce((acc, item) => {
        const precio = Number(item?.precio) || 0;
        const cantidad = Number(item?.cantidad);
        const qty = Number.isFinite(cantidad) && cantidad > 0 ? cantidad : 1;
        return acc + precio * qty;
      }, 0);
    }

    if (isPresupuesto && Number(body?.presupuestoGanancia?.totalMateriaPrima) >= 0) {
      totalMateriaPrima = Number(body.presupuestoGanancia.totalMateriaPrima) || totalMateriaPrima;
    }

    const totalTrabajo = Number(body.totalTrabajo ?? body.amount ?? 0) || 0;
    const gananciaNeta =
      isPresupuesto && body?.presupuestoGanancia?.gananciaNeta != null
        ? Number(body.presupuestoGanancia.gananciaNeta) || 0
        : Math.max(0, totalTrabajo - totalMateriaPrima);

    const estadoFinal = isServicioTecnico ? "terminado" : body.estado;
    const fechaTerminadoFinal =
      isServicioTecnico
        ? body.fechaTerminado || new Date().toISOString().split("T")[0]
        : body.fechaTerminado;

    const clienteDoc = {
      ...body,
      estado: estadoFinal,
      fechaTerminado: fechaTerminadoFinal,
      // Historial de ingresos usa clientes: para presupuesto mostrar ganancia neta final.
      montoFinal: isPresupuesto ? gananciaNeta : totalTrabajo,
      tipoIngreso: isPresupuesto ? "presupuesto" : "servicio tecnico",
      pagoIngreso: body.paymentOption || "",
      estadoIngreso:
        isPresupuesto && estadoFinal !== "terminado" ? "en fabricacion" : "terminado",
    };

    const result = await clientesCollection.insertOne(clienteDoc);

    // Historial de gastos: registrar costo de materia prima por cada presupuesto creado.
    if (isPresupuesto) {
      await gastosCollection.insertOne({
        tipo: "materiaPrimaPresupuesto",
        cliente: body.clientName || "",
        sucursal: body.branch || "",
        fecha: body.date ? new Date(body.date) : new Date(),
        precio: totalMateriaPrima,
        montoMateriaPrima: totalMateriaPrima,
        gastoTotal: totalMateriaPrima,
        descripcion: `Materia prima presupuesto - ${body.clientName || "cliente"}`,
        presupuestoClienteId: result.insertedId,
      });
    }

    return new Response(
      JSON.stringify({ success: true, insertedId: result.insertedId }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("🚨 Error al guardar cliente:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error al guardar cliente" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
