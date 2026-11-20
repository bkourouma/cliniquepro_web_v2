import { createHash, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import { readLeadReceipt, validIsoDate, validSubmissionId } from './lead-reception-contract.mjs';

const MAX_BODY_BYTES = 16_384;
const MIN_ELAPSED_MS = 2_000;
const WINDOW_MS = 10 * 60_000;
const MAX_REQUESTS = 8;
const MAX_RATE_KEYS = 5_000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SOURCE_ID = /^[A-Za-z0-9_-]{8,100}$/;
const PRIVATE_HEADERS = { 'Cache-Control': 'no-store' };
const error = (status, message, headers = {}) => Response.json({ error: message }, { status, headers: { ...PRIVATE_HEADERS, ...headers } });

function equalSecret(supplied, configured) {
  if (typeof configured !== 'string' || configured.length < 32 || typeof supplied !== 'string') return false;
  const expected = Buffer.from(configured); const actual = Buffer.from(supplied);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
function httpsEndpoint(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && !url.hash ? url.href : null; } catch { return null; }
}
export function formReceptionConfigured(config, env = {}) {
  return Boolean(httpsEndpoint(env.N8N_WEBHOOK_URL) && typeof env.N8N_WEBHOOK_SECRET === 'string' && env.N8N_WEBHOOK_SECRET.length >= 32 && env.MC_FORM_SOURCE_ID === config.sourceId && SOURCE_ID.test(config.sourceId));
}
function createLimiter() {
  const records = new Map();
  return (key, now) => {
    if (records.size >= MAX_RATE_KEYS) for (const [recordKey, value] of records) if (value.until <= now) records.delete(recordKey);
    let row = records.get(key);
    if (!row || row.until <= now) {
      if (!row && records.size >= MAX_RATE_KEYS) return { allowed: false, retryAfter: 600 };
      row = { count: 0, until: now + WINDOW_MS }; records.set(key, row);
    }
    row.count += 1;
    return { allowed: row.count <= MAX_REQUESTS, retryAfter: Math.max(1, Math.ceil((row.until - now) / 1000)) };
  };
}
async function boundedJson(request) {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return { error: 413 };
  const reader = request.body?.getReader(); if (!reader) return { error: 400 };
  const chunks = []; let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) { await reader.cancel(); return { error: 413 }; }
      chunks.push(value);
    }
  } catch { return { error: 400, streamError: true }; } finally { reader.releaseLock(); }
  try {
    const data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
    return data && typeof data === 'object' && !Array.isArray(data) ? { data } : { error: 400 };
  } catch { return { error: 400 }; }
}

/** Server-only credentials and test selection. This module is never imported by client components. */
export function createLeadHandler(config, dependencies = {}) {
  const limit = createLimiter();
  const getEnv = dependencies.env ?? (() => ({}));
  const now = dependencies.now ?? (() => Date.now());
  const pause = dependencies.sleep ?? (ms => new Promise(resolve => setTimeout(resolve, ms)));
  const send = dependencies.fetch ?? globalThis.fetch;
  return async request => {
    const env = getEnv();
    const recipeHeader = request.headers.get('x-mc-form-test');
    const isTest = recipeHeader !== null;
    if (isTest && !equalSecret(recipeHeader, env.FORM_RECIPE_AUTH_TOKEN)) return error(401, 'Recette non autorisée.');
    if (request.headers.get('origin') !== config.siteOrigin || request.headers.get('sec-fetch-site') === 'cross-site') return error(403, 'Requête refusée.');
    if ((request.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase() !== 'application/json') return error(415, 'Format de requête invalide.');
    if (!formReceptionConfigured(config, env)) return error(503, 'Le formulaire est momentanément indisponible. Votre demande ne peut pas être confirmée.');
    const endpoint = httpsEndpoint(isTest ? env.N8N_WEBHOOK_TEST_URL : env.N8N_WEBHOOK_URL);
    const secret = isTest ? env.N8N_WEBHOOK_TEST_SECRET : env.N8N_WEBHOOK_SECRET;
    if (!endpoint || typeof secret !== 'string' || secret.length < 32) return error(503, 'Le formulaire est momentanément indisponible.');
    if (isTest && (endpoint === httpsEndpoint(env.N8N_WEBHOOK_URL) || secret === env.N8N_WEBHOOK_SECRET || secret === env.FORM_RECIPE_AUTH_TOKEN || env.N8N_WEBHOOK_SECRET === env.FORM_RECIPE_AUTH_TOKEN)) return error(503, 'La voie de recette est momentanément indisponible.');
    const parsed = await boundedJson(request);
    if (parsed.error) return error(parsed.error, parsed.error === 413 ? 'Requête trop volumineuse.' : 'Requête invalide.');
    const body = parsed.data;
    const allowed = [...config.fields, 'website', 'locale', 'submissionId', 'submittedAt', 'elapsedMs'];
    if (Object.keys(body).some(key => !allowed.includes(key))) return error(400, 'Champ de requête invalide.');
    const rawIp = (request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0] ?? '').trim();
    const ipKey = createHash('sha256').update(isIP(rawIp) ? rawIp : 'unknown').digest('hex');
    const rate = limit(`${isTest ? 'test' : 'production'}:${ipKey}`, now());
    if (!rate.allowed) return error(429, 'Trop de tentatives. Réessayez plus tard.', { 'Retry-After': String(rate.retryAfter) });
    if (typeof body.website === 'string' && body.website.trim()) return Response.json({ ok: true }, { headers: PRIVATE_HEADERS });
    if (!Number.isFinite(body.elapsedMs) || body.elapsedMs < MIN_ELAPSED_MS) return error(400, 'Veuillez patienter avant d’envoyer le formulaire.');
    if (!validSubmissionId(body.submissionId) || !validIsoDate(body.submittedAt)) return error(400, 'Identifiant de demande invalide.');
    const submissionId = body.submissionId.toLowerCase();
    const lead = {};
    for (const field of config.fields) {
      const value = body[field];
      if (typeof value !== 'string' || !value.trim() || value.length > 200) return error(400, 'Champ obligatoire manquant ou invalide.');
      lead[field] = value.trim();
    }
    if (!EMAIL.test(lead.email)) return error(400, 'E-mail invalide.');
    if (body.locale !== undefined && body.locale !== 'fr' && body.locale !== 'en') return error(400, 'Langue invalide.');
    const locale = body.locale === 'en' ? 'en' : 'fr';
    const payload = JSON.stringify({ version: 1, submissionId, submittedAt: body.submittedAt, source: config.source, locale, lead });
    let receipt = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await send(endpoint, { method: 'POST', redirect: 'error', headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' }, body: payload, signal: AbortSignal.timeout(16_000) });
        if (!response.ok) {
          await response.body?.cancel();
          if (response.status >= 500 || response.status === 408) throw new Error('RETRYABLE_UPSTREAM');
          break;
        }
        const acknowledgement = await boundedJson(response);
        if (acknowledgement.streamError) throw new Error('RETRYABLE_RESPONSE_STREAM');
        if (acknowledgement.error) break;
        receipt = readLeadReceipt(acknowledgement.data, { sourceId: config.sourceId, submissionId, isTest });
        break; // Invalid acknowledgements are configuration errors, never an accepted request.
      } catch {
        if (attempt < 2) await pause(250 * (attempt + 1));
      }
    }
    if (!receipt) { console.error('[lead] Réception durable non confirmée.'); return error(502, 'L’enregistrement n’a pas pu être confirmé. Réessayez sans modifier la demande.'); }
    if (!isTest && dependencies.measure) {
      try { await dependencies.measure(receipt, { request, locale }); } catch { console.error('[lead] Mesure indisponible après réception durable.'); }
    }
    return Response.json(receipt, { headers: { ...PRIVATE_HEADERS, 'x-mc-form-recipe': isTest ? '1' : '0' } });
  };
}
