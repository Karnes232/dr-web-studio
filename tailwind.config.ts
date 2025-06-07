// tailwind.config.ts
import type { Config } from "tailwindcss"

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Gradient from classes
    "from-orange-400",
    "from-orange-500",
    "from-orange-600",
    "from-teal-500",
    "from-teal-600",
    "from-purple-500",
    "from-purple-600",
    "from-blue-400",
    "from-blue-500",
    "from-blue-600",
    "from-yellow-500",
    "from-yellow-600",
    "from-pink-500",
    "from-pink-600",
    // Gradient to classes
    "to-orange-400",
    "to-orange-500",
    "to-orange-600",
    "to-teal-500",
    "to-teal-600",
    "to-purple-500",
    "to-purple-600",
    "to-blue-500",
    "to-blue-600",
    "to-yellow-500",
    "to-yellow-600",
    "to-pink-500",
    "to-pink-600",
    "to-indigo-500",
    "to-indigo-600",
    "to-indigo-800",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        crimsonPro: ["var(--font-crimson-pro)", "serif"],
      },
    },
  },
  plugins: [],
}

export default config
