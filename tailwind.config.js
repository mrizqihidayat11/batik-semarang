export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F6F3EC",
        paper: "#FFFCF7",
        navy: "#172B3A",
        brown: "#76513B",
        gold: "#C49A55",
        muted: "#7B7B75",
        line: "#E6E1D7",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: { soft: "0 12px 45px -16px rgba(61,45,28,.18)" },
    },
  },
  plugins: [],
};
