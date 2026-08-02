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
        cyber: {
          dark: '#05070c',
          card: '#0b101d',
          cardBorder: '#1e293b',
          cyan: '#00f0ff',
          neonViolet: '#a855f7',
          pink: '#ff007f',
          green: '#00ff66',
          red: '#ff0055',
          gold: '#ffb703',
          textMuted: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Rajdhani', 'sans-serif']
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.35)',
        'neon-violet': '0 0 15px rgba(168, 85, 247, 0.35)',
        'neon-green': '0 0 15px rgba(0, 255, 102, 0.35)',
        'neon-red': '0 0 15px rgba(255, 0, 85, 0.35)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)'
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
