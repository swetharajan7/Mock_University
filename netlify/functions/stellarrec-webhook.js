// Netlify Function: StellarRec Webhook Handler
// Handles both recommendation requests and completed recommendations

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const webhookData = JSON.parse(event.body);
    
    console.log('StellarRec webhook received:', webhookData);

    // Handle different webhook types
    switch (webhookData.type) {
      case 'recommendation_request':
        return await handleRecommendationRequest(webhookData, headers);
      
      case 'recommendation_completed':
        return await handleRecommendationCompleted(webhookData, headers);
      
      case 'recommendation_status_update':
        return await handleStatusUpdate(webhookData, headers);
      
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Unknown webhook type',
            type: webhookData.type 
          })
        };
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process webhook'
      })
    };
  }
};

async function handleRecommendationRequest(data, headers) {
  // When StellarRec sends initial recommendation request
  const request = {
    id: data.id || `req_${Date.now()}`,
    recommenderName: data.recommenderName,
    recommenderEmail: data.recommenderEmail,
    studentName: data.studentName,
    studentEmail: data.studentEmail,
    program: data.program,
    status: 'Pending',
    requestedAt: new Date().toISOString(),
    source: 'StellarRec',
    stellarrecId: data.stellarrecId
  };

  // In production, save to database
  console.log('Recommendation request processed:', request);

  // Notify MockUniversity frontend via postMessage simulation
  // (In real implementation, this would be handled by the frontend integration)

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Recommendation request received',
      requestId: request.id,
      status: 'pending',
      nextSteps: [
        'Recommender will receive email notification',
        'Status will update when recommendation is submitted',
        'Student will be notified of completion'
      ]
    })
  };
}

async function handleRecommendationCompleted(data, headers) {
  // When recommender completes the recommendation
  const recommendation = {
    id: data.id || data.requestId,
    recommenderName: data.recommenderName,
    recommenderEmail: data.recommenderEmail,
    studentName: data.studentName,
    studentEmail: data.studentEmail,
    program: data.program,
    status: 'Completed',
    content: data.content || data.letter,
    fileUrl: data.fileUrl, // URL to download the recommendation file
    fileType: data.fileType || 'PDF', // PDF, TXT, MOV, etc.
    completedAt: new Date().toISOString(),
    source: 'StellarRec',
    stellarrecId: data.stellarrecId
  };

  // In production, save to database and update existing record
  console.log('Recommendation completed:', recommendation);

  // Send notification to student
  const studentNotification = {
    to: recommendation.studentEmail,
    subject: 'Recommendation Completed - MockUniversity',
    template: 'recommendation-completed',
    data: {
      studentName: recommendation.studentName,
      recommenderName: recommendation.recommenderName,
      program: recommendation.program,
      fileType: recommendation.fileType,
      completedAt: recommendation.completedAt
    }
  };

  console.log('Student notification queued:', studentNotification);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Recommendation completed successfully',
      recommendationId: recommendation.id,
      status: 'completed',
      fileUrl: recommendation.fileUrl,
      fileType: recommendation.fileType,
      actions: [
        'Student has been notified',
        'Recommendation is now available for download',
        'Status updated in application portal'
      ]
    })
  };
}

async function handleStatusUpdate(data, headers) {
  // Handle status updates (in-progress, etc.)
  const update = {
    id: data.id,
    status: data.status,
    message: data.message,
    updatedAt: new Date().toISOString()
  };

  console.log('Status update processed:', update);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Status updated successfully',
      status: update.status,
      timestamp: update.updatedAt
    })
  };
}