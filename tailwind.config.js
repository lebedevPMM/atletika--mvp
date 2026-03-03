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

                // Neon Accents (legacy, kept for compatibility)
                'neon-lime': '#D2FF00',
                'neon-lavender': '#E6E6FA',
                'neon-purple': '#B8A9FB',

                // Ember Palette
                'ember-bg': '#080808',
                'ember-surface': '#111111',
                'ember-raised': '#1a1a1a',
                'ember-accent': '#ff4d00',
                'ember-dim': '#8a2be2',
                'ember-text': '#e0e0e0',
                'ember-muted': '#666666',

                // Semantic
                'glass-panel': 'rgba(20, 20, 25, 0.6)',
                'glass-highlight': 'rgba(255, 255, 255, 0.05)',
            },
            fontFamily: {
                display: ['Syne', 'sans-serif'],
                ember: ['Rajdhani', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                'squircle': '24px',
                'pill': '9999px',
            },
            boxShadow: {
                'neon-lime': '0 0 20px rgba(210, 255, 0, 0.6), 0 0 40px rgba(210, 255, 0, 0.3), 0 0 10px rgba(210, 255, 0, 0.8)',
                'ember-glow': '0 0 15px rgba(255,77,0,0.4), 0 0 5px rgba(255,77,0,0.8)',
                'ember-bezel': 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.6)',
                'glass': '0 10px 40px rgba(0,0,0,0.8)',
            },
            backgroundImage: {
                'void-gradient': 'radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 70%)',
                'ember-gradient': 'radial-gradient(ellipse at 50% -20%, rgba(255,77,0,0.08) 0%, transparent 60%)',
            }
        },
    },
    plugins: [],
}
