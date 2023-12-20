/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "editor-background": "#1E1E1E",
        "widget-border": "#303031",
      },
    },
  },
  plugins: [],
};

