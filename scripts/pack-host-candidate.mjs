import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildClient } from './build.mjs';
import { npm, verifyPackage, verifyTarballMetadata } from './verify-package.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const sha256File = async (p) => createHash('sha256').update(await fs.readFile(p)).digest('hex');
const resolveOutDir = () => path.resolve(root, process.env.VERIFY_HOST_DIR?.trim() || process.env.VERIFY_HOST_RUN_DIR?.trim() || path.join('artifacts', 'verify-host'));

export async function packHostCandidate(outDir = resolveOutDir()) {
  const candidatePath = path.join(outDir, 'candidate.tgz');
  const reportPath = path.join(outDir, 'report.json');
  await fs.mkdir(outDir, { recursive: true });
  await fs.rm(reportPath, { force: true });
  await fs.rm(candidatePath, { force: true });
  await buildClient();
  await verifyPackage();
  const stageDir = await fs.mkdtemp(path.join(outDir, '.stage-'));
  try {
    const [packed] = JSON.parse(npm(['pack', '--ignore-scripts', '--json', '--pack-destination', stageDir]));
    const stagedPath = path.join(stageDir, packed.filename);
    verifyTarballMetadata(stagedPath);
    await fs.rename(stagedPath, candidatePath);
  } finally {
    await fs.rm(stageDir, { recursive: true, force: true });
  }
  const sha256 = await sha256File(candidatePath);
  console.log(`Candidate: ${path.relative(root, candidatePath)}`);
  console.log(`SHA-256: ${sha256}`);
  return { candidatePath, sha256 };
}

export async function verifyHostReport(outDir = resolveOutDir()) {
  const candidatePath = path.join(outDir, 'candidate.tgz');
  const reportPath = path.join(outDir, 'report.json');
  const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
  assert.equal(report.outcome, 'passed', `Host verification outcome must be passed (got ${report.outcome})`);
  const expected = report.provenance?.inputs?.tarballSha256;
  assert.match(String(expected || ''), /^[a-f0-9]{64}$/, 'Report missing valid 64-hex provenance.inputs.tarballSha256');
  assert.equal(report.plugin?.sha256, expected, 'Report plugin.sha256 disagrees with provenance.inputs.tarballSha256');
  const actual = await sha256File(candidatePath);
  assert.equal(actual, expected, `Candidate SHA-256 (${actual}) disagrees with report (${expected})`);
  console.log(`Report: ${path.relative(root, reportPath)}`);
  console.log(`PASS report-candidate match: ${actual}`);
  return { candidatePath, reportPath, sha256: actual };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--verify-report')) await verifyHostReport();
  else await packHostCandidate();
}
