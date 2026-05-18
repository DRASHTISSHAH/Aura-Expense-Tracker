/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: '#7c3aed',         // Landing-page deep violet — primary accent
        'brand-light': '#a78bfa', // Lighter violet for hover/tint states
        'brand-mid': '#7c3aed',   // Same as brand for consistency
        'brand-deep': '#5b21b6',  // Deeper violet for pressed/active states
        'surface-dark': '#02020a', // Landing page void — deep black
        'surface-alt': '#0f172a',  // Slightly lighter dark surface
        'surface-card': '#1e1b4b', // Landing page indigo tint for cards
        'text-primary': '#f0f4ff',
        'text-secondary': '#a78bfa',
        'text-muted': '#7c6aa6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}