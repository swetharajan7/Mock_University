// CommonJS version to avoid ESM config issues
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://stellarrec.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Use POST' })
    };
  }
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}
  const external_id = body.external_id;
  if (!external_id) {
    return { 
      statusCode: 400, 
      headers: corsHeaders,
      body: JSON.stringify({ error: 'external_id required' }) 
    };
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

  return { 
    statusCode: 200, 
    headers: corsHeaders, 
    body: JSON.stringify({ ok: true, external_id, updated_at: now }) 
  };
};