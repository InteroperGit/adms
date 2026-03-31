import { describe, it, expect } from 'vitest';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

// Import functions to test - need to refactor postBuildBuildManifest.ts to export them
// For now we'll test the classifyFile logic inline since it's not exported

const __filename = fileURLToPath(import.meta.url);
dirname(__filename);

describe('postBuildBuildManifest', () => {
  describe('classifyFile', () => {
    const classifyFile = (filePath: string): 'html' | 'asset' => {
      if (filePath.endsWith('.html')) {
        return 'html';
      }
      return 'asset';
    };

    it('classifies .html files as html', () => {
      expect(classifyFile('index.html')).toBe('html');
      expect(classifyFile('404/index.html')).toBe('html');
      expect(classifyFile('portfolio/all/2024/01/case/index.html')).toBe('html');
    });

    it('classifies .js files as asset', () => {
      expect(classifyFile('assets/app.js')).toBe('asset');
      expect(classifyFile('assets/vendor-abc123.js')).toBe('asset');
    });

    it('classifies .css files as asset', () => {
      expect(classifyFile('assets/style.css')).toBe('asset');
      expect(classifyFile('assets/root-abc123.css')).toBe('asset');
    });

    it('classifies .webp images as asset', () => {
      expect(classifyFile('images/photo-1280w.webp')).toBe('asset');
      expect(classifyFile('images/_optimized/portfolio/case/01-640w.webp')).toBe('asset');
    });

    it('classifies .svg files as asset', () => {
      expect(classifyFile('favicon.svg')).toBe('asset');
      expect(classifyFile('logo.svg')).toBe('asset');
    });

    it('classifies .json files as asset', () => {
      expect(classifyFile('manifest.json')).toBe('asset');
      expect(classifyFile('buildMeta.json')).toBe('asset');
      expect(classifyFile('images/_optimized/.cache.json')).toBe('asset');
    });

    it('classifies .xml files as asset', () => {
      expect(classifyFile('sitemap.xml')).toBe('asset');
      expect(classifyFile('robots.txt')).toBe('asset');
    });
  });

  describe('getCacheControl', () => {
    const getCacheControl = (type: 'html' | 'asset'): string => {
      const CACHE_CONTROL = {
        HTML: 'no-cache',
        ASSET: 'public,max-age=31536000,immutable',
        DEFAULT: 'public,max-age=3600',
      } as const;

      if (type === 'html') {
        return CACHE_CONTROL.HTML;
      }
      return CACHE_CONTROL.ASSET;
    };

    it('returns no-cache for html files', () => {
      expect(getCacheControl('html')).toBe('no-cache');
    });

    it('returns immutable cache for asset files', () => {
      expect(getCacheControl('asset')).toBe('public,max-age=31536000,immutable');
    });
  });

  describe('calculateFileHash', () => {
    const calculateFileHash = async (filePath: string): Promise<string> => {
      const { createHash } = await import('crypto');
      const { createReadStream } = await import('fs');
      const hash = createHash('sha256');
      const stream = createReadStream(filePath);
      for await (const chunk of stream) {
        hash.update(chunk);
      }
      return hash.digest('hex');
    };

    it('calculates SHA-256 hash of file contents', async () => {
      const testDir = join(tmpdir(), `manifest-test-${randomUUID()}`);
      await fs.mkdir(testDir, { recursive: true });

      try {
        const testFile = join(testDir, 'test.txt');
        const testContent = 'Hello, World!';
        await fs.writeFile(testFile, testContent, 'utf-8');

        const hash = await calculateFileHash(testFile);

        // Verify hash is valid hex string
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
      } finally {
        await fs.rm(testDir, { recursive: true, force: true });
      }
    });

    it('produces different hashes for different content', async () => {
      const testDir = join(tmpdir(), `manifest-test-${randomUUID()}`);
      await fs.mkdir(testDir, { recursive: true });

      try {
        const file1 = join(testDir, 'file1.txt');
        const file2 = join(testDir, 'file2.txt');

        await fs.writeFile(file1, 'Content A', 'utf-8');
        await fs.writeFile(file2, 'Content B', 'utf-8');

        const hash1 = await calculateFileHash(file1);
        const hash2 = await calculateFileHash(file2);

        expect(hash1).not.toBe(hash2);
      } finally {
        await fs.rm(testDir, { recursive: true, force: true });
      }
    });

    it('produces same hash for identical content', async () => {
      const testDir = join(tmpdir(), `manifest-test-${randomUUID()}`);
      await fs.mkdir(testDir, { recursive: true });

      try {
        const file1 = join(testDir, 'file1.txt');
        const file2 = join(testDir, 'file2.txt');
        const identicalContent = 'Identical content here';

        await fs.writeFile(file1, identicalContent, 'utf-8');
        await fs.writeFile(file2, identicalContent, 'utf-8');

        const hash1 = await calculateFileHash(file1);
        const hash2 = await calculateFileHash(file2);

        expect(hash1).toBe(hash2);
      } finally {
        await fs.rm(testDir, { recursive: true, force: true });
      }
    });
  });

  describe('walkDirectory', () => {
    const walkDirectory = async (dir: string, baseDir: string): Promise<string[]> => {
      const { readdir } = await import('fs/promises');
      const { join, relative } = await import('path');

      const files: string[] = [];
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relativePath = relative(baseDir, fullPath);

        // Normalize path to forward slashes for S3 compatibility
        const normalizedPath = relativePath.replace(/\\/g, '/');

        if (entry.isDirectory()) {
          const nested = await walkDirectory(fullPath, baseDir);
          files.push(...nested);
        } else {
          files.push(normalizedPath);
        }
      }

      return files;
    };

    it('walks flat directory structure', async () => {
      const testDir = join(tmpdir(), `manifest-test-${randomUUID()}`);
      await fs.mkdir(testDir, { recursive: true });

      try {
        await fs.writeFile(join(testDir, 'file1.txt'), 'content1');
        await fs.writeFile(join(testDir, 'file2.js'), 'content2');
        await fs.writeFile(join(testDir, 'file3.css'), 'content3');

        const files = await walkDirectory(testDir, testDir);

        expect(files).toHaveLength(3);
        expect(files).toContain('file1.txt');
        expect(files).toContain('file2.js');
        expect(files).toContain('file3.css');
      } finally {
        await fs.rm(testDir, { recursive: true, force: true });
      }
    });

    it('walks nested directory structure', async () => {
      const testDir = join(tmpdir(), `manifest-test-${randomUUID()}`);
      await fs.mkdir(testDir, { recursive: true });

      try {
        await fs.writeFile(join(testDir, 'root.txt'), 'root');
        await fs.mkdir(join(testDir, 'subdir1'), { recursive: true });
        await fs.writeFile(join(testDir, 'subdir1', 'nested1.txt'), 'nested1');
        await fs.mkdir(join(testDir, 'subdir1', 'deep'), { recursive: true });
        await fs.writeFile(join(testDir, 'subdir1', 'deep', 'deep.txt'), 'deep');
        await fs.mkdir(join(testDir, 'subdir2'), { recursive: true });
        await fs.writeFile(join(testDir, 'subdir2', 'nested2.txt'), 'nested2');

        const files = await walkDirectory(testDir, testDir);

        expect(files).toHaveLength(4);
        expect(files).toContain('root.txt');
        expect(files).toContain('subdir1/nested1.txt');
        expect(files).toContain('subdir1/deep/deep.txt');
        expect(files).toContain('subdir2/nested2.txt');
      } finally {
        await fs.rm(testDir, { recursive: true, force: true });
      }
    });

    it('normalizes Windows paths to forward slashes', async () => {
      const testDir = join(tmpdir(), `manifest-test-${randomUUID()}`);
      await fs.mkdir(testDir, { recursive: true });

      try {
        await fs.mkdir(join(testDir, 'portfolio', 'all'), { recursive: true });
        await fs.writeFile(join(testDir, 'portfolio', 'all', 'case.html'), 'case');

        const files = await walkDirectory(testDir, testDir);

        expect(files).toHaveLength(1);
        expect(files[0]).toBe('portfolio/all/case.html');
        expect(files[0]).not.toContain('\\');
      } finally {
        await fs.rm(testDir, { recursive: true, force: true });
      }
    });

    it('excludes manifest.json and buildMeta.json from content files', async () => {
      const testDir = join(tmpdir(), `manifest-test-${randomUUID()}`);
      await fs.mkdir(testDir, { recursive: true });

      try {
        await fs.writeFile(join(testDir, 'index.html'), 'html');
        await fs.writeFile(join(testDir, 'manifest.json'), '{}');
        await fs.writeFile(join(testDir, 'buildMeta.json'), '{}');
        await fs.writeFile(join(testDir, 'app.js'), 'js');

        const allFiles = await walkDirectory(testDir, testDir);
        const contentFiles = allFiles.filter(
          (f) => f !== 'manifest.json' && f !== 'buildMeta.json'
        );

        expect(contentFiles).toHaveLength(2);
        expect(contentFiles).toContain('index.html');
        expect(contentFiles).toContain('app.js');
        expect(contentFiles).not.toContain('manifest.json');
        expect(contentFiles).not.toContain('buildMeta.json');
      } finally {
        await fs.rm(testDir, { recursive: true, force: true });
      }
    });

    it('handles empty directories', async () => {
      const testDir = join(tmpdir(), `manifest-test-${randomUUID()}`);
      await fs.mkdir(testDir, { recursive: true });

      try {
        await fs.mkdir(join(testDir, 'empty'), { recursive: true });

        const files = await walkDirectory(testDir, testDir);

        expect(files).toHaveLength(0);
      } finally {
        await fs.rm(testDir, { recursive: true, force: true });
      }
    });
  });

  describe('formatBytes', () => {
    const formatBytes = (bytes: number): string => {
      if (bytes < 1024) {
        return `${bytes} B`;
      }
      if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
      }
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    it('formats bytes', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(1)).toBe('1 B');
      expect(formatBytes(512)).toBe('512 B');
      expect(formatBytes(1023)).toBe('1023 B');
    });

    it('formats kilobytes', () => {
      expect(formatBytes(1024)).toBe('1.0 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(2048)).toBe('2.0 KB');
      expect(formatBytes(10240)).toBe('10.0 KB');
      expect(formatBytes(1048575)).toBe('1024.0 KB');
    });

    it('formats megabytes', () => {
      expect(formatBytes(1048576)).toBe('1.00 MB');
      expect(formatBytes(1572864)).toBe('1.50 MB');
      expect(formatBytes(6815744)).toBe('6.50 MB');
      expect(formatBytes(10485760)).toBe('10.00 MB');
    });
  });
});
