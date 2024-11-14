const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        customRed: "#ff6b6b",
        mintCream: "#f7fff7",
        customBlue: "#4ecdc4",
        midnightGreen: "#4ecdc4",
      },
      
    },
  },
  plugins: [flowbite.plugin()],
};
