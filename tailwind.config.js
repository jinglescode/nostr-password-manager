/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7E81FF",
        "brand-2": "#635EC0",
        "brand-3": "#262230",
        "brand-4": "#141119",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};
