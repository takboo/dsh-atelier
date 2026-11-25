import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from 'yaml';
import { verifyHostReport } from '../scripts/pack-host-candidate.mjs';
import { releasePolicy } from '../scripts/release-policy.mjs';
import { verifyTarballMetadata } from '../scripts/verify-package.mjs';
import { PLUGIN_ID } from '../src/identity.js';

test('stable and prerelease versions use separate npm channels', () => {
  assert.equal(releasePolicy({ version: '1.4.2' }, 'v1.4.2', false).npmTag, 'latest');
  assert.equal(releasePolicy({ version: '1.5.0-rc.1' }, 'v1.5.0-rc.1', true).npmTag, 'next');
});

test('mismatched tags, invalid versions and prerelease flags fail before publishing', () => {
  assert.throws(() => releasePolicy({ version: '1.4.2' }, 'v1.4.1'));
  assert.throws(() => releasePolicy({ version: '1.4.2' }, 'v1.4.2', true));
  assert.throws(() => releasePolicy({ version: '1.5.0-rc.1' }, 'v1.5.0-rc.1', false));
  assert.throws(() => releasePolicy({ version: '../invalid' }, 'v../invalid'));
});

test('package, source, lockfile and Cordis row use the public package identity', () => {
  const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));
  const lock = JSON.parse(fs.readFileSync(new URL('../package-lock.json', import.meta.url)));
  const patch = parse(fs.readFileSync(new URL('../cordis.patch.yml', import.meta.url), 'utf8'));
  assert.equal(pkg.name, PLUGIN_ID);
  assert.equal(lock.name, PLUGIN_ID);
  assert.equal(lock.packages[''].name, PLUGIN_ID);
  assert.equal(patch[0].insert[0].name, PLUGIN_ID);
});

test('release defaults to a local artifact rehearsal and consumes a tagged checkout', () => {
  const workflow = parse(fs.readFileSync(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8'));
  assert.equal(workflow.on.workflow_dispatch.inputs.dry_run.default, true);
  assert.deepEqual(workflow.on.release.types, ['published']);
  const steps = workflow.jobs.release.steps;
  assert.equal(steps[0].with.ref, '${{ env.RELEASE_TAG }}');
  assert.ok(steps.some((step) => step.run === 'node scripts/publish-npm.mjs'));
  assert.ok(!steps.some((step) => step.run?.includes('--clobber')));
});

test('verifyTarballMetadata validates packed exports, locales and icon bytes', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'atelier-tar-'));
  const packFixture = (name, overrides = {}) => {
    const stage = path.join(tmp, name);
    const files = {
      'package/package.json': JSON.stringify({ name: PLUGIN_ID, exports: { './locale/*.json': './locale/*.json', './icon': './icon.svg' } }),
      'package/index.js': 'export function apply() {}\n',
      'package/client.js': '/* built */\n',
      'package/cordis.patch.yml': '- insert: []\n',
      'package/icon.svg': '<svg/>',
      'package/locale/en.json': JSON.stringify({ meta: { title: 'Atelier', description: 'Themes' } }),
      'package/locale/zh.json': JSON.stringify({ meta: { title: '风格画廊', description: '主题' } }),
      ...overrides,
    };
    for (const [rel, content] of Object.entries(files)) {
      if (content === null) continue;
      const abs = path.join(stage, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, content);
    }
    const tgz = path.join(tmp, `${name}.tgz`);
    execFileSync('tar', ['-czf', tgz, '-C', stage, 'package']);
    return tgz;
  };
  try {
    assert.equal(verifyTarballMetadata(packFixture('valid')).pkg.name, PLUGIN_ID);
    assert.throws(() => verifyTarballMetadata(packFixture('missing-zh', { 'package/locale/zh.json': null })), /Missing tarball entry/);
    assert.throws(() => verifyTarballMetadata(packFixture('bad-export', { 'package/package.json': JSON.stringify({ name: PLUGIN_ID, exports: {} }) })), /export/);
    assert.throws(() => verifyTarballMetadata(packFixture('shadow-exact', {
      'package/package.json': JSON.stringify({ name: PLUGIN_ID, exports: { './locale/*.json': './locale/*.json', './locale/zh.json': './locale/en.json', './icon': './icon.svg' } }),
    })), /without shadowing/);
    assert.throws(() => verifyTarballMetadata(packFixture('shadow-wildcard', {
      'package/package.json': JSON.stringify({ name: PLUGIN_ID, exports: { './locale/*.json': './locale/*.json', './locale/z*.json': './locale/en.json', './icon': './icon.svg' } }),
    })), /without shadowing/);
    assert.throws(() => verifyTarballMetadata(packFixture('empty-icon', { 'package/icon.svg': '   ' })), /non-empty/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('verifyHostReport isolates interleaved runs and rejects mismatches without mutating reports', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'atelier-report-'));
  const makeReport = (sha) => JSON.stringify({ outcome: 'passed', plugin: { sha256: sha }, provenance: { inputs: { tarballSha256: sha } } });
  const runA = path.join(tmp, 'run-a');
  const runB = path.join(tmp, 'run-b');
  try {
    fs.mkdirSync(runA);
    fs.mkdirSync(runB);
    fs.writeFileSync(path.join(runA, 'candidate.tgz'), 'candidate-a');
    fs.writeFileSync(path.join(runB, 'candidate.tgz'), 'candidate-b');
    const shaA = createHash('sha256').update('candidate-a').digest('hex');
    const shaB = createHash('sha256').update('candidate-b').digest('hex');
    fs.writeFileSync(path.join(runB, 'report.json'), makeReport(shaB));
    assert.equal((await verifyHostReport(runB)).sha256, shaB);
    fs.writeFileSync(path.join(runA, 'report.json'), makeReport(shaA));
    assert.equal((await verifyHostReport(runA)).sha256, shaA);
    fs.writeFileSync(path.join(runA, 'candidate.tgz'), 'tampered-a');
    await assert.rejects(() => verifyHostReport(runA), /disagrees/);
    assert.equal(fs.existsSync(path.join(runA, 'report.json')), true);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
