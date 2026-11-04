import { colors, frameworkColors, backgroundColor, boxShadow, ringColor, ringOffsetColor } from "./src/theme/tailwind.js";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: { ...frameworkColors, ...colors },
      backgroundColor,
      boxShadow,
      ringColor: { ...colors, ...ringColor },
      ringOffsetColor,
      animation: {
        float: "float 8s ease-in-out infinite",
        "fade-up": "fadeUp 0.9s ease both",
        "slide-in": "slideIn 0.8s ease both",
        marquee: "marquee 28s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -18px, 0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-22px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
