import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("jlapp");
    const clientes = await db.collection("clientes").find().toArray();

    let totalTodos = 0;
    let totalArreglo = 0;
    let totalPresupuesto = 0;
    let totalPresupuestoSeña = 0;
    let totalPresupuestoPagoTotal = 0;

    clientes.forEach((cliente) => {
      if (cliente.amount) {
        totalTodos += cliente.amount;
      }
      if (cliente.problemType === "arreglo") {
        totalArreglo += cliente.amount || 0;
      } else if (cliente.problemType === "presupuesto") {
        if (cliente.paymentOption === "seña") {
          totalPresupuestoSeña += cliente.amount || 0;
        } else if (cliente.paymentOption === "pago total") {
          totalPresupuestoPagoTotal += cliente.amount || 0;
        }
        if (
          cliente.paymentOption === "seña" ||
          cliente.paymentOption === "pago total"
        ) {
          totalPresupuesto += cliente.amount || 0;
        }
      }
    });

    return new Response(
      JSON.stringify({
        clientes,
        totalTodos,
        totalArreglo,
        totalPresupuesto,
        totalPresupuestoSeña,
        totalPresupuestoPagoTotal,
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

  const eliminarIngreso = async (ids) => {
    try {
      const res = await fetch("/api/ingresos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (res.ok) {
        // Recargá datos o filtrados
        fetchData(); // Asegurate de tener esta función en el hook
      }
    } catch (error) {
      console.error("Error al eliminar ingresos:", error);
    }
  };
}
