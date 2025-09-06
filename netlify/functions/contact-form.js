// Netlify Function: Contact Form
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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
    const contactData = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !contactData[field]);
    
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

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Process contact form
    const processedContact = {
      id: `CONTACT-${Date.now()}`,
      ...contactData,
      status: 'received',
      submittedAt: new Date().toISOString(),
      priority: getPriority(contactData.subject),
      assignedTo: getAssignedDepartment(contactData.subject)
    };

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 300));

    console.log('Contact form processed:', processedContact);

    // Route to appropriate department
    const departmentRouting = {
      'admissions': 'admissions@mockuniversity.edu',
      'programs': 'academic@mockuniversity.edu',
      'technical': 'support@mockuniversity.edu',
      'financial': 'financial@mockuniversity.edu',
      'other': 'info@mockuniversity.edu'
    };

    const routingEmail = departmentRouting[contactData.subject] || departmentRouting.other;

    // Auto-reply email (simulated)
    const autoReply = {
      to: contactData.email,
      subject: `Re: ${contactData.subject} - MockUniversity`,
      template: 'contact-auto-reply',
      data: {
        name: contactData.name,
        ticketId: processedContact.id,
        subject: contactData.subject,
        estimatedResponse: getEstimatedResponseTime(contactData.subject)
      }
    };

    // Department notification (simulated)
    const departmentNotification = {
      to: routingEmail,
      subject: `New Contact Form: ${contactData.subject}`,
      template: 'contact-notification',
      data: {
        ...processedContact,
        priority: processedContact.priority
      }
    };

    console.log('Auto-reply queued:', autoReply);
    console.log('Department notification queued:', departmentNotification);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Message sent successfully',
        ticketId: processedContact.id,
        estimatedResponse: getEstimatedResponseTime(contactData.subject),
        assignedTo: processedContact.assignedTo
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to send message. Please try again.'
      })
    };
  }
};

function getPriority(subject) {
  const highPriority = ['technical', 'financial'];
  const mediumPriority = ['admissions', 'programs'];
  
  if (highPriority.includes(subject)) return 'high';
  if (mediumPriority.includes(subject)) return 'medium';
  return 'normal';
}

function getAssignedDepartment(subject) {
  const departments = {
    'admissions': 'Admissions Office',
    'programs': 'Academic Affairs',
    'technical': 'IT Support',
    'financial': 'Financial Aid',
    'other': 'General Information'
  };
  
  return departments[subject] || departments.other;
}

function getEstimatedResponseTime(subject) {
  const responseTimes = {
    'technical': '2-4 hours',
    'financial': '4-8 hours',
    'admissions': '24-48 hours',
    'programs': '24-48 hours',
    'other': '48-72 hours'
  };
  
  return responseTimes[subject] || responseTimes.other;
}