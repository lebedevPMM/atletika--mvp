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

                // Theme tokens (via CSS custom properties)
                t: {
                    bg: 'var(--t-bg)',
                    'bg-elevated': 'var(--t-bg-elevated)',
                    'bg-surface': 'var(--t-bg-surface)',
                    'bg-sunken': 'var(--t-bg-sunken)',
                    text: 'var(--t-text-primary)',
                    'text-secondary': 'var(--t-text-secondary)',
                    'text-muted': 'var(--t-text-muted)',
                    accent: 'var(--t-accent)',
                    'accent-secondary': 'var(--t-accent-secondary)',
                    border: 'var(--t-border)',
                    success: 'var(--t-success)',
                    warning: 'var(--t-warning)',
                    error: 'var(--t-error)',
                    info: 'var(--t-info)',
                    'nav-bg': 'var(--t-nav-bg)',
                    'nav-border': 'var(--t-nav-border)',
                    'nav-active': 'var(--t-nav-active)',
                },
            },
            fontFamily: {
                display: ['Syne', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                'squircle': '24px', // Standard for cards
                'pill': '9999px',
                // Token-driven radii (tk- prefix to avoid conflict with Tailwind rounded-t-*)
                'tk-sm': 'var(--t-radius-sm)',     // badges, chips
                'tk-md': 'var(--t-radius-md)',     // buttons, avatars
                'tk-lg': 'var(--t-radius-lg)',     // cards, panels
                'tk-full': 'var(--t-radius-full)', // circles, pills
            },
            boxShadow: {
                'glass': '0 10px 40px rgba(0,0,0,0.8)',
                // Token-driven shadows
                'tk-card': 'var(--t-shadow-card)',
                'tk-nav': 'var(--t-shadow-nav)',
                'tk-glow': 'var(--t-shadow-glow)',
            },
            backgroundImage: {
                'void-gradient': 'radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 70%)',
            }
        },
    },
    plugins: [],
}
