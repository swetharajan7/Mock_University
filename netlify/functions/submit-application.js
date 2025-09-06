// Netlify Function: Submit Application
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const applicationData = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'program', 'message'];
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Process application (in a real app, this would save to a database)
    const processedApplication = {
      id: `APP-${Date.now()}`,
      ...applicationData,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      reviewStatus: 'pending'
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real application, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Notify admissions team
    // 4. Generate application tracking number

    console.log('Application processed:', processedApplication);

    // Send confirmation email (simulated)
    const emailConfirmation = {
      to: applicationData.email,
      subject: 'Application Received - MockUniversity',
      template: 'application-confirmation',
      data: {
        name: applicationData.name,
        program: applicationData.program,
        applicationId: processedApplication.id
      }
    };

    console.log('Email confirmation queued:', emailConfirmation);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Application submitted successfully',
        applicationId: processedApplication.id,
        status: processedApplication.status,
        estimatedReviewTime: '3-5 business days'
      })
    };

  } catch (error) {
    console.error('Application submission error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process application. Please try again.'
      })
    };
  }
};