import type { Config } from "tailwindcss";
import pxToRem from "tailwindcss-preset-px-to-rem";

const config: Config = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // 'media' 또는 'class'로 설정 가능
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [],
  presets: [pxToRem] // pxToRem 프리셋 추가
};

export default config;
