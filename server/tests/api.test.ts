import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import test from 'node:test';
import { createApp } from '../src/app.js';
import { hashPassword, verifyPassword } from '../src/modules/auth/security.js';

test('passwords are hashed and verified without plaintext storage', async () => {
  const password = 'a-secure-plant-password';
  const hash = await hashPassword(password);
  assert.notEqual(hash, password);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword('wrong-password', hash), false);
});

test('API health, catalogue search and recommendation routes respond', async () => {
  const server = createApp().listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const { port } = server.address() as AddressInfo;
  const base = `http://127.0.0.1:${port}`;
  try {
    const health = await fetch(`${base}/api/health`);
    assert.equal(health.status, 200);
    const catalogue = await fetch(`${base}/api/plants?city=noida&search=office%20plants&limit=40`);
    const cataloguePayload = await catalogue.json() as { data: unknown[] };
    assert.equal(catalogue.status, 200);
    assert.ok(cataloguePayload.data.length > 0);
    const recommendations = await fetch(`${base}/api/recommendations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ city: 'noida', setting: 'indoor', light: 'low', budget: 600 }) });
    const recommendationPayload = await recommendations.json() as { data: unknown[]; methodology: string };
    assert.equal(recommendations.status, 200);
    assert.equal(recommendationPayload.methodology, 'rule-based-v1');
    assert.ok(recommendationPayload.data.length > 0);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
