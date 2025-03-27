
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  important: '#root',
  theme: {
    extend: {
      colors: {
        primary: "#C20E1A",
        secondary: "#575757",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  // corePlugins: {
  //   // Remove the Tailwind CSS preflight styles so it can use Material UI's preflight instead (CssBaseline).
  //   preflight: false,
  // },
  plugins: [],
} 
