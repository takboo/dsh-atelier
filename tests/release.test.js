import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'yaml';
import { releasePolicy } from '../scripts/release-policy.mjs';
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
