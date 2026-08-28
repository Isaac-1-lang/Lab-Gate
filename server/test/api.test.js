import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { app } from '../src/app.js';

test('health, discovery, login and protected appointments work together', async (t) => {
  const server = app.listen(0);
  await once(server, 'listening');
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}/api`;

  const health = await fetch(`${base}/health`).then((response) => response.json());
  assert.equal(health.status, 'ok');

  const labs = await fetch(`${base}/laboratories?verified=true`).then((response) => response.json());
  assert.ok(labs.length >= 3);
  assert.ok(labs.every((lab) => lab.verified));

  const loginResponse = await fetch(`${base}/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'patient@labseek.co.za', password: 'Patient123!' }) });
  assert.equal(loginResponse.status, 200);
  const login = await loginResponse.json();
  assert.equal(login.user.role, 'user');

  const appointmentResponse = await fetch(`${base}/appointments`, { headers: { authorization: `Bearer ${login.token}` } });
  assert.equal(appointmentResponse.status, 200);
  const items = await appointmentResponse.json();
  assert.ok(items[0].laboratory.name);
  assert.ok(items[0].test.name);
});
