import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Hand-drawn design system colors
        paper: "var(--paper)",
        pencil: "var(--pencil)",
        "ink-red": "var(--ink-red)",
        "ink-blue": "var(--ink-blue)",
        postit: "var(--postit)",
        erased: "var(--erased)",
      },
      fontFamily: {
        kalam: ["var(--font-kalam)", "Kalam", "cursive"],
        patrick: ["var(--font-patrick)", "Patrick Hand", "cursive"],
        heading: ["var(--font-kalam)", "Kalam", "cursive"],
        body: ["var(--font-patrick)", "Patrick Hand", "cursive"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        wobbly: "var(--wobbly)",
        "wobbly-md": "var(--wobbly-md)",
        "wobbly-sm": "var(--wobbly-sm)",
        "wobbly-circle": "var(--wobbly-circle)",
      },
      boxShadow: {
        hand: "var(--shadow)",
        "hand-sm": "var(--shadow-sm)",
        "hand-md": "var(--shadow-md)",
        "hand-lg": "var(--shadow-lg)",
        "hand-soft": "var(--shadow-soft)",
      },
      animation: {
        "bounce-gentle": "gentle-bounce 3s ease-in-out infinite",
        jiggle: "jiggle 0.3s ease-in-out",
        flash: "flash 1s ease-in-out",
        "thinking-gradient": "thinking-gradient 2s linear infinite",
      },
      keyframes: {
        "gentle-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        jiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-1deg)" },
          "75%": { transform: "rotate(1deg)" },
        },
      },
    },
  },
};

export default config;
