/**
 * Minimal static file server for multi-locale production builds.
 * Serves the Angular i18n output from dist/guitar-trainer/browser/
 * with locale-prefixed paths: /en/, /nl/, /de/.
 *
 * Usage: node e2e/serve-i18n.mjs [port]
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { existsSync } from 'node:fs';

const PORT = parseInt(process.argv[2] || '4201', 10);
const DIST_DIR = resolve(import.meta.dirname, '..', 'dist', 'guitar-trainer', 'browser');
const LOCALES = ['en', 'nl', 'de'];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = url.pathname;

  // Redirect root to /en/
  if (pathname === '/') {
    res.writeHead(302, { Location: '/en/' });
    res.end();
    return;
  }

  // Determine locale from path
  const localeMatch = pathname.match(/^\/(en|nl|de)(\/.*)?$/);
  if (!localeMatch) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }

  const locale = localeMatch[1];
  let filePath = localeMatch[2] || '/';

  // Remove trailing slash for file lookup, but keep /index.html for directories
  if (filePath.endsWith('/')) {
    filePath += 'index.html';
  }

  const fullPath = resolve(DIST_DIR, locale, filePath.slice(1));

  // Guard against path traversal: resolved path must stay within DIST_DIR
  if (!fullPath.startsWith(DIST_DIR + '/')) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad request');
    return;
  }

  // If file doesn't exist, serve index.html for SPA routing
  const actualPath = existsSync(fullPath) ? fullPath : resolve(DIST_DIR, locale, 'index.html');

  // Guard the fallback path as well
  if (!actualPath.startsWith(DIST_DIR + '/')) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad request');
    return;
  }

  try {
    const content = await readFile(actualPath);
    const ext = extname(actualPath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`i18n server listening on http://localhost:${PORT}`);
  console.log(`Serving locales: ${LOCALES.join(', ')} from ${DIST_DIR}`);
});
