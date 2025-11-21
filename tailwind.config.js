/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}', './src/app/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      keyframes: {
        scrollLeft: {
          '0%': {transform: 'translateX(0)'},
          '100%': {transform: 'translateX(-50%)'},
        },
        scrollRight: {
          '0%': {transform: 'translateX(-50%)'},
          '100%': {transform: 'translateX(0)'},
        },
      },
      animation: {
        scrollLeft: 'scrollLeft linear infinite',
        scrollRight: 'scrollRight linear infinite',
      },
      fontFamily: {
        suit: ['SUIT-Regular', 'sans-serif'],
        nunito: ['Nunito"', 'sans-serif'],
        onepick: ['"YOnepickTTF-Bold"', 'sans-serif'],
      },
      colors: {
        'yellow-main': '#F0C600',
        'yellow-light': '#FFE983',
        'green-light': '#DCFCE8',
        'green-main': '#1E8342',
        'gray-dark': '#717171',
        'gray-medium': '#B8B8B8',
        'gray-light': '#D9D9D9',
        'gray-background': '#F7F7F7',
        'red-main': '#DF0000',
        'blue-main': '#002FFF',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar-hide')],
};
