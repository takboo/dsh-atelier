import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { releasePolicy } from './release-policy.mjs';
import { npm, verifyPackage } from './verify-package.mjs';

const pkg = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), 'utf8'));
const tag = process.env.RELEASE_TAG || `v${pkg.version}`;
const flag = process.env.RELEASE_PRERELEASE;
const policy = releasePolicy(pkg, tag, flag === undefined || flag === '' ? undefined : flag === 'true');
if (process.env.GITHUB_REPOSITORY) assert.equal(process.env.GITHUB_REPOSITORY, 'takboo/dsh-atelier', 'Release must run in the owning repository');
await verifyPackage();
const directory = new URL(`../artifacts/${tag}/`, import.meta.url);
await fs.mkdir(directory, { recursive: true });
const [packed] = JSON.parse(npm(['pack', '--ignore-scripts', '--json', '--pack-destination', fileURLToPath(directory)]));
const original = new URL(packed.filename, directory);
const bytes = await fs.readFile(original);
await fs.writeFile(new URL(policy.asset, directory), bytes);
await fs.writeFile(new URL('dsh-atelier.tgz', directory), bytes);
// Keep only the named deliverables from this pack operation; never rebuild between channels.
await fs.unlink(original);
const sha256 = createHash('sha256').update(bytes).digest('hex');
await fs.writeFile(new URL('SHA256SUMS', directory), [policy.asset, 'dsh-atelier.tgz'].map((name) => `${sha256}  ${name}\n`).join(''));
let commit = null;
let dirty = null;
try {
  commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  dirty = Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim());
} catch { /* Source archives have no .git directory. */ }
if (process.env.CI === 'true') assert.equal(dirty, false, 'CI release checkout must be clean after the build');
await fs.writeFile(new URL('verification.json', directory), JSON.stringify({
  package: pkg.name, ...policy, commit, dirty, sha256, integrity: packed.integrity,
}, null, 2) + '\n');
console.log(`Prepared ${policy.asset} and dsh-atelier.tgz (npm tag: ${policy.npmTag})`);
