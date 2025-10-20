import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Keep container but DON'T add padding by default.
    container: { center: true, padding: "0rem" },

    extend: {
      // Fonts bound via next/font; map sans to DM Sans var for convenience.
      fontFamily: {
        sans: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui"],
      },

      // If you want a few shadows/radii as tokens (RGBA only)
      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.12)",
        glass: "0 1px 2px rgba(0,0,0,0.10), 0 12px 30px rgba(0,0,0,0.18)",
      },
      transitionTimingFunction: {
        gentle: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      // Minimal, readable utilities that match globals.css (HEX/RGBA only)
      addComponents({
        // Button skeleton (pairs with .btn-glass / .btn-solid from globals if you still use them)
        ".btn": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          paddingInline: "1.125rem",
          paddingBlock: "0.625rem",
          borderRadius: "10px",
          fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui",
          fontWeight: "600",
          letterSpacing: "0.02em",
          transitionProperty:
            "transform, box-shadow, background-color, border-color, color",
          transitionDuration: "200ms",
          transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.12)",
        },

        // Simple nav rhythm utility
        ".nav-list": {
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        },

        // Language toggle wrapper (transparent)
        ".lang-toggle": {
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          paddingInline: "0.375rem",
          paddingBlock: "0.25rem",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.15)",
          backgroundColor: "rgba(255,255,255,0.08)",
        },
      });
    }),
  ],
} satisfies Config;
