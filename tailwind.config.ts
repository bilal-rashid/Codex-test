import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1f6feb",
          dark: "#1b5ac3"
        }
      }
    }
  },
  plugins: []
};

export default config;
