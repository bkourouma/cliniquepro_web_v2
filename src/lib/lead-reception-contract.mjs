const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const OPAQUE = /^[A-Za-z0-9_-]{8,100}$/;
const ACK_KEYS = ['version', 'accepted', 'sourceId', 'submissionId', 'receiptId', 'receivedAt', 'duplicate', 'isTest'];

export function validSubmissionId(value) { return typeof value === 'string' && UUID.test(value); }
export function validIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}

/** Only a correlated durable receipt is an acknowledgement; HTTP 200 alone is insufficient. */
export function readLeadReceipt(value, expected) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (Object.keys(value).length !== ACK_KEYS.length || Object.keys(value).some(key => !ACK_KEYS.includes(key))) return null;
  if (!validSubmissionId(value.submissionId) || !validSubmissionId(expected.submissionId)) return null;
  const submissionId = value.submissionId.toLowerCase();
  if (value.version !== 1 || value.accepted !== true || value.sourceId !== expected.sourceId || submissionId !== expected.submissionId.toLowerCase() || value.isTest !== expected.isTest) return null;
  if (typeof value.receiptId !== 'string' || !OPAQUE.test(value.receiptId) || !validIsoDate(value.receivedAt) || typeof value.duplicate !== 'boolean') return null;
  return { version: 1, accepted: true, sourceId: value.sourceId, submissionId, receiptId: value.receiptId, receivedAt: value.receivedAt, duplicate: value.duplicate, isTest: value.isTest };
}
