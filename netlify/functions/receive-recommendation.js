// Netlify Function: Receive Recommendation from StellarRec
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
    const requestData = JSON.parse(event.body);
    
    // Validate the request
    if (!requestData.type || requestData.type !== 'recommendation') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request type' })
      };
    }

    const recommendation = requestData.data;
    
    // Validate required fields
    const requiredFields = ['recommenderName', 'recommenderEmail', 'studentName', 'studentEmail'];
    const missingFields = requiredFields.filter(field => !recommendation[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields', 
          missingFields 
        })
      };
    }

    // Process the recommendation
    const processedRecommendation = {
      id: recommendation.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recommenderName: recommendation.recommenderName,
      recommenderEmail: recommendation.recommenderEmail,
      recommenderTitle: recommendation.recommenderTitle || '',
      studentName: recommendation.studentName,
      studentEmail: recommendation.studentEmail,
      program: recommendation.program || 'Not specified',
      status: recommendation.status || 'Received',
      content: recommendation.content || recommendation.letter || '',
      submittedAt: recommendation.submittedAt || new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      source: 'StellarRec',
      universityId: 'mock-university',
      metadata: {
        stellarrecId: recommendation.stellarrecId,
        ipAddress: event.headers['x-forwarded-for'] || event.headers['client-ip'],
        userAgent: event.headers['user-agent'],
        originalPayload: recommendation
      }
    };

    // In a real application, you would:
    // 1. Save to database
    // 2. Send notification to student
    // 3. Update application status
    // 4. Log the transaction

    console.log('Recommendation received:', {
      id: processedRecommendation.id,
      recommender: processedRecommendation.recommenderName,
      student: processedRecommendation.studentName,
      timestamp: processedRecommendation.receivedAt
    });

    // Simulate database storage
    const storageKey = `recommendation_${processedRecommendation.id}`;
    console.log(`Storing recommendation with key: ${storageKey}`);

    // Send confirmation email to student (simulated)
    const studentNotification = {
      to: processedRecommendation.studentEmail,
      subject: 'Recommendation Received - MockUniversity',
      template: 'recommendation-received',
      data: {
        studentName: processedRecommendation.studentName,
        recommenderName: processedRecommendation.recommenderName,
        program: processedRecommendation.program,
        receivedAt: processedRecommendation.receivedAt
      }
    };

    console.log('Student notification queued:', studentNotification);

    // Send confirmation to recommender (simulated)
    const recommenderNotification = {
      to: processedRecommendation.recommenderEmail,
      subject: 'Recommendation Delivered - MockUniversity',
      template: 'recommendation-delivered',
      data: {
        recommenderName: processedRecommendation.recommenderName,
        studentName: processedRecommendation.studentName,
        university: 'MockUniversity',
        deliveredAt: processedRecommendation.receivedAt
      }
    };

    console.log('Recommender notification queued:', recommenderNotification);

    // Update application status
    const applicationUpdate = {
      studentEmail: processedRecommendation.studentEmail,
      updates: {
        recommendationsReceived: 1,
        lastRecommendationAt: processedRecommendation.receivedAt,
        applicationStatus: 'recommendations-received'
      }
    };

    console.log('Application status update:', applicationUpdate);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Recommendation received successfully',
        recommendationId: processedRecommendation.id,
        status: 'received',
        timestamp: processedRecommendation.receivedAt,
        nextSteps: [
          'Recommendation has been added to the student\'s application',
          'Student has been notified via email',
          'Recommender has received delivery confirmation'
        ]
      })
    };

  } catch (error) {
    console.error('Recommendation processing error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process recommendation. Please try again.',
        timestamp: new Date().toISOString()
      })
    };
  }
};