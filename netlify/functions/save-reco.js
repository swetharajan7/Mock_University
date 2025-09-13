// Saves/updates a recommendation payload keyed by external_id
import { getStore } from '@netlify/blobs';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Use POST', { status: 405 });
  }

  const body = await req.json().catch(() => ({}));
  const { external_id } = body || {};
  if (!external_id) {
    return new Response(JSON.stringify({ error: 'external_id required' }), { status: 400 });
  }

  const store = getStore('recs'); // automatic, per-site namespace
  const now = new Date().toISOString();

  // merge existing + new
  const existingRaw = await store.get(external_id);
  const existing = existingRaw ? JSON.parse(existingRaw) : {};

  const merged = {
    ...existing,
    ...body,
    updated_at: now,
    // backfill status if not provided
    status: body.status || existing.status || 'Pending',
  };

  await store.set(external_id, JSON.stringify(merged));

  return new Response(JSON.stringify({ ok: true, external_id, updated_at: now }), {
    headers: { 'content-type': 'application/json' }
  });
};