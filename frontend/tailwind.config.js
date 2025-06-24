/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        framework: {
          field: '#10b981',      // Green for Field Building
          reading: '#3b82f6',    // Blue for Supported Reading  
          genre: '#8b5cf6',      // Purple for Genre Learning
          writing: '#f59e0b',    // Orange for Supported Writing
          independent: '#ef4444', // Red for Independent Writing
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}