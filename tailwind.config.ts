import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f4ea",
          100: "#c9e9d2",
          200: "#a8d9b8",
          300: "#86c99f",
          400: "#65b985",
          500: "#43a96b", // Deep forest / Islamic green
          600: "#368c57",
          700: "#2a6f43",
          800: "#1e5230",
          900: "#12351d",
        },
        secondary: {
          50: "#fdfaf6",
          100: "#f9f3eb",
          200: "#f2e7d9",
          300: "#ebdac6",
          400: "#e4ceb3",
          500: "#ddc1a0", // Warm cream / ivory
          600: "#b19a7e",
          700: "#85735c",
          800: "#5a4d3a",
          900: "#2e2618",
        },
        accent: {
          50: "#fdf6eb",
          100: "#fbedd5",
          200: "#f9dfad",
          300: "#f7c285",
          400: "#f4a55c",
          500: "#f28833", // Muted gold / warm sand
          600: "#c26d29",
          700: "#925320",
          800: "#623816",
          900: "#321d0c",
        },
        supporting: {
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d", // Soft charcoal
          600: "#566266",
          700: "#404d52",
          800: "#2a3840",
          900: "#14232e",
        },
        background: {
          50: "#ffffff",
          100: "#fdfaf6",
          200: "#f9f3eb",
          300: "#f2e7d9",
          400: "#ebdac6",
          500: "#e4ceb3", // Off-white / ivory
          600: "#b69a87",
          700: "#89766a",
          800: "#5d5148",
          900: "#312b2a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
      },
      fontSize: {
        display: "clamp(3.5rem, 8vw, 5rem)",
        hero: "clamp(2.75rem, 6vw, 4rem)",
        section: "clamp(2rem, 4vw, 3rem)",
        productTitle: "clamp(1.25rem, 2vw, 1.75rem)",
        caption: "clamp(0.8125rem, 1vw, 0.875rem)",
      },
      borderRadius: {
        sm: "0.25rem", // 4px
        md: "0.5rem", // 8px
        lg: "0.75rem", // 12px
        xl: "1rem", // 16px
        "2xl": "1.5rem", // 24px
        "3xl": "2rem", // 32px
      },
      spacing: {
        1: "0.25rem", // 4px
        2: "0.5rem", // 8px
        3: "0.75rem", // 12px
        4: "1rem", // 16px
        5: "1.25rem", // 20px
        6: "1.5rem", // 24px
        7: "1.75rem", // 28px
        8: "2rem", // 32px
        9: "2.25rem", // 36px
        10: "2.5rem", // 40px
        12: "3rem", // 48px
        14: "3.5rem", // 56px
        16: "4rem", // 64px
        20: "5rem", // 80px
        24: "6rem", // 96px
        28: "7rem", // 112px
        32: "8rem", // 128px
      },
    },
  },
  plugins: [],
} satisfies Config;
