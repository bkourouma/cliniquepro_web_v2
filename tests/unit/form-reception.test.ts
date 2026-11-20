import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLeadHandler, formReceptionConfigured, type LeadHandlerDependencies } from '../../src/lib/lead-reception-server.mjs';
import { getSubmissionMetadata, readLeadReceipt } from '../../src/lib/lead-reception-client.mjs';

const CLINIQUE = true;
const config = {
  source: CLINIQUE ? 'site-vitrine-cliniquepro' : 'site-vitrine',
  sourceId: CLINIQUE ? 'site-form-clinique-v1' : 'site-form-immotopia-v1',
  siteOrigin: CLINIQUE ? 'https://cliniquepro-web.allianceconsultants.net' : 'https://immotopia.cloud',
  fields: ['structure', 'volume', ...(CLINIQUE ? ['need'] : []), 'role', 'name', 'company', 'email', 'phone'],
};
const submissionId = '123e4567-e89b-42d3-a456-426614174000';
const receiptId = '123e4567-e89b-42d3-a456-426614174111';
const submittedAt = '2026-11-20T20:45:00.000Z';
const contact = { structure: 'RECETTE structure', volume: 'RECETTE volume', ...(CLINIQUE ? { need: 'RECETTE need' } : {}), role: 'RECETTE role', name: 'RECETTE-CONTACT-NOM', company: 'RECETTE-SOCIETE', email: 'recipe@example.test', phone: '0000000000' };
const validBody = { ...contact, locale: 'fr', website: '', elapsedMs: 2500, submissionId, submittedAt };
function acknowledgement(changes: Record<string, unknown> = {}) {
  return { version: 1, accepted: true, sourceId: config.sourceId, submissionId, receiptId, receivedAt: submittedAt, duplicate: false, isTest: false, ...changes };
}
type ScenarioOptions = { env?: Record<string, string | undefined>; ack?: Record<string, unknown>; fetch?: typeof fetch; measureFailure?: boolean };
function scenario(options: ScenarioOptions = {}) {
  // These are isolated test credentials, not production values.
  const env: Record<string, string | undefined> = {
    N8N_WEBHOOK_URL: 'https://workflow.example.test/production', N8N_WEBHOOK_SECRET: 'isolated-production-secret-value-00000000',
    N8N_WEBHOOK_TEST_URL: 'https://workflow.example.test/recipe', N8N_WEBHOOK_TEST_SECRET: 'isolated-workflow-recipe-secret-00000000',
    FORM_RECIPE_AUTH_TOKEN: 'isolated-site-recipe-secret-0000000000000', MC_FORM_SOURCE_ID: config.sourceId, ...options.env,
  };
  const sent: { url: string; payload: Record<string, unknown>; authorization: string | null }[] = [];
  const measured: string[] = [];
  const seen = new Set<string>();
  const send: typeof fetch = options.fetch ?? (async (input, init) => {
    const payload = JSON.parse(String(init?.body)); const id = String(payload.submissionId);
    sent.push({ url: String(input), payload, authorization: new Headers(init?.headers).get('authorization') });
    const duplicate = seen.has(id); seen.add(id);
    return Response.json(acknowledgement({ submissionId: id, duplicate, isTest: String(input).endsWith('/recipe'), ...options.ack }));
  });
  const dependencies: LeadHandlerDependencies = { env: () => env, fetch: send, sleep: async () => undefined, measure: async receipt => { measured.push(receipt.receiptId); if (options.measureFailure) throw new Error('isolated measurement failure'); } };
  const handler = createLeadHandler(config, dependencies);
  const request = (body: Record<string, unknown> = validBody, headers: Record<string, string> = {}, query = '') => new Request(config.siteOrigin + '/api/lead' + query, { method: 'POST', headers: { Origin: config.siteOrigin, 'Content-Type': 'application/json', 'x-real-ip': '192.0.2.1', ...headers }, body: JSON.stringify(body) });
  return { env, sent, measured, handler, request };
}

test('production is acknowledged only by the correlated durable receipt', async () => {
  const s = scenario(); const result = await s.handler(s.request());
  assert.equal(result.status, 200); assert.equal(result.headers.get('x-mc-form-recipe'), '0');
  assert.equal((await result.json()).receiptId, receiptId); assert.deepEqual(s.measured, [receiptId]);
  assert.equal(s.sent[0].url, s.env.N8N_WEBHOOK_URL); assert.equal(s.sent[0].authorization, 'Bearer ' + s.env.N8N_WEBHOOK_SECRET);
  assert.deepEqual(Object.keys(s.sent[0].payload).sort(), ['version', 'submissionId', 'submittedAt', 'source', 'locale', 'lead'].sort());
  assert.equal(s.sent[0].payload.source, config.source); assert.deepEqual(s.sent[0].payload.lead, contact);
});

test('uppercase UUID input and cached metadata are canonicalized before forwarding and ACK comparison', async () => {
  const s = scenario(); const result = await s.handler(s.request({ ...validBody, submissionId: submissionId.toUpperCase() }));
  assert.equal(result.status, 200); assert.equal((await result.json()).submissionId, submissionId); assert.equal(s.sent[0].payload.submissionId, submissionId);
  assert.equal(readLeadReceipt(acknowledgement(), { sourceId: config.sourceId, submissionId: submissionId.toUpperCase(), isTest: false })?.submissionId, submissionId);
  const store = storage(); const now = Date.now(); const metadata = await getSubmissionMetadata(config.source, contact, 'fr', { storage: store, now });
  const key = [...store.map.keys()][0]; const saved = JSON.parse(store.map.get(key)!); saved.submissionId = saved.submissionId.toUpperCase(); store.map.set(key, JSON.stringify(saved));
  const retried = await getSubmissionMetadata(config.source, contact, 'fr', { storage: store, now }); assert.equal(retried.submissionId, metadata.submissionId);
});

test('authenticated recipe uses its own workflow and never invokes SEO measurement', async () => {
  const s = scenario(); const result = await s.handler(s.request(validBody, { 'x-mc-form-test': s.env.FORM_RECIPE_AUTH_TOKEN! }));
  assert.equal(result.status, 200); assert.equal(result.headers.get('x-mc-form-recipe'), '1'); assert.equal((await result.json()).isTest, true);
  assert.equal(s.sent[0].url, s.env.N8N_WEBHOOK_TEST_URL); assert.equal(s.sent[0].authorization, 'Bearer ' + s.env.N8N_WEBHOOK_TEST_SECRET);
  assert.equal('isTest' in s.sent[0].payload, false); assert.deepEqual(s.measured, []);
});

test('wrong or empty recipe authentication fails before honeypot and cannot fall through to production', async () => {
  for (const token of ['', 'wrong']) {
    const s = scenario(); const result = await s.handler(s.request({ ...validBody, website: 'bot' }, { 'x-mc-form-test': token }));
    assert.equal(result.status, 401); assert.equal(s.sent.length, 0); assert.deepEqual(s.measured, []);
  }
});

test('public test fields cannot bypass statistics; query flags never select recipe mode', async () => {
  const s = scenario();
  assert.equal((await s.handler(s.request({ ...validBody, isTest: true }))).status, 400);
  const result = await s.handler(s.request(validBody, {}, '?test=1'));
  assert.equal((await result.json()).isTest, false); assert.equal(s.sent[0].url, s.env.N8N_WEBHOOK_URL); assert.equal(s.measured.length, 1);
});

test('complete production configuration is required, including source identity and credential', async () => {
  for (const env of [{ N8N_WEBHOOK_URL: '' }, { N8N_WEBHOOK_SECRET: '' }, { MC_FORM_SOURCE_ID: 'wrong-source' }, { N8N_WEBHOOK_URL: 'http://workflow.example.test/insecure' }]) {
    const s = scenario({ env }); assert.equal(formReceptionConfigured(config, s.env), false);
    const result = await s.handler(s.request()); assert.equal(result.status, 503); assert.equal(s.sent.length, 0); assert.equal(s.measured.length, 0);
    assert.notEqual((await result.json()).forwarded, false);
  }
});

test('missing recipe configuration fails safely while production remains configured', async () => {
  const s = scenario({ env: { N8N_WEBHOOK_TEST_SECRET: '' } }); assert.equal(formReceptionConfigured(config, s.env), true);
  assert.equal((await s.handler(s.request(validBody, { 'x-mc-form-test': s.env.FORM_RECIPE_AUTH_TOKEN! }))).status, 503); assert.equal(s.sent.length, 0);
});

test('recipe URL and all site/workflow credentials must be distinct before any forwarding', async () => {
  const base = scenario().env;
  for (const env of [{ N8N_WEBHOOK_TEST_URL: base.N8N_WEBHOOK_URL }, { N8N_WEBHOOK_TEST_SECRET: base.N8N_WEBHOOK_SECRET }, { FORM_RECIPE_AUTH_TOKEN: base.N8N_WEBHOOK_TEST_SECRET }, { FORM_RECIPE_AUTH_TOKEN: base.N8N_WEBHOOK_SECRET }]) {
    const s = scenario({ env }); const result = await s.handler(s.request(validBody, { 'x-mc-form-test': s.env.FORM_RECIPE_AUTH_TOKEN! }));
    assert.equal(result.status, 503); assert.equal(s.sent.length, 0); assert.equal(s.measured.length, 0);
  }
});

test('invalid, mismatched or uncorrelated acknowledgements never confirm receipt', async () => {
  for (const ack of [{ accepted: false }, { version: 2 }, { sourceId: 'other-source' }, { submissionId: '123e4567-e89b-42d3-a456-426614174222' }, { receiptId: '' }, { receivedAt: 'invalid' }, { duplicate: 'false' }, { isTest: true }, { privateExtra: 'untrusted' }]) {
    const s = scenario({ ack }); assert.equal((await s.handler(s.request())).status, 502); assert.equal(s.measured.length, 0); assert.equal(s.sent.length, 1);
  }
});

test('HTTP 200 with an empty body is not receipt; oversized upstream bodies are bounded', async () => {
  for (const body of ['', 'x'.repeat(17000)]) {
    const s = scenario({ fetch: async () => new Response(body, { status: 200 }) }); assert.equal((await s.handler(s.request())).status, 502); assert.equal(s.measured.length, 0);
  }
});

test('uncertain timeout retries at most three times with exactly the same UUID and payload', async () => {
  const payloads: string[] = []; let attempts = 0;
  const s = scenario({ fetch: async (_input, init) => { payloads.push(String(init?.body)); attempts += 1; if (attempts < 3) throw new DOMException('isolated timeout', 'TimeoutError'); return Response.json(acknowledgement({ duplicate: true })); } });
  const result = await s.handler(s.request()); assert.equal(result.status, 200); assert.equal(attempts, 3); assert.equal(new Set(payloads).size, 1); assert.equal(s.measured[0], receiptId);
});

test('exhausted retries report failure instead of a false success', async () => {
  let attempts = 0; const s = scenario({ fetch: async () => { attempts += 1; return new Response(null, { status: 503 }); } });
  assert.equal((await s.handler(s.request())).status, 502); assert.equal(attempts, 3); assert.equal(s.measured.length, 0);
});

test('permanent upstream refusal is not retried and never measured', async () => {
  let attempts = 0; const s = scenario({ fetch: async () => { attempts += 1; return new Response(null, { status: 401 }); } });
  assert.equal((await s.handler(s.request())).status, 502); assert.equal(attempts, 1); assert.equal(s.measured.length, 0);
});

test('duplicate requests retain the same receipt identifier for downstream metric deduplication', async () => {
  const s = scenario(); const a = await (await s.handler(s.request())).json(); const b = await (await s.handler(s.request())).json();
  assert.equal(a.receiptId, b.receiptId); assert.equal(a.duplicate, false); assert.equal(b.duplicate, true); assert.deepEqual(s.measured, [receiptId, receiptId]);
});

test('a measurement problem cannot erase the independently committed receipt', async () => {
  const s = scenario({ measureFailure: true }); const result = await s.handler(s.request()); assert.equal(result.status, 200); assert.equal((await result.json()).receiptId, receiptId);
});

test('honeypot produces no forwarding, storage request or SEO measurement', async () => {
  const s = scenario(); const result = await s.handler(s.request({ website: 'bot' })); assert.equal(result.status, 200); assert.equal(s.sent.length, 0); assert.equal(s.measured.length, 0);
});

test('origin, content type, minimum delay and invalid identity are rejected without forwarding', async () => {
  const cases: [Record<string, unknown>, Record<string, string>, number][] = [[validBody, { Origin: 'https://foreign.example.test' }, 403], [validBody, { 'Content-Type': 'text/plain' }, 415], [{ ...validBody, elapsedMs: 1000 }, {}, 400], [{ ...validBody, submissionId: 'invalid' }, {}, 400], [{ ...validBody, email: 'invalid' }, {}, 400], [{ ...validBody, name: 'x'.repeat(201) }, {}, 400]];
  for (const [body, headers, status] of cases) { const s = scenario(); assert.equal((await s.handler(s.request(body, headers))).status, status); assert.equal(s.sent.length, 0); }
});

test('request bodies are bounded and malformed JSON is refused', async () => {
  const s = scenario();
  for (const [body, status] of [['{', 400], [' '.repeat(17000), 413]] as const) {
    const request = new Request(config.siteOrigin + '/api/lead', { method: 'POST', headers: { Origin: config.siteOrigin, 'Content-Type': 'application/json' }, body });
    assert.equal((await s.handler(request)).status, status);
  }
  assert.equal(s.sent.length, 0);
});

test('rate limit is bounded and recipe traffic cannot consume the production bucket', async () => {
  const s = scenario();
  for (let i = 0; i < 8; i += 1) assert.equal((await s.handler(s.request(validBody, { 'x-mc-form-test': s.env.FORM_RECIPE_AUTH_TOKEN! }))).status, 200);
  assert.equal((await s.handler(s.request(validBody, { 'x-mc-form-test': s.env.FORM_RECIPE_AUTH_TOKEN! }))).status, 429);
  assert.equal((await s.handler(s.request())).status, 200);
});

function storage() {
  const map = new Map<string, string>();
  return { map, getItem: (key: string) => map.get(key) ?? null, setItem: (key: string, value: string) => { map.set(key, value); } };
}
test('metadata survives retries/refresh through session storage and contains no contact fields', async () => {
  const store = storage(); const now = Date.now();
  const a = await getSubmissionMetadata(config.source, contact, 'fr', { storage: store, now });
  const b = await getSubmissionMetadata(config.source, contact, 'fr', { storage: store, now: now + 60000 });
  assert.deepEqual(a, b);
  const serialized = [...store.map.values()].join(''); for (const privateValue of [contact.name, contact.email, contact.phone, contact.company]) assert.ok(!serialized.includes(privateValue));
  assert.equal(JSON.parse([...store.map.values()][0]).fingerprint.length, 64);
});

test('changed content or the 24-hour TTL obtains a new identity', async () => {
  const store = storage(); const now = Date.now();
  const a = await getSubmissionMetadata(config.source, contact, 'fr', { storage: store, now });
  const b = await getSubmissionMetadata(config.source, { ...contact, company: 'RECETTE AUTRE' }, 'fr', { storage: store, now: now + 1 });
  assert.notEqual(a.submissionId, b.submissionId);
  const c = await getSubmissionMetadata(config.source, { ...contact, company: 'RECETTE AUTRE' }, 'fr', { storage: store, now: now + 24 * 3600000 + 2 });
  assert.notEqual(b.submissionId, c.submissionId);
});

test('blocked storage retains a non-personal identity within the page', async () => {
  const unavailable = { getItem: () => { throw new Error('isolated unavailable storage'); }, setItem: () => { throw new Error('isolated unavailable storage'); } };
  const a = await getSubmissionMetadata(config.source + '-blocked', contact, 'fr', { storage: unavailable });
  const b = await getSubmissionMetadata(config.source + '-blocked', contact, 'fr', { storage: unavailable });
  assert.deepEqual(a, b);
});

test('the UI receipt discriminator refuses fake success and wrong test mode', () => {
  const expected = { sourceId: config.sourceId, submissionId, isTest: false };
  assert.equal(readLeadReceipt({ ok: true, forwarded: false }, expected), null);
  assert.equal(readLeadReceipt(acknowledgement({ isTest: true }), expected), null);
  assert.equal(readLeadReceipt(acknowledgement(), expected)?.receiptId, receiptId);
});

