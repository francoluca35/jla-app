// next.config.js

const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public", // Directorio donde se generarán los archivos de PWA
    register: true,
    skipWaiting: true,
  },
  reactStrictMode: true, // Puedes habilitar esto si lo necesitas
});
