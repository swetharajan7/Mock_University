const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const external_id = (new URL(event.rawUrl)).searchParams.get('external_id');
  if (!external_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'external_id required' }) };
  }
  const store = getStore('recs');
  const data = await store.get(external_id);
  if (!data) return { statusCode: 204, body: '' };

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: data
  };
};