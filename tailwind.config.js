/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "var(--brand)", hover: "var(--brand-hover)" },
        glass: {
          bg: "var(--glass-bg)",
          "bg-intense": "var(--glass-bg-intense)",
          "bg-subtle": "var(--glass-bg-subtle)",
          border: "var(--glass-border)",
          "border-intense": "var(--glass-border-intense)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        success: { DEFAULT: "var(--success)", bg: "var(--success-bg)" },
        warning: { DEFAULT: "var(--warning)", bg: "var(--warning-bg)" },
        danger: { DEFAULT: "var(--danger)", bg: "var(--danger-bg)" },
      },
      borderRadius: {
        radius: "12px",
        "radius-lg": "16px",
        "radius-xl": "20px",
      },
      boxShadow: {
        "glass-sm": "var(--shadow-sm)",
        glass: "var(--shadow)",
        "glass-lg": "var(--shadow-lg)",
        "glass-xl": "var(--shadow-xl)",
      },
    },
  },
  plugins: [],
};
