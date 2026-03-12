import { createHash } from 'crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import type { Plugin, ResolvedConfig } from 'vite';
// Re-export pure helper so vite.config consumers can use it without importing lib/
export { resolveImageSrcSet } from '../lib/imageSrcSet';

interface ImageOptimizationConfig {
  widths: number[];
  quality: number;
  format: string;
}

// Maps relative input path → SHA-256 hash of source file content
type CacheManifest = Record<string, string>;

function fileHash(filePath: string): string {
  const content = readFileSync(filePath);
  return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

const IMAGE_EXT_RE = /\.(jpe?g|png|gif|tiff?|avif)$/i;

function findImages(dir: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) {
    return results;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === '_optimized') {
        continue;
      }
      results.push(...findImages(path.join(dir, entry.name)));
    } else if (IMAGE_EXT_RE.test(entry.name)) {
      results.push(path.join(dir, entry.name));
    }
  }
  return results;
}

export function imageResizePlugin(): Plugin {
  let resolvedConfig: ResolvedConfig;
  let imgConfig: ImageOptimizationConfig = {
    widths: [320, 640, 960, 1280, 1920],
    quality: 82,
    format: 'webp',
  };

  return {
    name: 'vite-plugin-image-resize',

    configResolved(config) {
      resolvedConfig = config;
      const siteJsonPath = path.resolve(config.root, 'data/content/config/site.json');
      if (existsSync(siteJsonPath)) {
        const site = JSON.parse(readFileSync(siteJsonPath, 'utf-8')) as {
          imageOptimization?: Partial<ImageOptimizationConfig>;
        };
        if (site.imageOptimization) {
          imgConfig = { ...imgConfig, ...site.imageOptimization };
        }
      }
    },

    async buildStart() {
      // Only run during SSG build — dev server startup is unaffected
      if (resolvedConfig.command !== 'build') {
        return;
      }

      const publicImagesDir = path.resolve(resolvedConfig.root, 'public/images');
      const optimizedDir = path.resolve(publicImagesDir, '_optimized');
      const manifestPath = path.resolve(optimizedDir, '.cache.json');

      if (!existsSync(publicImagesDir)) {
        return;
      }

      let manifest: CacheManifest = {};
      if (existsSync(manifestPath)) {
        manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as CacheManifest;
      }

      const images = findImages(publicImagesDir);
      if (images.length === 0) {
        return;
      }

      const { default: sharp } = await import('sharp');

      let updatedCount = 0;
      for (const imagePath of images) {
        const relPath = path.relative(publicImagesDir, imagePath).replace(/\\/g, '/');
        const hash = fileHash(imagePath);

        if (manifest[relPath] === hash) {
          continue;
        }

        const dotIdx = relPath.lastIndexOf('.');
        const relNoExt = dotIdx !== -1 ? relPath.slice(0, dotIdx) : relPath;

        for (const width of imgConfig.widths) {
          const outRelPath = `${relNoExt}-${width}w.webp`;
          const outPath = path.resolve(optimizedDir, outRelPath);
          mkdirSync(path.dirname(outPath), { recursive: true });
          await sharp(imagePath)
            .resize(width, null, { withoutEnlargement: true })
            .webp({ quality: imgConfig.quality })
            .toFile(outPath);
        }

        manifest[relPath] = hash;
        updatedCount++;
        console.log(`[image-resize] Processed: ${relPath}`);
      }

      if (updatedCount > 0) {
        mkdirSync(optimizedDir, { recursive: true });
        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log(`[image-resize] ${updatedCount} image(s) processed, cache updated.`);
      } else {
        console.log(`[image-resize] All ${images.length} image(s) are up-to-date, skipping.`);
      }
    },
  };
}
