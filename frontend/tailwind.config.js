/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f2',
          100: '#dcebe0',
          200: '#b9d7c1',
          300: '#8bbd9a',
          400: '#5ea074',
          500: '#3d8258',
          600: '#2d6945',
          700: '#215338',
          800: '#1a422d',
          900: '#0f2b1a',
          950: '#081a0f',
        },
        tierra: {
          50: '#fdf6f0',
          100: '#f8e8d9',
          200: '#f0d0b3',
          300: '#e5b088',
          400: '#d98d5e',
          500: '#d4764a',
          600: '#b85d35',
          700: '#96482a',
          800: '#7a3b24',
          900: '#5a2d1c',
        },
        oro: {
          50: '#fdf8ed',
          100: '#f9edcc',
          200: '#f3d994',
          300: '#ecc45d',
          400: '#e8b84b',
          500: '#d4a035',
          600: '#b8832a',
          700: '#966623',
          800: '#7a5321',
          900: '#5d401b',
        },
        crema: '#faf4ed',
        crudo: '#f0e6d8',
        carbon: '#1a1816',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.7s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
