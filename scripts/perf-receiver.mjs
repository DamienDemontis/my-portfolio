/**
 * Tiny HTTP receiver that writes POST bodies to a file under perf-traces/.
 *
 * Why this exists: the Playwright MCP run_code_unsafe sandbox has no fs
 * access, and its `filename` param is broken. To get large trace dumps out
 * of the browser, the in-page (or MCP-side) code POSTs to this server,
 * which writes to disk.
 *
 * Usage:
 *   POST /save?name=run-1.json   body: <any text>
 *     → writes perf-traces/run-1.json
 *
 * Listens on 127.0.0.1:7777 (CORS open so the page can fetch directly).
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '..', 'perf-traces');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const PORT = 7777;

const server = http.createServer((req, res) => {
  // CORS for in-page fetch.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.statusCode = 200;
    res.end('ok');
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end('method not allowed');
    return;
  }

  const url = new URL(req.url, 'http://localhost');
  let name = url.searchParams.get('name') || `dump-${Date.now()}.json`;
  // Sanitize: no path separators allowed.
  name = name.replace(/[^A-Za-z0-9._-]/g, '_');

  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    const buf = Buffer.concat(chunks);
    const dest = path.join(OUT_DIR, name);
    fs.writeFile(dest, buf, (err) => {
      if (err) {
        console.error(`[receiver] FAILED ${name}:`, err.message);
        res.statusCode = 500;
        res.end(`err: ${err.message}`);
      } else {
        console.error(`[receiver] saved ${name} (${buf.length} bytes)`);
        res.statusCode = 200;
        res.end(`ok ${buf.length}`);
      }
    });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.error(`[receiver] listening on http://127.0.0.1:${PORT}`);
  console.error(`[receiver] output dir: ${OUT_DIR}`);
});
