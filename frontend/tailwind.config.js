/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode color palette
        dark: {
          bg: '#292828',      // Main background
          highlight: '#49a2d4', // Highlight/accent color
          text: '#ffffff',    // Main text color
          secondary: '#a6a6a6', // Soft grey for secondary text
          lighter: '#3a3939', // Slightly lighter than main bg
          border: '#404040',  // Border color
        },
        primary: {
          50: '#e1f4ff',
          100: '#b3e4ff',
          200: '#80d2ff',
          300: '#4dc0ff',
          400: '#49a2d4',
          500: '#49a2d4',
          600: '#3a82aa',
          700: '#2a6180',
          800: '#1a4156',
          900: '#0a202c',
        },
        // Add direct color reference
        accent: '#49a2d4',
        framework: {
          field: '#10b981',      // Green for Field Building
          reading: '#49a2d4',    // Using highlight blue for Supported Reading  
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
  plugins: [
    require('@tailwindcss/typography'),
  ],
}