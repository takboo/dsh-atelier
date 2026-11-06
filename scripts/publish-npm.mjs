import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { releasePolicy } from './release-policy.mjs';
import { npm } from './verify-package.mjs';

const pkg = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), 'utf8'));
const policy = releasePolicy(pkg, process.env.RELEASE_TAG || `v${pkg.version}`);
const directory = new URL(`../artifacts/${policy.tag}/`, import.meta.url);
const report = JSON.parse(await fs.readFile(new URL('verification.json', directory), 'utf8'));
const tarball = new URL(policy.asset, directory);
const bytes = await fs.readFile(tarball);
assert.equal(report.package, pkg.name);
assert.equal(report.version, pkg.version);
assert.equal(report.integrity, `sha512-${createHash('sha512').update(bytes).digest('base64')}`, 'Prepared artifact integrity mismatch');
const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg.name)}/${pkg.version}`);
if (response.status === 404) {
  console.log(npm(['publish', fileURLToPath(tarball), '--ignore-scripts', '--access', 'public', '--tag', policy.npmTag]));
} else {
  assert.ok(response.ok, `npm registry returned ${response.status}`);
  const existing = await response.json();
  assert.equal(existing.dist.integrity, report.integrity, 'Version already exists with different bytes; choose a new version');
  console.log(`${pkg.name}@${pkg.version} already contains the prepared artifact; publication skipped`);
}
