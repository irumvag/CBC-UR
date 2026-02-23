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
        // TX template color system (primary colors for public pages)
        primary: {
          DEFAULT: '#c15f3c',
          dark: '#a84f31',
          light: '#d4783a',
        },
        foreground: '#1a1a1a',
        cream: '#f4f3ee',
        muted: '#b1ada1',
        surface: '#ffffff',
        background: '#f4f3ee',
        // Keep existing names for admin pages
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
        // Dark mode colors (admin only)
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
        serif: ['"Source Serif 4"', 'Georgia', '"Times New Roman"', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { transform: 'translateY(100%)' },
          'to': { transform: 'translateY(0)' },
        },
        slideDown: {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
