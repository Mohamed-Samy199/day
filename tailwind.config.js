/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B1E1B',
          light: '#12302A',
          deep: '#071312',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#E4C766',
          dim: '#8C7530',
        },
        cream: '#EFE7D8',
        rust: '#A85B2E',
      },
      fontFamily: {
        display: ['"Reem Kufi"', 'Tahoma', 'sans-serif'],
        body: ['"Cairo"', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 20px 60px -20px rgba(0,0,0,0.65)',
      },
    },
  },
  plugins: [],
}
