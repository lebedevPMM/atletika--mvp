/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./components/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // The Void Palette
                void: '#050505',
                'void-surface': '#121212',

                // Neon Accents
                'neon-lime': '#D2FF00',
                'neon-lavender': '#E6E6FA',
                'neon-purple': '#B8A9FB', // Saturated variant

                // Semantic
                'glass-panel': 'rgba(20, 20, 25, 0.6)',
                'glass-highlight': 'rgba(255, 255, 255, 0.05)',
            },
            fontFamily: {
                display: ['Syne', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                'squircle': '24px', // Standard for cards
                'pill': '9999px',
            },
            boxShadow: {
                'neon-lime': '0 0 20px rgba(210, 255, 0, 0.6), 0 0 40px rgba(210, 255, 0, 0.3), 0 0 10px rgba(210, 255, 0, 0.8)', // Stronger bloom
                'glass': '0 10px 40px rgba(0,0,0,0.8)',
            },
            backgroundImage: {
                'void-gradient': 'radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 70%)',
            }
        },
    },
    plugins: [],
}
