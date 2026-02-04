/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#305CFF',
          dark: '#2448C2',
          light: '#E5ECFF',
        },
        accent: '#FFB71B',
        surface: '#F7F8FC',
        card: '#FFFFFF',
        muted: '#6B7280',
        success: '#16A34A',
        danger: '#DC2626',
        border: '#E5E7EB',
        body: '#0F172A',
      },
      boxShadow: {
        soft: '0 20px 40px -24px rgba(48, 92, 255, 0.32)',
        card: '0 14px 40px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
};
