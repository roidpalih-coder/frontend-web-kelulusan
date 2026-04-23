import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],

  runtimeConfig: {
    public: {
      apiUrl: process.env.VITE_PUBLIC_API_URL || "http://localhost:3000"
    }
  },

  server: {
    host: true
  }
})
