import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
        "2xl": "4rem",
      },
    },
    extend: {
      // Fonts are bound in layout with next/font; these names are fallbacks.
      fontFamily: {
        sans: ["var(--font-sans)"],
        heading: ["var(--font-heading)"],
      },
      colors: {
        // Semantic surfaces (read from CSS variables)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        page: "hsl(var(--page-bg))",
        ink: "hsl(var(--page-fg))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",

        // Brand system
        brand: {
          DEFAULT: "hsl(var(--brand))",
          hover: "hsl(var(--brand-hover))",
          border: "hsl(var(--brand-border))",
          foreground: "hsl(var(--brand-foreground))",
        },

        // Sky band used by Hero only
        skyband: {
          50: "hsl(var(--sky-50))",
          100: "hsl(var(--sky-100))",
          300: "hsl(var(--sky-300))",
          500: "hsl(var(--sky-500))",
          700: "hsl(var(--sky-700))",
          900: "hsl(var(--sky-900))",
        },

        // Status
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))",
      },
      borderRadius: {
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(var(--shadow)/0.12), 0 6px 20px hsl(var(--shadow)/0.12)",
        glass: "0 1px 2px hsl(var(--shadow)/0.10), 0 12px 30px hsl(var(--shadow)/0.18)",
      },
      transitionTimingFunction: {
        gentle: "var(--easing-gentle)",
      },
    },
  },
  plugins: [
    plugin(({ addComponents, theme }) => {
      // Small presets that compose with your globals.css classes.
      addComponents({
        // Base button skeleton. Combine with .btn-solid or .btn-glass from globals.css.
        ".btn": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          paddingInline: "1.125rem",
          paddingBlock: "0.625rem",
          borderRadius: "10px",
          fontFamily: theme("fontFamily.heading").join(", "),
          fontWeight: "600",
          letterSpacing: "0.02em",
          transitionProperty: "transform, box-shadow, background-color, border-color, color",
          transitionDuration: "200ms",
          transitionTimingFunction: theme("transitionTimingFunction.gentle"),
          boxShadow: theme("boxShadow.soft"),
        },

        // Ghost text button for nav links that needs a hover state like Bravera.
        ".btn-ghost": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.375rem",
          paddingInline: "0.5rem",
          paddingBlock: "0.375rem",
          borderRadius: "8px",
          color: theme("colors.ink"),
          transitionProperty: "color, background-color, transform",
          transitionDuration: "150ms",
          transitionTimingFunction: theme("transitionTimingFunction.gentle"),
        },
        ".btn-ghost:hover": {
          transform: "translateY(-1px)",
          backgroundColor: "hsl(var(--glass-bg)/0.08)",
        },

        // Glass container helper for cards or header background.
        ".glass": {
          backgroundColor: "hsl(var(--glass-bg)/var(--glass-alpha))",
          backdropFilter: "saturate(160%) blur(var(--glass-blur))",
          WebkitBackdropFilter: "saturate(160%) blur(var(--glass-blur))",
          border: "1px solid hsl(var(--glass-bg)/var(--glass-border-alpha))",
          borderRadius: "calc(var(--radius) + 8px)",
          boxShadow: theme("boxShadow.glass"),
        },

        // Focus ring utility to apply on interactive wrappers when needed.
        ".focus-ring": {
          boxShadow: `0 0 0 3px ${theme("colors.ring")}`,
        },

        // Header shell that mirrors Bravera’s tidy spacing and blur.
        ".header-shell": {
          position: "sticky",
          top: "0",
          zIndex: "40",
          backdropFilter: "saturate(160%) blur(10px)",
          WebkitBackdropFilter: "saturate(160%) blur(10px)",
          backgroundColor: "hsl(var(--glass-bg)/0.6)",
          borderBottom: "1px solid hsl(var(--glass-bg)/0.15)",
        },

        // Nav list with balanced gaps. Use with justify-between container.
        ".nav-list": {
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        },

        // Language toggle wrapper so it matches nav rhythm.
        ".lang-toggle": {
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          paddingInline: "0.375rem",
          paddingBlock: "0.25rem",
          borderRadius: "8px",
          border: "1px solid hsl(var(--glass-bg)/0.15)",
          backgroundColor: "hsl(var(--glass-bg)/0.08)",
        },
      });
    }),
  ],
} satisfies Config;
