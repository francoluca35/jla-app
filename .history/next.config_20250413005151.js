// next.config.js
module.exports = {
  experimental: {
    turboMode: false, // Desactiva Turbopack
  },
  webpack(config, { isServer }) {
    // Aquí puedes personalizar la configuración de Webpack si lo necesitas
    return config;
  },
};
