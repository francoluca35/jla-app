import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("jjapp");
    const clientes = await db.collection("clientes").find().toArray();

    let totalTodos = 0;
    let totalArreglo = 0;
    let totalPresupuesto = 0;

    clientes.forEach((cliente) => {
      // Sumar amount a total general
      if (cliente.amount) {
        totalTodos += cliente.amount;
      }

      // Por tipo de problema
      if (cliente.problemType === "arreglo") {
        totalArreglo += cliente.amount || 0;
      } else if (cliente.problemType === "presupuesto") {
        // Si es presupuesto sumo según paymentOption
        if (
          cliente.paymentOption === "seña" ||
          cliente.paymentOption === "pago total"
        ) {
          totalPresupuesto += cliente.amount || 0;
        }
      }

      // Sumar desde sertec
      if (cliente.sertec && Array.isArray(cliente.sertec)) {
        cliente.sertec.forEach((servicio) => {
          totalTodos += servicio.monto;

          if (servicio.tipo === "arreglo") {
            totalArreglo += servicio.monto;
          } else if (
            servicio.tipo === "pago total" ||
            servicio.tipo === "seña"
          ) {
            totalPresupuesto += servicio.monto;
          }
        });
      }
    });

    res.status(200).json({
      totalTodos,
      totalArreglo,
      totalPresupuesto,
    });
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
