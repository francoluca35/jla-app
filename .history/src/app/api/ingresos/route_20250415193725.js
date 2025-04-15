import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("jlapp");
    const clientes = await db.collection("clientes").find().toArray();

    let totalTodos = 0;
    let totalArreglo = 0;
    let totalPresupuesto = 0;

    clientes.forEach((cliente) => {
      if (cliente.serie && Array.isArray(cliente.serie)) {
        cliente.serie.forEach((servicio) => {
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
