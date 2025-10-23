/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#f97316",
        background: "#0f172a",
        card: "#1e293b",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
