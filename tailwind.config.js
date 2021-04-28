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
          DEFAULT: "#376FFF",
          contrast: colors.white,
          dark: "#3264e6",
          lighter: "#739aff",
        },
        secondary: {
          DEFAULT: "#001030",
          contrast: colors.white,
          dark: "#000a1d",
          lighter: "#4d586e",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [formsPlugin],
};
