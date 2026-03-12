import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// Activates vite-react-ssg's 'ssgOptions' type augmentation for UserConfig
import 'vite-react-ssg'
import { themePlugin } from './src/plugins/themePlugin'
import { buildIncludedRoutes, createSsgMetaHook } from './src/plugins/ssgMetaPlugin'
import { imageResizePlugin } from './src/plugins/imageResizePlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [themePlugin(), imageResizePlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@data': path.resolve(__dirname, './data/content'),
    },
  },
  ssgOptions: {
    dirStyle: 'nested',
    onPageRendered: createSsgMetaHook(__dirname),
    includedRoutes: buildIncludedRoutes(__dirname),
  },
})
