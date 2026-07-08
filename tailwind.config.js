import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
        "./resources/js/**/*.vue",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                // Modern Minimalist
                montserrat: ["Montserrat", "sans-serif"],
                display: ["Cormorant Garamond"],
                body: ["Plus Jakarta Sans"],
                poppins: ["Poppins", "sans-serif"],
                raleway: ["Raleway", "sans-serif"],
                inter: ["Inter", "sans-serif"],
                nunitoSans: ['"Nunito Sans"', "sans-serif"],
                urbanist: ["Urbanist", "sans-serif"],
                manrope: ["Manrope", "sans-serif"],
                outfit: ["Outfit", "sans-serif"],

                // Elegant & Luxury
                playfair: ['"Playfair Display"', "serif"],
                cormorant: ['"Cormorant Garamond"', "serif"],
                bodoni: ['"Bodoni Moda"', "serif"],
                cinzel: ["Cinzel", "serif"],
                marcellus: ["Marcellus", "serif"],

                // Futuristic
                orbitron: ["Orbitron", "sans-serif"],
                exo: ['"Exo 2"', "sans-serif"],
                rajdhani: ["Rajdhani", "sans-serif"],
                audiowide: ["Audiowide", "sans-serif"],
                quantico: ["Quantico", "sans-serif"],
                sarpanch: ["Sarpanch", "sans-serif"],

                // Friendly / Rounded
                quicksand: ["Quicksand", "sans-serif"],
                nunito: ["Nunito", "sans-serif"],
                kumbh: ['"Kumbh Sans"', "sans-serif"],
                mulish: ["Mulish", "sans-serif"],
                rubik: ["Rubik", "sans-serif"],

                // Bold & Strong
                anton: ["Anton", "sans-serif"],
                oswald: ["Oswald", "sans-serif"],
                bebas: ['"Bebas Neue"', "sans-serif"],
                worksans: ['"Work Sans"', "sans-serif"],
                barlow: ['"Barlow Condensed"', "sans-serif"],
            },
            colors: {
                gold: {
                    300: "#E8CF84",
                    400: "#D4B55B",
                    500: "#C9A84C",
                    600: "#A8882A",
                },
                navy: {
                    600: "#1A3A6B",
                    700: "#112850",
                    800: "#0B1E3D",
                    900: "#050E1F",
                    950: "#030B18",
                },
            },
        },
    },

    plugins: [forms, require("@tailwindcss/typography")],
};
