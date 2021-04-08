const defaultConfig = require("tailwindcss/defaultConfig");
const formsPlugin = require("@tailwindcss/forms");
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["index.html", "src/**/*.tsx"],
  theme: {
    fontFamily: {
      sans: ["Inter var", defaultConfig.theme.fontFamily.sans],
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0055C6",
          contrast: colors.white,
          dark: "#0047a3",
          lighter: "#0f77ff",
        },
        secondary: {
          DEFAULT: "#505b76",
          contrast: colors.white,
          dark: "#384169",
          lighter: "#5972a6",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [formsPlugin],
};
