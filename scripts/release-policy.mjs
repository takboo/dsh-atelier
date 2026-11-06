import assert from 'node:assert/strict';
import semver from 'semver';

export function releasePolicy(pkg, tag, prereleaseFlag) {
  assert.ok(semver.valid(pkg.version), 'package.json version must be SemVer');
  assert.equal(tag, `v${pkg.version}`, 'Release tag must match package.json version');
  const prerelease = semver.prerelease(pkg.version) !== null;
  if (prereleaseFlag !== undefined) assert.equal(prereleaseFlag, prerelease, 'GitHub prerelease flag must match version');
  return { version: pkg.version, tag, npmTag: prerelease ? 'next' : 'latest', asset: `dsh-atelier-${pkg.version}.tgz` };
}
