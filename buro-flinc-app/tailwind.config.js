/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'flinc-orange': '#FF6B35',
                'flinc-blue': '#004E89',
                'flinc-lightblue': '#1A659E',
                'flinc-yellow': '#FFB81C',
                'flinc-gray': '#F5F5F5',
                'flinc-darkgray': '#2C3E50',
                'flinc-pink': '#E91E63',
            },
            backgroundImage: {
                'flinc-gradient': 'linear-gradient(135deg, #004E89 40%, #E91E63)',
            }
        },
    },
    plugins: [],
}

