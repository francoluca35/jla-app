// postcss.config.js
module.exports = {
  plugins: [
    "tailwindcss",
    "autoprefixer",
    require("@tailwindcss/postcss"), // Esta línea es importante
  ],
};
