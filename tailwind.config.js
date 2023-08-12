/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5593FE",
        "brand-2": "#3B4D8A",
        "brand-3": "#232E52",
        "brand-black": "#090B11",
        "brand-gray": "#6B6C7E",
        "brand-gray-light": "#9CA3AF"
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};
