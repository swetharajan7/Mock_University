// /netlify/functions/get-recommendation-data.js
import { createClient } from '@netlify/blobs';

export default async (req) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers });
  }

  const url = new URL(req.url);
  const external_id = url.searchParams.get('external_id');
  
  if (!external_id) {
    return new Response(JSON.stringify({ error: 'external_id required' }), { 
      status: 400, 
      headers 
    });
  }

  try {
    const blobs = createClient({ token: process.env.NETLIFY_BLOBS_TOKEN });
    const key = `recs/${external_id}.json`;
    const rec = await blobs.get(key).then(r => r?.body ? r.json() : null).catch(() => null);

    if (!rec) {
      return new Response(JSON.stringify({ error: 'Recommendation not found' }), { 
        status: 404, 
        headers 
      });
    }

    // Return the recommendation data
    return new Response(JSON.stringify({
      success: true,
      data: {
        external_id: rec.external_id,
        student_name: rec.student_name,
        student_email: rec.student_email,
        recommender_name: rec.recommender_name,
        recommender_email: rec.recommender_email,
        status: rec.status,
        letter_content: rec.letter_content || '',
        letter_format: rec.letter_format || 'text',
        artifact_url: rec.artifact_url || '',
        created_at: rec.created_at,
        updated_at: rec.updated_at
      }
    }), { 
      status: 200, 
      headers 
    });

  } catch (error) {
    console.error('Error retrieving recommendation:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), { 
      status: 500, 
      headers 
    });
  }
};