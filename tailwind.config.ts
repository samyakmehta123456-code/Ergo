import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ergo: {
          bg: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
          hover: "#F1F5F9",
          text: "#0F172A",
          muted: "#64748B",
          primary: "#3559E0",
          red: "#E84E4E",
          blue: "#6A99D4",
          pink: "#E68BA2",
          green: "#5BB876",
          yellow: "#F4C447",
          royal: "#3559E0",
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};

export default config;
