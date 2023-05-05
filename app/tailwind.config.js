/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
    colors: {
      gray: {
        50: "#f8f8f8",
        100: "#eeeded", // official
        200: "#e5e3e3",
        300: "#d9d9d9",
        400: "#bdbdbd", // official
        500: "#9c9797",
        600: "#847e7e",
        700: "#6b6b6b", // official
        800: "#5c5858",
        900: "#504d4d",
        950: "#232323", // official
      },
      green: {
        50: "#f2fbf8",
        100: "#d5f2e9",
        200: "#aae5d3",
        300: "#78d0b8",
        400: "#54b9a1", // official
        500: "#329a83",
        600: "#267b6a",
        700: "#226357",
        800: "#1f5048",
        900: "#1e433d",
        950: "#0c2724",
      },
      orange: {
        50: "#fef7ee",
        100: "#fceed8",
        200: "#f8d9b0",
        300: "#f0b065", // official
        400: "#ec984b",
        500: "#e87c27",
        600: "#d9621d",
        700: "#b44b1a",
        800: "#903c1c",
        900: "#74341a",
        950: "#3e180c",
      },
      red: {
        roman: {
          50: "#fdf4f3",
          100: "#fce7e7",
          200: "#f8d3d4",
          300: "#f2afb0",
          400: "#ea8286",
          500: "#df5c64", // official
          600: "#c93546",
          700: "#a92739",
          800: "#8e2335",
          900: "#7a2133",
          950: "#430e17",
        },
      },
    },
  },
  plugins: [],
}
