// /netlify/functions/reco-status.js
import { createClient } from '@netlify/blobs';

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get('external_id');
  if (!id) return new Response('external_id required', { status: 400 });

  const blobs = createClient({ token: process.env.NETLIFY_BLOBS_TOKEN });
  const key = `recs/${id}.json`;
  const rec = await blobs.get(key).then(r => r?.body ? r.json() : null).catch(() => null);

  if (!rec) return new Response('Not found', { status: 404 });
  return Response.json(rec);
};