// Netlify Function: Student Authentication
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
    const { studentId, password } = JSON.parse(event.body);

    // Validate input
    if (!studentId || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Student ID and password are required' })
      };
    }

    // Demo student database (in production, this would be a real database)
    const students = [
      {
        studentId: 'DEMO001',
        password: 'password123', // In production, this would be hashed
        name: 'Demo Student',
        email: 'demo@mockuniversity.edu',
        program: 'Computer Science',
        year: 2,
        gpa: 3.8,
        courses: [
          { code: 'CS301', name: 'Data Structures', credits: 3, grade: 'A' },
          { code: 'CS302', name: 'Algorithms', credits: 3, grade: 'A-' },
          { code: 'CS303', name: 'Database Systems', credits: 3, grade: 'B+' },
          { code: 'CS304', name: 'Web Development', credits: 3, grade: 'A' }
        ]
      },
      {
        studentId: 'STUDENT1',
        password: 'mockuniv2025',
        name: 'Jane Smith',
        email: 'jane.smith@mockuniversity.edu',
        program: 'Business Administration',
        year: 3,
        gpa: 3.6,
        courses: [
          { code: 'BUS401', name: 'Strategic Management', credits: 3, grade: 'B+' },
          { code: 'BUS402', name: 'Marketing Analytics', credits: 3, grade: 'A-' },
          { code: 'BUS403', name: 'Financial Management', credits: 3, grade: 'B' },
          { code: 'BUS404', name: 'Operations Management', credits: 3, grade: 'A' }
        ]
      }
    ];

    // Find student
    const student = students.find(s => s.studentId === studentId);

    if (!student || student.password !== password) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid credentials',
          message: 'Student ID or password is incorrect'
        })
      };
    }

    // Generate session token (in production, use JWT or similar)
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Remove password from response
    const { password: _, ...studentData } = student;

    // Calculate current semester info
    const currentSemester = {
      term: 'Spring 2025',
      coursesEnrolled: student.courses.length,
      creditsEnrolled: student.courses.reduce((sum, course) => sum + course.credits, 0),
      upcomingAssignments: [
        { course: student.courses[0]?.code, assignment: 'Final Project', dueDate: '2025-03-15' },
        { course: student.courses[1]?.code, assignment: 'Midterm Exam', dueDate: '2025-03-10' }
      ]
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Authentication successful',
        sessionToken,
        student: {
          ...studentData,
          currentSemester,
          lastLogin: new Date().toISOString()
        }
      })
    };

  } catch (error) {
    console.error('Authentication error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Authentication failed. Please try again.'
      })
    };
  }
};