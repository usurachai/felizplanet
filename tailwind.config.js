module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                star: "url('/images/bg/wp2863958.webp')",
                alien: "url('/Bg-web.jpg')",
            },
            animation: {
                astronaut: "astronaut 6s infinite",
                stardust: "stardust 6s",
                stardust_xs: "stardust_xs 6s",
                ingredient: "ingredient 2s infinite",
                ingredient_xs: "ingredient_xs 2s infinite",
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
                stardust_xs: {
                    "0%": {
                        transform: "translate(0px, 0px)",
                    },
                    "100%": {
                        transform: "translate(110px, 70px)",
                    },
                },
                ingredient: {
                    "0%": {
                        transform: "translate(0px, -50px)",
                    },
                    "25%": {
                        transform: "translatey(50px)",
                    },
                    "50%": {
                        transform: "translate(50px, 80px)",
                    },
                    "100%": {
                        transform: "translate(120px, 120px)",
                    },
                },
                ingredient_xs: {
                    "0%": {
                        transform: "translate(0px, 0px)",
                    },
                    "25%": {
                        transform: "translatey(40px)",
                    },
                    "50%": {
                        transform: "translate(30px, 60px)",
                    },
                    "100%": {
                        transform: "translate(90px, 90px)",
                    },
                },
            },
            fontFamily: {
                badabb: ["badabb"],
                patron: ["patron"],
                digi: ["digi"],
                monoid: ["monoid"],
                sfmono: ["sfmono"],
            },
            fontSize: {
                xs: "0.75rem",
                "1_3vw": "1.3vw",
            },
            height: {
                "10vw": "10vw",
                "20vw": "20vw",
                "30vw": "30vw",
            },
        },
    },
    plugins: [],
};
