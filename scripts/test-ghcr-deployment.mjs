import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const workflow = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
const executable = workflow.split('\n').filter(line => !line.trim().startsWith('#')).join('\n');
test('production never rebuilds on the VPS and consumes the digest produced on GitHub', () => {
  assert.doesNotMatch(executable, /docker\s+compose\s+(?:build|up[^\n]*--build)\b/);
  assert.match(executable, /docker\/build-push-action@/);
  assert.match(executable, /BUILT_DIGEST:.*needs\.build\.outputs\.digest/);
  assert.match(executable, /docker pull \"\$IMAGE_REF\"/);
  assert.match(executable, /docker compose up -d --no-build --pull never/);
  assert.match(executable, /org\.opencontainers\.image\.revision/);
  assert.match(executable, /CURRENT_SHA/);
});
test('environment files and rollback remain protected', () => {
  assert.ok(executable.includes("--exclude='.env' --exclude='.env.*'"));
  assert.doesNotMatch(executable, /--delete-excluded/);
  assert.match(executable, /ROLLBACK_TAG/);
  assert.match(executable, /Contrôle de santé/);
});
