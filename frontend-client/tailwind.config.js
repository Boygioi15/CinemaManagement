/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        interNormal: ["Inter-normal", "sans-serif"],
        interBold: ["Inter-bold", "sans-serif"],
        interExtraBold: ["Inter-extrabold", "sans-serif"],
      },
      colors: {
        mainColor: "#F3EA28", // Sửa cú pháp
      },
    },
  },
  plugins: [],
};
