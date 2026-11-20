import { validIsoDate, validSubmissionId } from './lead-reception-contract.mjs';
export { readLeadReceipt } from './lead-reception-contract.mjs';
const TTL = 24 * 60 * 60 * 1000;
const memory = new Map();
const unavailableWrites = new WeakMap();
function browserStorage() { try { return globalThis.window?.sessionStorage ?? null; } catch { return null; } }

/** Only UUID, times and an irreversible payload fingerprint are persisted; never contact fields. */
export async function getSubmissionMetadata(source, lead, locale, options = {}) {
  const now = options.now ?? Date.now();
  const storage = options.storage ?? browserStorage();
  const fields = Object.entries(lead).filter(([key]) => !['website', 'submissionId', 'submittedAt', 'elapsedMs'].includes(key)).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : '']).sort(([a], [b]) => a.localeCompare(b));
  const canonical = JSON.stringify({ source, locale, fields });
  const bytes = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical));
  const fingerprint = [...new Uint8Array(bytes)].map(value => value.toString(16).padStart(2, '0')).join('');
  const key = `mc-form-reception:${source}`;
  let existing;
  let stored;
  try { stored = storage ? storage.getItem(key) : memory.get(key); } catch { stored = memory.get(key); }
  if (storage && unavailableWrites.get(storage)?.has(key)) stored = memory.get(key);
  try { existing = JSON.parse(stored ?? 'null'); } catch { /* Corrupt metadata is not reused. */ }
  if (existing?.version === 1 && existing.fingerprint === fingerprint && validSubmissionId(existing.submissionId) && validIsoDate(existing.submittedAt) && Date.parse(existing.submittedAt) <= now && Number.isFinite(existing.expiresAt) && existing.expiresAt > now && existing.expiresAt <= Date.parse(existing.submittedAt) + TTL) {
    return { submissionId: existing.submissionId.toLowerCase(), submittedAt: existing.submittedAt };
  }
  const metadata = { version: 1, submissionId: globalThis.crypto.randomUUID().toLowerCase(), submittedAt: new Date(now).toISOString(), fingerprint, expiresAt: now + TTL };
  const serialized = JSON.stringify(metadata); memory.set(key, serialized);
  try { storage?.setItem(key, serialized); if (storage) unavailableWrites.get(storage)?.delete(key); }
  catch { if (storage) { if (!unavailableWrites.has(storage)) unavailableWrites.set(storage, new Set()); unavailableWrites.get(storage).add(key); } }
  return { submissionId: metadata.submissionId, submittedAt: metadata.submittedAt };
}
