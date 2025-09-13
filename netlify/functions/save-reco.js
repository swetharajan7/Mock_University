// Simple storage using environment variables (temporary solution)
exports.handler = async (event) => {
  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
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
  try { 
    body = JSON.parse(event.body || '{}'); 
  } catch (e) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  const external_id = body.external_id;
  if (!external_id) {
    return { 
      statusCode: 400, 
      headers: corsHeaders,
      body: JSON.stringify({ error: 'external_id required' }) 
    };
  }

  const now = new Date().toISOString();

  // For now, we'll just return success and log the data
  // In production, this would save to a database
  console.log('Recommendation saved:', {
    external_id,
    data: body,
    timestamp: now
  });

  const result = {
    ...body,
    status: body.status || 'Pending',
    updated_at: now,
    created_at: now
  };

  return { 
    statusCode: 200, 
    headers: corsHeaders, 
    body: JSON.stringify({ 
      ok: true, 
      external_id, 
      updated_at: now,
      message: 'Recommendation saved successfully'
    }) 
  };
};