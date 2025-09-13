// Returns recommendation payload for external_id
import { getStore } from '@netlify/blobs';

export default async (req) => {
  const url = new URL(req.url);
  const external_id = url.searchParams.get('external_id');
  if (!external_id) {
    return new Response(JSON.stringify({ error: 'external_id required' }), { status: 400 });
  }

  const store = getStore('recs');
  const data = await store.get(external_id);

  if (!data) {
    // 204 = no content, easier for front-end to handle
    return new Response(null, { status: 204 });
  }

  return new Response(data, { headers: { 'content-type': 'application/json' } });
};