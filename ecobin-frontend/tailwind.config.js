/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          lightBg: '#F4F7F4', 
          darkBg: '#0A120D',   
          forest: '#132A13',   
          emerald: '#31572C',  
          mint: '#4F772D',     
          sage: '#90A955',     
          earth: '#ECF39E',    
          charcoal: '#1C251F'  
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}