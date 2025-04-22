// next.config.js

const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public", // Aquí se generará el archivo sw.js
    register: true,
    skipWaiting: true,
  },
  reactStrictMode: true, // Si necesitas habilitar esto
});
