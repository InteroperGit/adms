import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { readdirSync, existsSync, readFileSync } from 'fs'
// Activates vite-react-ssg's 'ssgOptions' type augmentation for UserConfig
import 'vite-react-ssg'
import { themePlugin } from './src/plugins/themePlugin'
import categoriesRaw from './data/config/categories.json'

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
      const caseFiles = existsSync(dir)
        ? readdirSync(dir).filter((f) => f.endsWith('.json'))
        : []

      const cases = caseFiles.map((f) => {
        const data = JSON.parse(readFileSync(path.join(dir, f), 'utf-8')) as {
          slug: string
          category: string
        }
        return data
      })

      const catSlugs = ['all', ...(categoriesRaw as { slug: string }[]).map((c) => c.slug)]

      // Category listing pages: /portfolio/all, /portfolio/branding, …
      const categoryRoutes = catSlugs.map((s) => `/portfolio/${s}`)

      // Case pages nested under each category context
      const caseRoutes: string[] = []
      for (const c of cases) {
        caseRoutes.push(`/portfolio/all/${c.slug}`)
        const catSlug = (categoriesRaw as { name: string; slug: string }[]).find(
          (cat) => cat.name === c.category,
        )?.slug
        if (catSlug) caseRoutes.push(`/portfolio/${catSlug}/${c.slug}`)
      }

      return [
        ...paths.filter(
          (p) =>
            p !== '/portfolio/:slug' &&
            p !== '/portfolio/:categorySlug' &&
            p !== '/portfolio/:categorySlug/:caseSlug' &&
            p !== '/portfolio',
        ),
        '/portfolio',
        ...categoryRoutes,
        ...caseRoutes,
      ]
    },
  },
})
