/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#F5F5DC',
        'light-beige': '#F5F1E8',
        'medium-beige': '#EDE8D0',
        'dark-brown': '#8A773F',
        'text-dark': '#2D1810',
        'text-medium': '#8D493A',
        'text-cream': '#F5F5DC',
        'light-brown': '#A08A57',
        'white': '#FFFFFF',
        beige: {
          50: '#FAF7F0',
          100: '#F5F1E8',
          200: '#EDE8D0',
          300: '#E0D5B7',
          400: '#D2C29F',
          500: '#C4B087',
          600: '#B69D6F',
          700: '#A08A57',
          800: '#8A773F',
          900: '#746427',
        },
        gold: {
          400: '#F4D03F',
          500: '#F1C40F',
          600: '#D4AC0D',
          700: '#B7950B',
        },
        brown: {
          600: '#8B4513',
          700: '#A0522D',
          800: '#654321',
          900: '#4A2C17',
        },
        warm: {
          white: '#FDF5E6',
          cream: '#F5F5DC',
          linen: '#FAF0E6',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
