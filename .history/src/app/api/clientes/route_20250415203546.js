import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("jlapp");
      const data = await db.collection("clientes").find({}).toArray();

      res.status(200).json(data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
