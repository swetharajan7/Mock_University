const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://stellarrec.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  const external_id = (new URL(event.rawUrl)).searchParams.get('external_id');
  if (!external_id) {
    return { 
      statusCode: 400, 
      headers: corsHeaders,
      body: JSON.stringify({ error: 'external_id required' }) 
    };
  }
  
  const store = getStore('recs');
  const data = await store.get(external_id);
  
  if (!data) {
    return { 
      statusCode: 204, 
      headers: corsHeaders,
      body: '' 
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: data
  };
};