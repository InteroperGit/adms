import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { themePlugin } from './src/plugins/themePlugin'
import { imageResizePlugin } from './src/plugins/imageResizePlugin'
import { seoMetaPluginStub } from './src/plugins/seoMetaPlugin'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    themePlugin(),
    imageResizePlugin(),
    reactRouter(),
    tailwindcss(),
    seoMetaPluginStub(),
    mode === 'analyze' &&
      visualizer({ open: true, gzipSize: true, brotliSize: true, filename: 'build/client/stats.html' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@data': path.resolve(__dirname, './data/content'),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor',
              test: /[\\/](react|react-dom|react-router|zod)[\\/]/,
              priority: 20,
            },
            {
              name: 'icons',
              test: /[\\/]lucide-react[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
}))
