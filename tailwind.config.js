/** @type {import('tailwindcss').Config} */
module.exports = {
  // Update to match your actual file paths for NativeWind classes
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
