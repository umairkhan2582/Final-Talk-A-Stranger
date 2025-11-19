/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure Tailwind scans your files
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5faff",
          100: "#e0f0ff",
          200: "#b8deff",
          300: "#8acaff",
          400: "#5eb7ff",
          500: "#339fff",
          600: "#007aff",
          700: "#0066cc", // <- this is the 700 shade Tailwind was complaining about
          800: "#004999",
          900: "#003366",
        },
      },
    },
  },
  plugins: [],
};
