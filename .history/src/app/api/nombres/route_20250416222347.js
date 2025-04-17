// pages/api/nombres.js
import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("jlapp");
    const collection = db.collection("clientes");

    const nombres = await collection.distinct("clientName");
    res.status(200).json(nombres);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener nombres" });
  }
}
