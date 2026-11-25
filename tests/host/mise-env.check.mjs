import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const baseEnv = { ...process.env };
delete baseEnv.VERIFY_HOST_DIR;
delete baseEnv.VERIFY_HOST_RUN_DIR;
const preloaded = JSON.parse(execFileSync('mise', ['env', '--json'], { cwd: root, env: baseEnv, encoding: 'utf8' }));
const shellEnv = { ...baseEnv, ...preloaded };
const readDir = (env) => execFileSync('mise', ['exec', '--', process.execPath, '-e', 'process.stdout.write(process.env.VERIFY_HOST_RUN_DIR || "")'], { cwd: root, env, encoding: 'utf8' });
const pattern = /^artifacts\/verify-host\/run-\d{8}T\d{6}Z-\d{12}$/;
const run1 = readDir(shellEnv);
const run2 = readDir(shellEnv);
const blank = readDir({ ...shellEnv, VERIFY_HOST_DIR: '  ' });
for (const dir of [preloaded.VERIFY_HOST_RUN_DIR, run1, run2, blank]) assert.match(dir, pattern);
assert.equal(new Set([preloaded.VERIFY_HOST_RUN_DIR, run1, run2, blank]).size, 4);
assert.equal(readDir({ ...shellEnv, VERIFY_HOST_DIR: 'artifacts/verify-host/custom' }), 'artifacts/verify-host/custom');
console.log('PASS mise-env: per-run VERIFY_HOST_RUN_DIR isolation and VERIFY_HOST_DIR override');
