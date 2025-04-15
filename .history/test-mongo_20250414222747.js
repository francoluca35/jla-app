import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://jlatecnicos:7QteIkM9QbRAL6RV@cluster0.t470rhk.mongodb.net/jlapp?retryWrites=true&w=majority&appName=Cluster0&tls=true&tlsAllowInvalidCertificates=true";

const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true,
});

async function testConnection() {
  try {
    await client.connect();
    const db = client.db("jlapp");
    const users = await db.collection("users").find().toArray();
    console.log("✅ Conexión exitosa. Usuarios:", users);
  } catch (err) {
    console.error("❌ Error de conexión:", err);
  } finally {
    await client.close();
  }
}

testConnection();
