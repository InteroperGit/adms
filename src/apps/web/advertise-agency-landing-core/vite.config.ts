import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { readdirSync, existsSync } from 'fs'
// Activates vite-react-ssg's 'ssgOptions' type augmentation for UserConfig
import 'vite-react-ssg'
import { themePlugin } from './src/plugins/themePlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [themePlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@data': path.resolve(__dirname, './data'),
    },
  },
  ssgOptions: {
    dirStyle: 'nested',
    includedRoutes(paths) {
      const dir = path.resolve(__dirname, 'data/portfolio')
      const slugs = existsSync(dir)
        ? readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''))
        : []
      return [...paths.filter((p) => p !== '/portfolio/:slug'), ...slugs.map((s) => `/portfolio/${s}`)]
    },
  },
})
