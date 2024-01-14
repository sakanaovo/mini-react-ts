import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __DEV__: true,
    __EXPERIMENTAL__: true,
    __PROFILE__: true,
  },
});
