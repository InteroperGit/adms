import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
// Activates vite-react-ssg's 'ssgOptions' type augmentation for UserConfig
import 'vite-react-ssg'
import { themePlugin } from './src/plugins/themePlugin'
import { buildIncludedRoutes, createSsgMetaHook } from './src/plugins/ssgMetaPlugin'
import { imageResizePlugin } from './src/plugins/imageResizePlugin'
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    themePlugin(),
    imageResizePlugin(),
    react(),
    tailwindcss(),
    mode === 'analyze' &&
      visualizer({ open: true, gzipSize: true, brotliSize: true, filename: 'dist/stats.html' }),
    {
      name: 'copy-404-html',
      apply: 'build',
      enforce: 'post',
      closeBundle() {
        const source = path.resolve(__dirname, 'dist/404/index.html')
        const dest = path.resolve(__dirname, 'dist/404.html')
        try {
          copyFileSync(source, dest)
        } catch {
          // 404/index.html may not exist if SSG didn't generate it; ignore
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@data': path.resolve(__dirname, './data/content'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router-dom/') ||
            id.includes('/zod/')
          ) {
            return 'vendor';
          }
          if (id.includes('/lucide-react/')) {
            return 'icons';
          }
        },
      },
    },
  },
  ssgOptions: {
    dirStyle: 'nested',
    onPageRendered: createSsgMetaHook(__dirname),
    includedRoutes: buildIncludedRoutes(__dirname),
  },
}))
