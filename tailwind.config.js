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
                'glass': '0 10px 40px rgba(0,0,0,0.8)',
            },
            backgroundImage: {
                'void-gradient': 'radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 70%)',
            }
        },
    },
    plugins: [],
}
