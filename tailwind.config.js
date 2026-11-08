/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderRadius: {
      none: '0px',
      sm: '0px',
      DEFAULT: '0px',
      md: '0px',
      lg: '0px',
      xl: '0px',
      '2xl': '0px',
      '3xl': '0px',
      full: '0px',
      dot: '9999px',
    },
    extend: {
      colors: {
        ferrari: {
          red: '#E10600',
          darkRed: '#B30500',
          deepRed: '#6B0000',
          yellow: '#FED500',
          gold: '#E5A91E',
          black: '#080808',
          carbon: '#111111',
          graphite: '#1B1B1B',
          steel: '#292929',
          lightGrey: '#D8D8D8',
          white: '#F5F5F5',
          muted: '#858585',
          dark: '#0B0D12',
          card: '#111319',
          cardHover: '#161922',
          border: '#232736',
          silver: '#C4CAD4',
          tricoloreGreen: '#008C45',
          tricoloreWhite: '#F4F5F0',
          tricoloreRed: '#CD212A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Barlow Condensed', 'Montserrat', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'rev-shake': 'revShake 0.15s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'flame': 'flame 0.4s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(255, 40, 0, 0.4)' },
          '100%': { boxShadow: '0 0 35px rgba(255, 40, 0, 0.8), 0 0 70px rgba(254, 213, 0, 0.3)' },
        },
        revShake: {
          '0%': { transform: 'translate(1px, 1px) rotate(0deg)' },
          '100%': { transform: 'translate(-1px, -1px) rotate(-0.5deg)' },
        },
        flame: {
          '0%': { transform: 'scale(1)', opacity: '0.85' },
          '100%': { transform: 'scale(1.25)', opacity: '1' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      },
      backgroundImage: {
        'carbon-mesh': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
        'ferrari-gradient': 'linear-gradient(135deg, #FF2800 0%, #B30000 60%, #4D0000 100%)',
        'modena-gradient': 'linear-gradient(135deg, #FED500 0%, #E5A91E 100%)',
      }
    },
  },
  plugins: [],
}

