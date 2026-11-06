import http from 'node:http';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);
export async function startPreview(port = 0) {
  const { outputFiles } = await build({
    absWorkingDir: fileURLToPath(new URL('..', import.meta.url)),
    entryPoints: ['scripts/preview/client.js'], bundle: true, write: false, format: 'esm',
    platform: 'browser', target: 'es2022', loader: { '.css': 'text' },
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const resources = new Map([
    ['/', ['text/html; charset=utf-8', await fs.readFile(new URL('./preview/index.html', import.meta.url))]],
    ['/preview.js', ['text/javascript', outputFiles[0].contents]],
    ['/sdk.js', ['text/javascript', await fs.readFile(require.resolve('@deepseek-ai/dsh-client-ui-theme/client'))]],
  ]);
  const server = http.createServer((request, response) => {
    const resource = resources.get(new URL(request.url, 'http://localhost').pathname);
    if (!resource) { response.writeHead(404).end(); return; }
    response.writeHead(200, { 'Content-Type': resource[0], 'Cache-Control': 'no-store' });
    response.end(resource[1]);
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((resolve) => server.close(resolve)) };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const preview = await startPreview(Number(process.env.PORT || 4173));
  console.log(`Atelier preview: ${preview.url}`);
}
