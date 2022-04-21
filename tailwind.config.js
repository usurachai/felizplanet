module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                star: "url('/images/bg/wp2863958.webp')",
            },
            animation: {
                astronaut: "astronaut 6s infinite",
                stardust: "stardust 6s",
                ingredient: "ingredient 3s infinite",
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
                stardust: {
                    "0%": {
                        transform: "translate(0px, 0px)",
                    },
                    "100%": {
                        transform: "translate(190px, 110px)",
                    },
                },
                ingredient: {
                    "0%": {
                        transform: "translate(0px, 0px)",
                    },
                    "50%": {
                        transform: "translatey(50px)",
                    },
                    "100%": {
                        transform: "translate(120px, 120px)",
                    },
                },
            },
            fontFamily: {
                badabb: ["badabb"],
                patron: ["patron"],
            },
        },
    },
    plugins: [],
};
