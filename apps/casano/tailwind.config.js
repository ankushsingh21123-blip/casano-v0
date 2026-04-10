/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                navy: { DEFAULT: '#1A1A2E', light: '#2A2A4E', dark: '#0F0F1E' },
                orange: { DEFAULT: '#E07B39', hover: '#C96A2F', light: '#F5E6D9' },
                bg: '#FAFAF8',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                card: '12px',
                btn: '8px',
            },
            boxShadow: {
                card: '0 2px 8px rgba(26, 26, 46, 0.06)',
                'card-hover': '0 4px 16px rgba(26, 26, 46, 0.08)',
                soft: '0 1px 2px rgba(26, 26, 46, 0.04)',
            },
            animation: {
                'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
                'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
                'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
                'bounce-in': 'bounceIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
            },
            keyframes: {
                fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
                fadeInUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                slideUp: { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
                scaleIn: { from: { opacity: 0, transform: 'scale(0.9)' }, to: { opacity: 1, transform: 'scale(1)' } },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: 0 },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                },
            },
        },
    },
    plugins: [],
}
