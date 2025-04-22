// server.js
const express = require("express");
const cors = require("cors");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Crea una instancia de Express
const server = express();

// Habilitar CORS solo para tu móvil (o frontend)
server.use(cors({ origin: "http://localhost:3000" }));

// Middleware para servir las rutas de la API
server.use(express.json());

// Aquí defines tus rutas de API
server.post("/api/authenticate-fingerprint", (req, res) => {
  // Lógica de autenticación
  res.json({ message: "Autenticación exitosa" });
});

// Middleware de Next.js para manejar las solicitudes
server.all("*", (req, res) => {
  return handle(req, res); // Para que Next.js maneje las demás rutas
});

// Inicia el servidor en el puerto 3001
server.listen(3000, (err) => {
  if (err) throw err;
  console.log("> Ready on http://localhost:3000");
});
