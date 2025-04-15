import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("jlapp");
    const clientes = await db.collection("clientes").find().toArray();

    let totalTodos = 0;
    let totalArreglo = 0;
    let totalPresupuesto = 0;

    clientes.forEach((cliente) => {
      if (cliente.amount) {
        totalTodos += cliente.amount;
      }
      if (cliente.problemType === "arreglo") {
        totalArreglo += cliente.amount || 0;
      } else if (cliente.problemType === "presupuesto") {
        if (
          cliente.paymentOption === "seña" ||
          cliente.paymentOption === "pago total"
        ) {
          totalPresupuesto += cliente.amount || 0;
        }
      }
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

    return new Response(
      JSON.stringify({
        totalTodos,
        totalArreglo,
        totalPresupuesto,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
