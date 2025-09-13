// CommonJS version to avoid ESM config issues
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Use POST' };
  }
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}
  const external_id = body.external_id;
  if (!external_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'external_id required' }) };
  }

  const store = getStore('recs');
  const now = new Date().toISOString();

  let existing = {};
  const prev = await store.get(external_id);
  if (prev) { try { existing = JSON.parse(prev); } catch {} }

  const merged = {
    ...existing,
    ...body,
    status: body.status || existing.status || 'Pending',
    updated_at: now,
  };

  await store.set(external_id, JSON.stringify(merged));

  // CORS so StellarRec can POST cross-origin
  const headers = {
    'content-type': 'application/json',
    'access-control-allow-origin': 'https://stellarrec.netlify.app',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'POST, OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true, external_id, updated_at: now }) };
};