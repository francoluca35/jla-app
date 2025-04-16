// next.config.js
module.exports = {
  reactStrictMode: true, // buena práctica, lo dejo activo
  webpack(config, { isServer }) {
    // Personalizaciones de Webpack si las necesitas
    return config;
  },
};
