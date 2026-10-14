// Serve the isolated acceptance build on loopback; never use in production.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('output/playwright/task-080/dist');
const types = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml',
};
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(
      request.url, 'http://127.0.0.1:54382',
    ).pathname);
    const path = resolve(root, `.${pathname}`, pathname.endsWith('/')
      ? 'index.html' : '');
    if (!path.startsWith(root + sep)) throw new Error('Invalid path');
    const content = await readFile(path);
    response.writeHead(200, { 'Content-Type': types[extname(path)]
      ?? 'application/octet-stream' });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
}).listen(54382, '127.0.0.1', () => {
  console.log('Acceptance server: http://127.0.0.1:54382');
});
