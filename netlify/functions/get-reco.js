// Simple retrieval function (temporary solution)
exports.handler = async (event) => {
  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
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

  let external_id;
  try {
    const url = new URL(event.rawUrl || `https://example.com${event.path}?${event.queryStringParameters ? Object.entries(event.queryStringParameters).map(([k,v]) => `${k}=${v}`).join('&') : ''}`);
    external_id = url.searchParams.get('external_id');
  } catch (e) {
    // Fallback to query string parameters
    external_id = event.queryStringParameters?.external_id;
  }

  if (!external_id) {
    return { 
      statusCode: 400, 
      headers: corsHeaders,
      body: JSON.stringify({ error: 'external_id required' }) 
    };
  }
  
  // For demo purposes, return mock data for specific external_ids
  const mockData = {
    'sr_1757777572835': {
      external_id: 'sr_1757777572835',
      recommender_name: 'Prof. Manas Mohan Nand',
      status: 'Completed',
      file_url: 'https://stellarrec.netlify.app/assets/mock/reco-demo.pdf',
      updated_at: new Date().toISOString()
    },
    'sr_1757776967844': {
      external_id: 'sr_1757776967844',
      recommender_name: 'Prof. Manas Mohan Nand',
      status: 'Completed',
      file_url: 'https://stellarrec.netlify.app/assets/mock/reco-demo.pdf',
      updated_at: new Date().toISOString()
    },
    'sr_1757775985322': {
      external_id: 'sr_1757775985322',
      recommender_name: 'Prof. Manas Mohan Nand',
      status: 'Completed',
      file_url: 'https://stellarrec.netlify.app/assets/mock/reco-demo.pdf',
      updated_at: new Date().toISOString()
    }
  };

  const data = mockData[external_id];
  
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
    body: JSON.stringify(data)
  };
};