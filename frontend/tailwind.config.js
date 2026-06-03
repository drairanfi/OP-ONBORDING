/** @type {import('tailwindcss').Config} */
// Tokens de OP Brand Guideline mapeados a Tailwind.
// colors.md → superficies level_0..6, op_blue, transparencias.

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        // typography.md → Mulish única fuente
        sans: ["Mulish", "sans-serif"],
      },
      colors: {
        // colors.md: superficies
        level: {
          0: "#000000",
          1: "#080808",  // canvas base
          2: "#0D0D0D",  // card bg
          3: "#131313",
          4: "#191919",
          5: "#202020",
          6: "#3B3B3B",
        },
        // colors.md: OP Blue
        op: {
          50:  "#F6F8FF",
          100: "#F0F3FE",
          200: "#DCE3FD",
          300: "#C1CFFC",
          400: "#97B1F9",
          500: "#6689F4",
          600: "#4361EF",  // PRINCIPAL / CTA
          700: "#2C40E4",  // hover
          800: "#242DD1",
          900: "#2327AA",  // active
          950: "#191A52",
        },
        // colors.md: texto sobre cada nivel
        txt: {
          primary:   "#FFFFFF",
          secondary: "#F5F5F5",
          tertiary:  "#DCDCDC",
          muted:     "#8C8C8C",
          subtle:    "#6E6E6E",
          disabled:  "#545454",
          divider:   "#3B3B3B",
        },
      },
      transitionTimingFunction: {
        // motion.md
        "op-ui":       "cubic-bezier(0.2, 0, 0, 1)",         // fast/standard
        "op-premium":  "cubic-bezier(0.16, 1, 0.3, 1)",      // slow
        "op-story":    "cubic-bezier(0, 0, 0.58, 1)",        // editorial
      },
      transitionDuration: {
        // motion.md
        fast:     "120ms",
        standard: "300ms",
        slow:     "400ms",
        story:    "600ms",
      },
      borderRadius: {
        // radius-strokes.md (sample típico)
        "op-sm": "8px",
        "op-md": "10px",
        "op-lg": "12px",
        "op-xl": "16px",
        "op-2xl": "20px",
      },
      boxShadow: {
        "op-glow": "0 0 40px rgba(67, 97, 239, 0.4)",
        "op-card": "0 12px 32px rgba(0, 0, 0, 0.5)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: 0, transform: "translateY(-12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        bounce3: {
          "0%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-5px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 0.4 },
          "50%": { opacity: 0.8 },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 300ms cubic-bezier(0.2, 0, 0, 1)",
        slideDown: "slideDown 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        bounce3: "bounce3 1s ease-in-out infinite",
        pulseSoft: "pulseSoft 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
