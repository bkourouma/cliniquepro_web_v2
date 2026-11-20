import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as reception from '../src/lib/lead-reception-server.mjs';

const CLINIQUE = true;
const origin = CLINIQUE ? 'https://cliniquepro-web.allianceconsultants.net' : 'https://immotopia.cloud';
const sourceId = CLINIQUE ? 'site-form-clinique-v1' : 'site-form-immotopia-v1';
const submissionId = '123e4567-e89b-42d3-a456-426614174000';
const receiptId = '123e4567-e89b-42d3-a456-426614174111';
const body = { structure: 'RECETTE', volume: 'RECETTE', ...(CLINIQUE ? { need: 'RECETTE' } : {}), role: 'RECETTE', name: 'Test', company: 'Test', email: 'recipe@example.test', phone: '0000000000', locale: 'fr', website: '', elapsedMs: 2500, submissionId, submittedAt: '2026-11-20T20:45:00.000Z' };
function scenario({ failure = false, noWebhook = false, invalidAck = false } = {}) {
  const calls = { prepared: [], confirmed: [], forwarded: [] };
  const env = { N8N_WEBHOOK_URL: noWebhook ? '' : 'https://workflow.example.test/production', N8N_WEBHOOK_SECRET: 'isolated-production-secret-value-00000000', N8N_WEBHOOK_TEST_URL: 'https://workflow.example.test/recipe', N8N_WEBHOOK_TEST_SECRET: 'isolated-workflow-recipe-secret-00000000', FORM_RECIPE_AUTH_TOKEN: 'isolated-site-recipe-secret-0000000000000', MC_FORM_SOURCE_ID: sourceId };
  const measurements = { prepareBusinessSubmission: async input => { calls.prepared.push(input); return 'ticket'; }, confirmBusinessSubmission: async (...args) => { calls.confirmed.push(args); return true; }, submissionDevice: () => 'MOBILE' };
  const upstream = async (url, init) => {
    const envelope = JSON.parse(init.body); calls.forwarded.push(envelope);
    if (failure) return new Response(null, { status: 503 });
    return Response.json({ version: 1, accepted: true, sourceId, submissionId: invalidAck ? 'wrong' : envelope.submissionId, receiptId, receivedAt: envelope.submittedAt, duplicate: false, isTest: url.endsWith('/recipe') });
  };
  const server = { ...reception, createLeadHandler: (config, deps) => reception.createLeadHandler(config, { ...deps, fetch: upstream, sleep: async () => undefined }) };
  const sandboxModule = { exports: {} };
  const source = readFileSync(new URL('../src/app/api/lead/route.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const require = name => {
    if (name === '@/lib/seo-business-outbox.mjs') return measurements;
    if (name === '@/lib/lead-reception-server.mjs') return server;
    throw new Error(`Unexpected import in isolated handler: ${name}`);
  };
  vm.runInNewContext(compiled, { module: sandboxModule, exports: sandboxModule.exports, require, Request, Response, Headers, AbortSignal, process: { env } });
  const request = (data = body, recipe = false) => new Request(origin + '/api/lead', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...(recipe ? { 'x-mc-form-test': env.FORM_RECIPE_AUTH_TOKEN } : {}) }, body: JSON.stringify(data) });
  return { calls, handler: sandboxModule.exports, request };
}

test('the actual route confirms SEO only after a correlated durable receipt', async () => {
  const s = scenario(); const response = await s.handler.POST(s.request());
  assert.equal(response.status, 200); assert.equal((await response.json()).receiptId, receiptId);
  assert.equal(s.calls.prepared.length, 1); assert.deepEqual(s.calls.confirmed, [['ticket', receiptId]]);
  assert.ok(!JSON.stringify(s.calls.prepared).includes(body.email)); assert.ok(!JSON.stringify(s.calls.prepared).includes(body.phone));
});
test('the actual honeypot path forwards nothing and creates no measurement', async () => {
  const s = scenario(); const response = await s.handler.POST(s.request({ ...body, website: 'bot' }));
  assert.equal(response.status, 200); assert.equal(s.calls.forwarded.length, 0); assert.equal(s.calls.prepared.length, 0); assert.equal(s.calls.confirmed.length, 0);
});
test('a failed upstream never confirms a conversion or prepares a misleading success', async () => {
  const s = scenario({ failure: true }); const response = await s.handler.POST(s.request());
  assert.equal(response.status, 502); assert.equal(s.calls.prepared.length, 0); assert.equal(s.calls.confirmed.length, 0);
});
test('missing N8N configuration is unavailable on both sites, never forwarded:false success', async () => {
  const s = scenario({ noWebhook: true }); const response = await s.handler.POST(s.request());
  assert.equal(response.status, 503); assert.equal(s.calls.forwarded.length, 0); assert.equal(s.calls.prepared.length, 0);
  if (CLINIQUE) assert.equal((await (await s.handler.GET()).json()).formulaire, false);
});
test('the real recipe route receives a receipt while excluding all measurement hooks', async () => {
  const s = scenario(); const response = await s.handler.POST(s.request(body, true));
  assert.equal(response.status, 200); assert.equal((await response.json()).isTest, true); assert.equal(s.calls.forwarded.length, 1); assert.equal(s.calls.prepared.length, 0); assert.equal(s.calls.confirmed.length, 0);
});
test('a mismatched ACK in the actual route is refused and never measured', async () => {
  const s = scenario({ invalidAck: true }); const response = await s.handler.POST(s.request());
  assert.equal(response.status, 502); assert.equal(s.calls.prepared.length, 0); assert.equal(s.calls.confirmed.length, 0);
});

