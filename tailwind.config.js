/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Cormorant Garamond', 'serif'],
        script: ['Allura', 'cursive'],
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        gold: {
          50:  '#fdf9ec',
          100: '#f9efc4',
          200: '#f3da85',
          300: '#ecc44d',
          400: '#d4af37',
          500: '#c9a84c',
          600: '#b8962e',
          700: '#9a7a22',
          800: '#7c6119',
          900: '#5e4a13',
        },
        dark: {
          900: '#080808',
          800: '#0d0d0d',
          700: '#111111',
          600: '#1a1a1a',
          500: '#222222',
        },
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.35em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease-out both',
        'fade-in': 'fade-in 1s ease-out both',
      },
    },
  },
  future: {
    // Scopes hover:/group-hover: to devices with real hover (mouse/trackpad) so
    // touch taps on mobile no longer trigger sticky hover states (e.g. the
    // group-hover:scale-110 zoom on card images looked like it fired on scroll).
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
