// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        vinotinto: '#4B0C1F',
        moradoOscuro: '#3A0E5C',
        negro: '#000000',
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.6s ease forwards',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};