module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                star: "url('/images/bg/m_roadmap.png')",
            },
            animation: {
                astronaut: "astronaut 6s infinite",
                box: "box 6s infinite",
            },
            keyframes: {
                astronaut: {
                    "0%": {
                        transform: "translatey(-70px)",
                    },
                    "50%": {
                        transform: "translatey(-10px)",
                    },
                    "100%": {
                        transform: "translatey(-70px)",
                    },
                },
            },
        },
    },
    plugins: [],
};
