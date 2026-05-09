/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        hub: {
          ink: '#0f172a',
          coral: '#ea580c',
          sea: '#0369a1',
          primary: '#ff6b35',
          'primary-dark': '#e55a28',
          secondary: '#7c3aed',
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
          dark: '#0a0a0f',
          surface: '#111118',
          surface2: '#1a1a24',
          text: '#e2e8f0',
          muted: '#64748b',
          border: '#2a2a3a',
        },
      },
    },
  },
  plugins: [],
};
