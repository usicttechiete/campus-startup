/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // Light Background Palette
        bg: {
          DEFAULT: '#f8fafc',
          elevated: '#ffffff',
          card: '#ffffff',
          subtle: '#f1f5f9',
        },
        // Primary - Electric Blue
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          soft: 'rgba(37, 99, 235, 0.08)',
        },
        // Secondary - Indigo
        secondary: {
          DEFAULT: '#6366f1',
          soft: 'rgba(99, 102, 241, 0.08)',
        },
        // Accent - Teal
        accent: {
          DEFAULT: '#0d9488',
          soft: 'rgba(13, 148, 136, 0.08)',
        },
        // Semantic
        success: {
          DEFAULT: '#10b981',
          soft: 'rgba(16, 185, 129, 0.1)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          soft: 'rgba(245, 158, 11, 0.1)',
        },
        danger: {
          DEFAULT: '#ef4444',
          soft: 'rgba(239, 68, 68, 0.1)',
        },
        // Text
        text: {
          primary: '#0f172a',
          secondary: '#334155',
          muted: '#64748b',
          disabled: '#94a3b8',
        },
        // Borders
        border: {
          DEFAULT: '#e2e8f0',
          hover: '#cbd5e1',
        },
        divider: '#e2e8f0',
      },
      maxWidth: {
        'app': '480px',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '18px',
        '2xl': '22px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'glow': '0 4px 14px rgba(37, 99, 235, 0.25)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        'scale-in': 'scale-in 0.25s ease-out',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
