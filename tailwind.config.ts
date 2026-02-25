/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        serenity: {
          light: '#A5D8E1',
          DEFAULT: '#7DB9C2',
          dark: '#4E7F92'
        },
        meditation: {
          light: '#E8F8F5',
          DEFAULT: '#B2E0D0',
          dark: '#9BD5C5'
        }
      },
      animation: {
        'pulse-slow': 'pulse 5s infinite',
        'bounce-slow': 'bounce 5s infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        float: 'float 6s ease infinite',
        glow: 'glow 1.5s ease infinite'
      },
      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        float: {
          '0%': { transform: 'translatey(0)' },
          '50%': { transform: 'translatey(-10px)' },
          '100%': { transform: 'translatey(0)' }
        },
        glow: {
          '0%': { textShadow: '0 0 5px rgba(255, 255, 255, 0.3)' },
          '100%': { textShadow: '0 0 20px rgba(255, 255, 255, 0.7)' }
        }
      },
      boxShadow: {
        glow: '0 0 10px rgba(0, 255, 21, 0.8)',
        'glow-md': '0 0 20px rgba(0, 255, 21, 0.6)',
        'glow-lg': '0 0 30px rgba(0, 255, 21, 0.8)'
      },
      spacing: {
        '128': '32rem',
        '144': '36rem'
      }
    }
  },
  plugins: [
    require('tailwindcss-glassmorphism')({
      className: '.glass',
      classNameDark: '.glass-dark'
    }),
    function ({ addUtilities }) {
      addUtilities({
        '.gradient-text': {
          background: 'linear-gradient(to right, #6EE7B7, #3B82F6)',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }
      });
    }
  ],
};