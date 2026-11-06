import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { parse } from 'yaml';
import { PLUGIN_ID } from '../src/identity.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
export function npm(args) {
  const options = { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] };
  // npm supplies its own CLI path during scripts, including on Windows.
  if (process.env.npm_execpath) return execFileSync(process.execPath, [process.env.npm_execpath, ...args], options);
  return execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, options);
}

export async function verifyPackage() {
  const pkg = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.name, PLUGIN_ID);
  assert.notEqual(pkg.private, true);
  assert.equal(pkg.license, 'MIT');
  assert.equal(pkg.repository.url, 'git+https://github.com/takboo/dsh-atelier.git');
  assert.equal(pkg.publishConfig.access, 'public');
  for (const name of Object.keys(pkg.dependencies || {})) assert.ok(!name.startsWith('@deepseek-ai/'), 'Host packages must not be runtime dependencies');
  for (const name of ['prepare', 'install', 'postinstall', 'preinstall']) assert.equal(pkg.scripts[name], undefined, 'The prebuilt package must install without build scripts');
  for (const name of pkg.dsh.client.inject) {
    assert.equal(pkg.peerDependencies[name], pkg.engines.dsh);
    assert.equal(pkg.devDependencies[name], pkg.peerDependencies[name]);
    assert.equal(pkg.peerDependenciesMeta[name].optional, true);
  }
  const patch = parse(await fs.readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8'));
  assert.equal(patch[0].insert[0].name, pkg.name);
  let registration;
  vm.runInNewContext(await fs.readFile(new URL('../client.js', import.meta.url), 'utf8'), {
    window: { __ModuleLoader__: { load: (module) => { registration = module; } } },
  });
  assert.equal(registration.id, pkg.name);
  const module = registration.factory((name) => { assert.equal(name, 'react'); return require('react'); });
  assert.equal(typeof module.apply, 'function');
  assert.deepEqual(Array.from(module.inject), ['slots', 'locale', 'theme']);
  const [packed] = JSON.parse(npm(['pack', '--dry-run', '--ignore-scripts', '--json']));
  const files = new Set(packed.files.map((file) => file.path));
  for (const target of Object.values(pkg.exports)) {
    if (!target.includes('*')) assert.ok(files.has(target.replace(/^\.\//, '')), `Unpacked export: ${target}`);
  }
  for (const name of ['LICENSE', 'cordis.patch.yml', 'locale/en.json', 'locale/zh.json', 'README.md', 'docs/assets/gallery-light.png', 'docs/assets/gallery-dark.png']) {
    assert.ok(files.has(name), `Missing package file: ${name}`);
  }
  for (const name of files) {
    assert.ok(!name.startsWith('node_modules/'));
    if (!name.endsWith('.md')) continue;
    const markdown = await fs.readFile(path.join(root, name), 'utf8');
    for (const [, link] of markdown.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(https?:|#)/.test(link)) continue;
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(name), link.split('#')[0]));
      assert.ok(files.has(target), `${name}: link is not packed: ${link}`);
    }
  }
  const entry = parse(await fs.readFile(new URL('../market/takboo__dsh-atelier.yml', import.meta.url), 'utf8'));
  assert.equal(entry.url, 'https://github.com/takboo/dsh-atelier');
  assert.equal(entry.category, 'theme');
  assert.ok(entry.description.en && entry.description.zh);
  assert.equal(entry.tarball, `${entry.url}/releases/latest/download/dsh-atelier.tgz`);
  console.log(`PASS package: ${pkg.name}@${pkg.version}, ${files.size} files, loader identity, exports, docs and market entry`);
  return packed;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await verifyPackage();
