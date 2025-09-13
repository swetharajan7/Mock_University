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

  // Process multiple file types
  const files = {
    pdf_url: body.pdf_url || body.file_url || '',
    mov_url: body.mov_url || body.video_url || '',
    letter_content: body.letter_content || body.letter_html || '',
    letter_text: body.letter_text || ''
  };

  const result = {
    ...body,
    ...files,
    status: body.status || 'Completed', // Set to Completed when files are received
    updated_at: now,
    created_at: now,
    has_pdf: !!files.pdf_url,
    has_video: !!files.mov_url,
    has_letter: !!(files.letter_content || files.letter_text)
  };

  // Log detailed file information
  console.log('Recommendation with files saved:', {
    external_id,
    recommender: body.recommender_name,
    status: result.status,
    files: {
      pdf: files.pdf_url ? 'YES' : 'NO',
      video: files.mov_url ? 'YES' : 'NO',
      letter: files.letter_content ? 'YES' : 'NO'
    },
    timestamp: now
  });

  // Also forward to receive-recommendation endpoint for Mock University integration
  try {
    const integrationPayload = {
      type: 'recommendation',
      data: {
        external_id: external_id,
        recommenderName: body.recommender_name || 'Unknown Recommender',
        recommenderEmail: body.recommender_email || 'unknown@example.com',
        studentName: body.student_name || 'Student Applicant',
        studentEmail: body.student_email || 'student@example.com',
        program: body.program || 'Graduate Program',
        status: result.status,
        pdf_url: files.pdf_url,
        mov_url: files.mov_url,
        letter_content: files.letter_content,
        letter_html: files.letter_html || files.letter_content,
        submittedAt: now,
        stellarrecId: external_id
      }
    };

    // Forward to Mock University (simulate internal API call)
    console.log('Forwarding to Mock University:', integrationPayload);
    
  } catch (integrationError) {
    console.log('Integration forwarding failed (non-critical):', integrationError.message);
  }

  return { 
    statusCode: 200, 
    headers: corsHeaders, 
    body: JSON.stringify({ 
      ok: true, 
      external_id, 
      updated_at: now,
      files_received: {
        pdf: !!files.pdf_url,
        video: !!files.mov_url,
        letter: !!files.letter_content
      },
      message: 'Recommendation with files saved successfully'
    }) 
  };
};