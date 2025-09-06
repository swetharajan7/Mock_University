// MockUniversity Frontend JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('MockUniversity loaded successfully!');
    
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Application form handler
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const applicationData = {
                name: formData.get('name'),
                email: formData.get('email'),
                program: formData.get('program'),
                message: formData.get('message'),
                timestamp: new Date().toISOString(),
                status: 'submitted'
            };
            
            // Simulate backend API call
            submitApplication(applicationData);
        });
    }

    // Student login form handler
    const studentLoginForm = document.getElementById('studentLoginForm');
    if (studentLoginForm) {
        studentLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const loginData = {
                studentId: formData.get('studentId'),
                password: formData.get('password')
            };
            
            // Simulate student portal login
            authenticateStudent(loginData);
        });
    }

    // Contact form handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const contactData = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };
            
            // Simulate contact form submission
            submitContactForm(contactData);
        });
    }

    // Initialize animations on scroll
    initScrollAnimations();
});

// Global functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showProgramDetails(programId) {
    const programs = {
        cs: {
            title: 'Computer Science',
            description: 'Our Computer Science program combines theoretical foundations with practical skills in programming, algorithms, and system design.',
            duration: '4 years',
            credits: '120 credits',
            careers: ['Software Engineer', 'Data Scientist', 'AI Researcher', 'Cybersecurity Analyst']
        },
        business: {
            title: 'Business Administration',
            description: 'Develop comprehensive business skills including management, marketing, finance, and strategic planning.',
            duration: '4 years',
            credits: '120 credits',
            careers: ['Business Manager', 'Marketing Director', 'Financial Analyst', 'Entrepreneur']
        },
        psychology: {
            title: 'Psychology',
            description: 'Explore human behavior, cognition, and mental processes through research and practical application.',
            duration: '4 years',
            credits: '120 credits',
            careers: ['Clinical Psychologist', 'Research Scientist', 'Counselor', 'HR Specialist']
        },
        biotech: {
            title: 'Biotechnology',
            description: 'Apply biological principles to develop innovative solutions in healthcare, agriculture, and environmental science.',
            duration: '4 years',
            credits: '120 credits',
            careers: ['Biotech Researcher', 'Lab Technician', 'Product Developer', 'Quality Analyst']
        }
    };

    const program = programs[programId];
    if (program) {
        showModal(`
            <div class="program-modal">
                <h2>${program.title}</h2>
                <p>${program.description}</p>
                <div class="program-details">
                    <div><strong>Duration:</strong> ${program.duration}</div>
                    <div><strong>Credits:</strong> ${program.credits}</div>
                    <div><strong>Career Paths:</strong></div>
                    <ul>
                        ${program.careers.map(career => `<li>${career}</li>`).join('')}
                    </ul>
                </div>
                <button class="btn btn-primary" onclick="scrollToSection('admissions'); closeModal();">Apply Now</button>
            </div>
        `);
    }
}

function showModal(content) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 2rem;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 2rem;
        max-width: 500px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    modalContent.innerHTML = content + `
        <button onclick="closeModal()" style="
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        ">&times;</button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Backend API functions
async function submitApplication(applicationData) {
    try {
        showNotification('Submitting your application...', 'info');
        
        const response = await fetch('/.netlify/functions/submit-application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(applicationData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification(`Application submitted successfully! Application ID: ${result.applicationId}`, 'success');
            document.getElementById('applicationForm').reset();
        } else {
            throw new Error(result.message || 'Application submission failed');
        }
        
    } catch (error) {
        console.error('Application submission error:', error);
        showNotification('There was an error submitting your application. Please try again.', 'error');
        
        // Fallback to localStorage for offline functionality
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        applicationData.id = Date.now().toString();
        applications.push(applicationData);
        localStorage.setItem('applications', JSON.stringify(applications));
        showNotification('Application saved locally. We\'ll process it when connection is restored.', 'info');
    }
}

async function authenticateStudent(loginData) {
    try {
        showNotification('Authenticating...', 'info');
        
        const response = await fetch('/.netlify/functions/student-auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Login successful! Welcome back!', 'success');
            
            // Store session
            localStorage.setItem('studentSession', JSON.stringify({
                studentId: result.student.studentId,
                sessionToken: result.sessionToken,
                loginTime: new Date().toISOString()
            }));
            
            // Show dashboard
            setTimeout(() => {
                showModal(`
                    <div class="dashboard-preview">
                        <h2>Student Dashboard</h2>
                        <p>Welcome back, ${result.student.name}!</p>
                        <div class="dashboard-items">
                            <div class="dashboard-item">📚 Current Courses: ${result.student.currentSemester.coursesEnrolled}</div>
                            <div class="dashboard-item">📊 GPA: ${result.student.gpa}</div>
                            <div class="dashboard-item">📝 Program: ${result.student.program}</div>
                            <div class="dashboard-item">📅 Year: ${result.student.year}</div>
                        </div>
                        <p><em>Full dashboard functionality available in production!</em></p>
                    </div>
                `);
            }, 1000);
            
        } else {
            showNotification(result.message || 'Invalid credentials. Try DEMO001 / password123', 'error');
        }
        
    } catch (error) {
        console.error('Authentication error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

async function submitContactForm(contactData) {
    try {
        showNotification('Sending your message...', 'info');
        
        const response = await fetch('/.netlify/functions/contact-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification(`Message sent successfully! Ticket ID: ${result.ticketId}. Expected response: ${result.estimatedResponse}`, 'success');
            document.getElementById('contactForm').reset();
        } else {
            throw new Error(result.message || 'Failed to send message');
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        showNotification('Failed to send message. Please try again.', 'error');
        
        // Fallback to localStorage
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contactData.id = Date.now().toString();
        contacts.push(contactData);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        showNotification('Message saved locally. We\'ll process it when connection is restored.', 'info');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 1001;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .program-modal h2 {
        color: #1976d2;
        margin-bottom: 1rem;
    }
    
    .program-details {
        margin: 1.5rem 0;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .program-details div {
        margin-bottom: 0.5rem;
    }
    
    .program-details ul {
        margin-top: 0.5rem;
        padding-left: 1.5rem;
    }
    
    .dashboard-preview {
        text-align: center;
    }
    
    .dashboard-items {
        display: grid;
        gap: 1rem;
        margin: 1.5rem 0;
    }
    
    .dashboard-item {
        padding: 1rem;
        background: #eef5ff;
        border-radius: 8px;
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.scrollToSection = scrollToSection;
window.showProgramDetails = showProgramDetails;
window.closeModal = closeModal;