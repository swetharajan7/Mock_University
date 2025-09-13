/**
 * StellarRec Integration for MockUniversity
 * Handles communication between StellarRec and MockUniversity application system
 */

(function() {
    'use strict';
    
    const STELLARREC_ORIGIN = 'https://stellarrec.netlify.app';
    const MOCK_UNIVERSITY_API = '/.netlify/functions';
    
    // Integration configuration
    const config = {
        universityId: 'mock-university',
        universityName: 'MockUniversity',
        apiEndpoint: `${MOCK_UNIVERSITY_API}/receive-recommendation`,
        debug: true
    };
    
    class StellarRecIntegration {
        constructor() {
            this.isInitialized = false;
            this.pendingRecommendations = new Map();
            this.log('StellarRec Integration initialized');
        }
        
        initialize() {
            if (this.isInitialized) {
                this.log('Already initialized');
                return;
            }
            
            this.setupMessageListener();
            this.setupAPI();
            this.notifyStellarRec();
            this.isInitialized = true;
            
            this.log('Integration setup complete');
        }
        
        setupMessageListener() {
            window.addEventListener('message', (event) => {
                this.handleMessage(event);
            });
            
            this.log('Message listener setup');
        }
        
        setupAPI() {
            // Setup API endpoint to receive recommendations
            this.log('API endpoints ready');
        }
        
        notifyStellarRec() {
            // Notify StellarRec that MockUniversity is ready to receive recommendations
            const message = {
                type: 'UNIVERSITY_READY',
                university: {
                    id: config.universityId,
                    name: config.universityName,
                    ready: true
                }
            };
            
            // Try to notify parent window (if in iframe) or opener window
            if (window.parent && window.parent !== window) {
                window.parent.postMessage(message, STELLARREC_ORIGIN);
            }
            
            if (window.opener) {
                window.opener.postMessage(message, STELLARREC_ORIGIN);
            }
            
            this.log('Notified StellarRec of readiness');
        }
        
        handleMessage(event) {
            // Only accept messages from StellarRec
            if (event.origin !== STELLARREC_ORIGIN) {
                return;
            }
            
            this.log('Received message from StellarRec:', event.data);
            
            switch (event.data.type) {
                case 'RECOMMENDATION_REQUEST':
                    this.handleRecommendationRequest(event.data);
                    break;
                    
                case 'RECOMMENDATION_SENT':
                    this.handleRecommendationSent(event.data);
                    break;
                    
                case 'RECOMMENDATION_STATUS_UPDATE':
                    this.handleStatusUpdate(event.data);
                    break;
                    
                case 'PING':
                    this.handlePing(event);
                    break;
                    
                default:
                    this.log('Unknown message type:', event.data.type);
            }
        }
        
        handleRecommendationSent(data) {
            const recommendation = this.processRecommendation(data.recommendation);
            
            // Store recommendation
            this.storeRecommendation(recommendation);
            
            // Update UI
            if (window.MockUniversityApp) {
                window.MockUniversityApp.addRecommendation(recommendation);
            }
            
            // Send confirmation back to StellarRec
            this.sendConfirmation(data.messageId, recommendation);
            
            this.log('Processed recommendation:', recommendation);
        }
        
        handleRecommendationRequest(data) {
            // Handle when StellarRec sends a recommendation REQUEST (not the actual recommendation)
            const request = this.processRecommendationRequest(data.request);
            
            // Store the request with "Pending" status
            this.storeRecommendation(request);
            
            // Update UI to show pending recommendation
            if (window.MockUniversityApp) {
                window.MockUniversityApp.addRecommendation(request);
            }
            
            // Send confirmation back to StellarRec
            this.sendConfirmation(data.messageId, request);
            
            this.log('Processed recommendation request:', request);
        }
        
        handleStatusUpdate(data) {
            const { recommendationId, status, details } = data;
            
            // Update stored recommendation
            this.updateRecommendationStatus(recommendationId, status, details);
            
            // Update UI
            this.refreshRecommendationsDisplay();
            
            this.log('Updated recommendation status:', { recommendationId, status });
        }
        
        handlePing(event) {
            // Respond to ping from StellarRec
            const response = {
                type: 'PONG',
                university: config.universityName,
                timestamp: new Date().toISOString()
            };
            
            event.source.postMessage(response, event.origin);
            this.log('Responded to ping');
        }
        
        processRecommendation(rawRecommendation) {
            // Process and normalize recommendation data
            return {
                id: rawRecommendation.id || this.generateId(),
                recommenderName: rawRecommendation.recommenderName || rawRecommendation.name,
                recommenderEmail: rawRecommendation.recommenderEmail || rawRecommendation.email,
                recommenderTitle: rawRecommendation.recommenderTitle || rawRecommendation.title,
                studentName: rawRecommendation.studentName,
                studentEmail: rawRecommendation.studentEmail,
                program: rawRecommendation.program,
                status: rawRecommendation.status || 'Received',
                content: rawRecommendation.content || rawRecommendation.letter,
                submittedAt: rawRecommendation.submittedAt || new Date().toISOString(),
                receivedAt: new Date().toISOString(),
                source: 'StellarRec',
                fileUrl: rawRecommendation.fileUrl || null,
                fileType: rawRecommendation.fileType || null,
                metadata: {
                    stellarrecId: rawRecommendation.stellarrecId,
                    originalData: rawRecommendation
                }
            };
        }
        
        processRecommendationRequest(rawRequest) {
            // Process recommendation REQUEST (when StellarRec sends initial request)
            return {
                id: rawRequest.id || this.generateId(),
                recommenderName: rawRequest.recommenderName || rawRequest.name,
                recommenderEmail: rawRequest.recommenderEmail || rawRequest.email,
                recommenderTitle: rawRequest.recommenderTitle || rawRequest.title,
                studentName: rawRequest.studentName,
                studentEmail: rawRequest.studentEmail,
                program: rawRequest.program,
                status: 'Pending', // Always pending for requests
                content: null, // No content yet
                requestedAt: new Date().toISOString(),
                receivedAt: null, // Will be set when actual recommendation comes
                source: 'StellarRec',
                fileUrl: null,
                fileType: null,
                metadata: {
                    stellarrecId: rawRequest.stellarrecId,
                    requestId: rawRequest.requestId,
                    originalData: rawRequest
                }
            };
        }
        
        storeRecommendation(recommendation) {
            // Store in localStorage
            const stored = JSON.parse(localStorage.getItem('mockUniversityRecommendations') || '[]');
            
            // Check if already exists
            const existingIndex = stored.findIndex(r => r.id === recommendation.id);
            
            if (existingIndex >= 0) {
                stored[existingIndex] = recommendation;
            } else {
                stored.push(recommendation);
            }
            
            localStorage.setItem('mockUniversityRecommendations', JSON.stringify(stored));
            
            // Also send to backend API
            this.sendToBackend(recommendation);
        }
        
        async sendToBackend(recommendation) {
            try {
                const response = await fetch(config.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'recommendation',
                        data: recommendation
                    })
                });
                
                if (response.ok) {
                    this.log('Recommendation sent to backend successfully');
                } else {
                    this.log('Failed to send to backend:', response.status);
                }
            } catch (error) {
                this.log('Backend API error:', error);
                // Continue with localStorage only
            }
        }
        
        updateRecommendationStatus(id, status, details) {
            const stored = JSON.parse(localStorage.getItem('mockUniversityRecommendations') || '[]');
            const index = stored.findIndex(r => r.id === id);
            
            if (index >= 0) {
                stored[index].status = status;
                stored[index].updatedAt = new Date().toISOString();
                if (details) {
                    stored[index].statusDetails = details;
                }
                
                localStorage.setItem('mockUniversityRecommendations', JSON.stringify(stored));
            }
        }
        
        refreshRecommendationsDisplay() {
            const stored = JSON.parse(localStorage.getItem('mockUniversityRecommendations') || '[]');
            
            if (window.MockUniversityApp) {
                window.MockUniversityApp.updateRecommendationsTable(stored);
            }
        }
        
        sendConfirmation(messageId, recommendation) {
            const confirmation = {
                type: 'RECOMMENDATION_RECEIVED',
                messageId: messageId,
                recommendationId: recommendation.id,
                university: config.universityName,
                status: 'success',
                timestamp: new Date().toISOString()
            };
            
            // Send to all possible StellarRec windows
            if (window.parent && window.parent !== window) {
                window.parent.postMessage(confirmation, STELLARREC_ORIGIN);
            }
            
            if (window.opener) {
                window.opener.postMessage(confirmation, STELLARREC_ORIGIN);
            }
            
            this.log('Sent confirmation to StellarRec');
        }
        
        generateId() {
            return 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        
        log(...args) {
            if (config.debug) {
                console.log('[StellarRec Integration]', ...args);
            }
        }
        
        // Public API methods
        getRecommendations() {
            return JSON.parse(localStorage.getItem('mockUniversityRecommendations') || '[]');
        }
        
        getRecommendation(id) {
            const recommendations = this.getRecommendations();
            return recommendations.find(r => r.id === id);
        }
        
        clearRecommendations() {
            localStorage.removeItem('mockUniversityRecommendations');
            this.refreshRecommendationsDisplay();
        }
        
        // Test method for development
        simulateRecommendation() {
            const testRecommendation = {
                id: 'test_' + Date.now(),
                recommenderName: 'Prof. Manas Mohan Nand',
                recommenderEmail: 'manasnandmohan@gmail.com',
                recommenderTitle: 'Professor of Historical Studies',
                studentName: 'Student Applicant',
                studentEmail: 'swetha.rajan103@gmail.com',
                program: 'MA Historical Studies',
                status: 'Completed',
                content: `Dear Admissions Committee at Mock University,

I am pleased to recommend Student Applicant for admission to your program. I have known Student Applicant as a dedicated and motivated individual who consistently demonstrates intellectual curiosity and strong analytical skills.

Student Applicant demonstrates exceptional ability in:
- Critical analysis of historical sources
- Research methodology and archival work  
- Written communication and argumentation
- Collaborative learning and peer engagement

Their thesis project on "Colonial Administrative Practices in 18th Century India" showcased remarkable depth of understanding and original insights that contributed meaningfully to our field of study.

I recommend Student Applicant without reservation for admission to your program. They possess the intellectual rigor, research skills, and personal qualities necessary for success in graduate studies.

Please feel free to contact me if you require any additional information.

Sincerely,
Prof. Manas Mohan Nand
Department of Historical Studies
Columbia University`,
                letter_content: `Dear Admissions Committee at Mock University,

I am pleased to recommend Student Applicant for admission to your program. I have known Student Applicant as a dedicated and motivated individual who consistently demonstrates intellectual curiosity and strong analytical skills.

Student Applicant demonstrates exceptional ability in:
- Critical analysis of historical sources
- Research methodology and archival work  
- Written communication and argumentation
- Collaborative learning and peer engagement

Their thesis project on "Colonial Administrative Practices in 18th Century India" showcased remarkable depth of understanding and original insights that contributed meaningfully to our field of study.

I recommend Student Applicant without reservation for admission to your program. They possess the intellectual rigor, research skills, and personal qualities necessary for success in graduate studies.

Please feel free to contact me if you require any additional information.

Sincerely,
Prof. Manas Mohan Nand
Department of Historical Studies
Columbia University`,
                submittedAt: new Date().toISOString(),
                source: 'StellarRec (Test)'
            };
            
            this.handleRecommendationSent({
                type: 'RECOMMENDATION_SENT',
                recommendation: testRecommendation,
                messageId: 'test_message_' + Date.now()
            });
        }
    }
    
    // Create global instance
    window.StellarRecIntegration = new StellarRecIntegration();
    
    // Auto-initialize if on apply page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.location.pathname.includes('apply')) {
                window.StellarRecIntegration.initialize();
            }
        });
    } else {
        if (window.location.pathname.includes('apply')) {
            window.StellarRecIntegration.initialize();
        }
    }
    
    // Expose for debugging
    if (config.debug) {
        window.testStellarRec = () => {
            window.StellarRecIntegration.simulateRecommendation();
        };
    }
    
})();