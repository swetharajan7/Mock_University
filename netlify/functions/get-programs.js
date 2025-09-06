// Netlify Function: Get Academic Programs
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Academic programs database
    const programs = [
      {
        id: 'computer-science',
        title: 'Computer Science',
        description: 'Master programming, AI, and software engineering with hands-on projects and industry partnerships.',
        duration: '4 years',
        credits: 120,
        tuition: '$45,000/year',
        format: 'Online & Hybrid',
        accreditation: 'ABET Accredited',
        features: [
          'Machine Learning & AI',
          'Full-Stack Development',
          'Cybersecurity',
          'Data Science',
          'Cloud Computing',
          'Mobile Development'
        ],
        careers: [
          { title: 'Software Engineer', salary: '$95,000 - $150,000' },
          { title: 'Data Scientist', salary: '$100,000 - $160,000' },
          { title: 'AI Researcher', salary: '$120,000 - $180,000' },
          { title: 'Cybersecurity Analyst', salary: '$85,000 - $130,000' }
        ],
        curriculum: [
          { semester: 1, courses: ['Programming Fundamentals', 'Mathematics for CS', 'Computer Systems'] },
          { semester: 2, courses: ['Data Structures', 'Algorithms', 'Database Design'] },
          { semester: 3, courses: ['Software Engineering', 'Web Development', 'Operating Systems'] },
          { semester: 4, courses: ['Machine Learning', 'Capstone Project', 'Professional Development'] }
        ],
        faculty: [
          { name: 'Dr. Sarah Chen', specialization: 'Artificial Intelligence', experience: '15 years' },
          { name: 'Prof. Michael Rodriguez', specialization: 'Cybersecurity', experience: '12 years' }
        ]
      },
      {
        id: 'business-administration',
        title: 'Business Administration',
        description: 'Develop leadership skills and business acumen for the modern marketplace.',
        duration: '4 years',
        credits: 120,
        tuition: '$42,000/year',
        format: 'Online & Hybrid',
        accreditation: 'AACSB Accredited',
        features: [
          'Digital Marketing',
          'Entrepreneurship',
          'Finance & Analytics',
          'Global Business',
          'Supply Chain Management',
          'Leadership Development'
        ],
        careers: [
          { title: 'Business Manager', salary: '$75,000 - $120,000' },
          { title: 'Marketing Director', salary: '$85,000 - $140,000' },
          { title: 'Financial Analyst', salary: '$70,000 - $110,000' },
          { title: 'Entrepreneur', salary: 'Variable' }
        ],
        curriculum: [
          { semester: 1, courses: ['Business Fundamentals', 'Economics', 'Accounting Principles'] },
          { semester: 2, courses: ['Marketing Strategy', 'Operations Management', 'Business Law'] },
          { semester: 3, courses: ['Financial Management', 'International Business', 'Digital Marketing'] },
          { semester: 4, courses: ['Strategic Management', 'Business Capstone', 'Leadership Seminar'] }
        ],
        faculty: [
          { name: 'Dr. Jennifer Walsh', specialization: 'Strategic Management', experience: '18 years' },
          { name: 'Prof. David Kim', specialization: 'Digital Marketing', experience: '10 years' }
        ]
      },
      {
        id: 'psychology',
        title: 'Psychology',
        description: 'Explore human behavior and mental processes with cutting-edge research opportunities.',
        duration: '4 years',
        credits: 120,
        tuition: '$40,000/year',
        format: 'Online & Hybrid',
        accreditation: 'APA Accredited',
        features: [
          'Clinical Psychology',
          'Cognitive Science',
          'Research Methods',
          'Behavioral Analysis',
          'Developmental Psychology',
          'Social Psychology'
        ],
        careers: [
          { title: 'Clinical Psychologist', salary: '$80,000 - $120,000' },
          { title: 'Research Scientist', salary: '$75,000 - $110,000' },
          { title: 'Counselor', salary: '$50,000 - $80,000' },
          { title: 'HR Specialist', salary: '$60,000 - $90,000' }
        ],
        curriculum: [
          { semester: 1, courses: ['Introduction to Psychology', 'Research Methods', 'Statistics'] },
          { semester: 2, courses: ['Cognitive Psychology', 'Developmental Psychology', 'Social Psychology'] },
          { semester: 3, courses: ['Abnormal Psychology', 'Clinical Methods', 'Psychological Testing'] },
          { semester: 4, courses: ['Advanced Research', 'Practicum', 'Senior Thesis'] }
        ],
        faculty: [
          { name: 'Dr. Emily Thompson', specialization: 'Clinical Psychology', experience: '20 years' },
          { name: 'Prof. Robert Martinez', specialization: 'Cognitive Science', experience: '14 years' }
        ]
      },
      {
        id: 'biotechnology',
        title: 'Biotechnology',
        description: 'Advance healthcare and environmental solutions through innovative biotechnology.',
        duration: '4 years',
        credits: 120,
        tuition: '$48,000/year',
        format: 'Hybrid (Lab Required)',
        accreditation: 'ABET Accredited',
        features: [
          'Genetic Engineering',
          'Pharmaceutical Research',
          'Environmental Biotech',
          'Medical Devices',
          'Bioinformatics',
          'Regulatory Affairs'
        ],
        careers: [
          { title: 'Biotech Researcher', salary: '$85,000 - $130,000' },
          { title: 'Lab Technician', salary: '$45,000 - $70,000' },
          { title: 'Product Developer', salary: '$90,000 - $140,000' },
          { title: 'Quality Analyst', salary: '$65,000 - $95,000' }
        ],
        curriculum: [
          { semester: 1, courses: ['Biology Fundamentals', 'Chemistry', 'Mathematics'] },
          { semester: 2, courses: ['Molecular Biology', 'Genetics', 'Biochemistry'] },
          { semester: 3, courses: ['Biotechnology Methods', 'Bioinformatics', 'Research Project'] },
          { semester: 4, courses: ['Advanced Biotech', 'Industry Internship', 'Capstone Project'] }
        ],
        faculty: [
          { name: 'Dr. Lisa Park', specialization: 'Genetic Engineering', experience: '16 years' },
          { name: 'Prof. James Wilson', specialization: 'Pharmaceutical Research', experience: '22 years' }
        ]
      }
    ];

    // Get specific program if ID provided
    const programId = event.queryStringParameters?.id;
    if (programId) {
      const program = programs.find(p => p.id === programId);
      if (!program) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Program not found' })
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ program })
      };
    }

    // Return all programs
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        programs,
        totalPrograms: programs.length,
        lastUpdated: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Get programs error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to retrieve programs'
      })
    };
  }
};