import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // server: {
  //   https: {
  //     key: './dev.local+4-key.pem',
  //     cert: './dev.local+4.pem'
  //   }
  // }
})
