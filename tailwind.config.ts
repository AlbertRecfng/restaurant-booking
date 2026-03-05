import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdfcf9',
          100: '#faf8f3',
          200: '#f3efe6',
          300: '#eae2d5',
          400: '#dfd1c0',
          500: '#b8985a',
          600: '#9a7f4c',
          700: '#7c663e',
          800: '#645435',
          900: '#52442e',
        },
        background: '#0a0804',
        surface: '#0e0b06',
        text: {
          primary: '#e8dcc8',
          secondary: '#b0a090',
          muted: '#9a8a72',
          accent: '#6a5a42',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        'serif-sc': ['Cormorant SC', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 1s ease both',
        'bounce-slow': 'bounce 2s ease infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
