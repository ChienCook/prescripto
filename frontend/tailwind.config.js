/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            // prettier-ignore
            colors: {
                'primary': "#5f6FFF",
            },
        },
    },
    plugins: [],
};
