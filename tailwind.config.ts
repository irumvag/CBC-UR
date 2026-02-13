import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        claude: {
          terracotta: '#da7756',
          'terracotta-deep': '#C15F3C',
          'terracotta-light': '#e8a48d',
        },
        pampas: '#F4F3EE',
        'pampas-warm': '#EDE9E0',
        cloudy: '#B1ADA1',
        stone: '#8A8578',
        charcoal: '#2D2926',
        ink: '#1A1714',
        sage: '#7C9A82',
        teal: '#4A8B8C',
        surface: '#FAFAF7',
        // Dark mode specific colors
        dark: {
          bg: '#1A1714',
          surface: '#232220',
          card: '#2D2926',
          border: '#3D3935',
          text: '#F4F3EE',
          muted: '#B1ADA1',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'ui-serif', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
