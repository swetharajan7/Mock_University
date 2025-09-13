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

    // Process files from the recommendation
    const files = {
      pdf_url: recommendation.pdf_url || recommendation.pdfUrl || recommendation.file_url || '',
      mov_url: recommendation.mov_url || recommendation.movUrl || recommendation.video_url || recommendation.videoUrl || '',
      letter_content: recommendation.letter_content || recommendation.letterContent || recommendation.content || recommendation.letter || '',
      letter_html: recommendation.letter_html || recommendation.letterHtml || ''
    };

    // Process the recommendation
    const processedRecommendation = {
      id: recommendation.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      external_id: recommendation.external_id || recommendation.externalId || `sr_${Date.now()}`,
      recommenderName: recommendation.recommenderName || recommendation.recommender_name,
      recommenderEmail: recommendation.recommenderEmail || recommendation.recommender_email,
      recommenderTitle: recommendation.recommenderTitle || recommendation.recommender_title || '',
      studentName: recommendation.studentName || recommendation.student_name,
      studentEmail: recommendation.studentEmail || recommendation.student_email,
      program: recommendation.program || 'Not specified',
      status: recommendation.status || 'Completed', // Set to Completed when files are received
      
      // File URLs
      pdf_url: files.pdf_url,
      mov_url: files.mov_url,
      letter_content: files.letter_content,
      letter_html: files.letter_html,
      
      // File flags
      has_pdf: !!files.pdf_url,
      has_video: !!files.mov_url,
      has_letter: !!(files.letter_content || files.letter_html),
      
      submittedAt: recommendation.submittedAt || new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

    console.log('Recommendation received with files:', {
      id: processedRecommendation.id,
      external_id: processedRecommendation.external_id,
      recommender: processedRecommendation.recommenderName,
      student: processedRecommendation.studentName,
      files: {
        pdf: processedRecommendation.has_pdf ? 'YES' : 'NO',
        video: processedRecommendation.has_video ? 'YES' : 'NO',
        letter: processedRecommendation.has_letter ? 'YES' : 'NO'
      },
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
        message: 'Recommendation with files received successfully',
        recommendationId: processedRecommendation.id,
        external_id: processedRecommendation.external_id,
        status: processedRecommendation.status,
        files_received: {
          pdf: processedRecommendation.has_pdf,
          video: processedRecommendation.has_video,
          letter: processedRecommendation.has_letter
        },
        timestamp: processedRecommendation.receivedAt,
        nextSteps: [
          'Recommendation files have been added to the student\'s application',
          'Student can now view PDF and video files',
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