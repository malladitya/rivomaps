// Harbor Chatbot Widget - Injected JavaScript
(function() {
    const css = `
        #harbor-chatbot-widget {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 380px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
            z-index: 99999;
            font-family: 'Poppins', sans-serif;
            overflow: hidden;
        }

        #harbor-chatbot-widget.open {
            display: flex;
        }

        .harbor-chatbot-header {
            background: linear-gradient(135deg, #0EA5A2 0%, #06B6D4 100%);
            color: white;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .harbor-chatbot-header h2 {
            font-size: 16px;
            flex: 1;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .harbor-header-content {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }

        .harbor-logo {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            object-fit: cover;
        }

        .harbor-button-logo {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
        }

        .harbor-chatbot-close {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }

        .harbor-chatbot-close:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .harbor-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #f8f9fa;
        }

        .harbor-message {
            display: flex;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .harbor-message.user {
            justify-content: flex-end;
        }

        .harbor-message.assistant {
            justify-content: flex-start;
        }

        .harbor-bubble {
            max-width: 70%;
            padding: 10px 14px;
            border-radius: 10px;
            word-wrap: break-word;
            line-height: 1.4;
            font-size: 13px;
        }

        .harbor-message.user .harbor-bubble {
            background: linear-gradient(135deg, #0EA5A2 0%, #06B6D4 100%);
            color: white;
            border-bottom-right-radius: 3px;
        }

        .harbor-message.assistant .harbor-bubble {
            background: white;
            color: #333;
            border: 1px solid #e0e0e0;
            border-bottom-left-radius: 3px;
        }

        .harbor-input-section {
            padding: 12px;
            background: white;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 8px;
        }

        .harbor-input-section input {
            flex: 1;
            border: 1px solid #e0e0e0;
            border-radius: 20px;
            padding: 10px 14px;
            font-family: 'Poppins', sans-serif;
            font-size: 13px;
            outline: none;
            transition: border-color 0.3s;
        }

        .harbor-input-section input:focus {
            border-color: #0EA5A2;
        }

        .harbor-send-btn {
            background: linear-gradient(135deg, #0EA5A2 0%, #06B6D4 100%);
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 16px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
        }

        .harbor-send-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(14, 165, 162, 0.3);
        }

        .harbor-toggle-btn {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #0EA5A2 0%, #06B6D4 100%);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            color: white;
            font-size: 28px;
            box-shadow: 0 4px 12px rgba(14, 165, 162, 0.3);
            transition: all 0.3s;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Poppins', sans-serif;            opacity: 1;
            visibility: visible;            opacity: 1;
            visibility: visible;
        }

        .harbor-toggle-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(14, 165, 162, 0.4);
        }

        .harbor-toggle-btn.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.3s, visibility 0.3s;
        }

        #harbor-chatbot-widget ::-webkit-scrollbar {
            width: 5px;
        }

        #harbor-chatbot-widget ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        #harbor-chatbot-widget ::-webkit-scrollbar-thumb {
            background: #0EA5A2;
            border-radius: 3px;
        }

        #harbor-chatbot-widget ::-webkit-scrollbar-thumb:hover {
            background: #0d9195;
        }

        @media (max-width: 480px) {
            #harbor-chatbot-widget {
                width: 100%;
                height: 100%;
                right: 0;
                bottom: 0;
                border-radius: 0;
                max-width: 100%;
            }

            .harbor-toggle-btn {
                width: 50px;
                height: 50px;
                font-size: 24px;
            }
        }
    `;

    const html = `
        <div id="harbor-chatbot-widget">
            <div class="harbor-chatbot-header">
                <div class="harbor-header-content">
                    <img id="harbor-logo" src="bot.png" alt="Harbor Logo" class="harbor-logo">
                    <h2>Harbor</h2>
                </div>
                <button class="harbor-chatbot-close" onclick="window.toggleHarborChatbot()">✕</button>
            </div>
            <div class="harbor-messages" id="harbor-messages">
                <div class="harbor-message assistant">
                    <div class="harbor-bubble">👋 I am  Harbor! I can help with navigation, routes, and directions. Type a message or ask for help!</div>
                </div>
            </div>
            <div class="harbor-input-section">
                <input 
                    type="text" 
                    id="harbor-input" 
                    placeholder="Message Harbor..." 
                    onkeypress="window.handleHarborKeyPress(event)"
                >
                <button class="harbor-send-btn" onclick="window.sendHarborMessage()">➤</button>
            </div>
        </div>

        <button class="harbor-toggle-btn" id="harbor-toggle-btn" onclick="window.toggleHarborChatbot()">
            <img src="bot.png" alt="Harbor" class="harbor-button-logo">
        </button>
    `;

    // Inject CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = css;
    document.head.appendChild(styleElement);

    // Inject HTML
    const widgetContainer = document.createElement('div');
    widgetContainer.innerHTML = html;
    document.body.appendChild(widgetContainer);

    // Comprehensive knowledge base for Harbor
    const harborKnowledge = {
        // Knowledge topics
        topics: {
            'rivo': {
                keywords: ['rivo', 'app', 'application', 'platform', 'tool', 'service'],
                info: 'Rivo is a sensory-friendly navigation app for people with autism and sensory sensitivities. It helps find quiet, comfortable routes and avoid noisy areas. 🏃'
            },
            'navigation': {
                keywords: ['navigate', 'navigation', 'directions', 'route', 'path', 'way', 'go', 'travel', 'journey'],
                info: 'Use Rivo for turn-by-turn navigation. Click your location, then destination on the map. Rivo finds the best sensory-friendly route. Follow the real-time directions! 🧭'
            },
            'sensory': {
                keywords: ['sensory', 'autis', 'autism', 'sensitivity', 'sensit', 'neurodiverse', 'adhd', 'anxiety', 'calm', 'quiet', 'peace'],
                info: 'Rivo is designed for neurodivergent people. It avoids noisy, crowded areas and finds peaceful routes. Perfect for anyone with sensory sensitivities! 🧘'
            },
            'comfort': {
                keywords: ['comfort', 'rating', 'level', 'score', 'peaceful', 'pleasant', 'nice', 'good'],
                info: 'Comfort rating (0-100%): HIGH (70+) = quiet & peaceful, MEDIUM (40-70) = some noise, LOW (0-40) = busy & crowded. Rivo calculates this based on reports & conditions! 😊'
            },
            'avoid': {
                keywords: ['avoid', 'skip', 'noise', 'noisy', 'crowd', 'crowded', 'problem', 'issue', 'report', 'construction'],
                info: 'Report problem areas: 1) NOISE 🔊 - loud areas, 2) CROWDS 👥 - busy spots, 3) CONSTRUCTION 🏗️ - ongoing work. Your reports help all Rivo users! 🚫'
            },
            'community': {
                keywords: ['community', 'report', 'share', 'help', 'others', 'user', 'contribute', 'feedback'],
                info: 'Help the Rivo community! Share your experience: location, issue type, and description. Your reports make routes better for everyone! 👥'
            },
            'features': {
                keywords: ['feature', 'feature', 'can', 'ability', 'capability', 'do', 'support', 'offer', 'provide'],
                info: '✨ Rivo Features:\n• Smart sensory-friendly route planning 🗺️\n• Real-time comfort ratings 📊\n• Turn-by-turn navigation 📍\n• Community reports 👥\n• Avoid noisy areas 🔇\n• Find peaceful routes 🌳'
            },
            'help': {
                keywords: ['help', 'support', 'guide', 'tutorial', 'how', 'way', 'start', 'begin', 'use', 'work'],
                info: '📖 Getting Started:\n1. Click on the map for your location\n2. Select your destination\n3. Rivo finds sensory-friendly route\n4. Follow turn-by-turn directions\n5. Report issues to help others'
            },
            'price': {
                keywords: ['price', 'cost', 'free', 'paid', 'money', 'fee', 'subscription', 'payment'],
                info: '💰 Rivo is completely FREE! No subscription fees, no hidden costs, community-powered. Download and use forever! 🎉'
            },
            'location': {
                keywords: ['location', 'address', 'place', 'destination', 'start', 'end', 'where', 'position', 'point'],
                info: '📍 Setting Your Route:\n1. Look at the map\n2. Tap your current location\n3. Tap your destination\n4. Rivo calculates best route\n5. Start navigating! No typing needed!'
            },
            'direction': {
                keywords: ['direction', 'turn', 'left', 'right', 'straight', 'follow', 'next', 'step', 'instruction'],
                info: '🧭 Turn-by-Turn Guidance:\n• See next turn in advance ➡️\n• Distance to next turn displayed\n• Clear direction arrows 🔄\n• Real-time guidance\n• Adjust route anytime'
            }
        },

        // Intelligent response generator
        getResponse: function(message) {
            const msg = message.toLowerCase().trim();
            
            // Check which topics match the question
            const matchedTopics = [];
            for (const [topic, data] of Object.entries(this.topics)) {
                for (const keyword of data.keywords) {
                    if (msg.includes(keyword)) {
                        matchedTopics.push(data.info);
                        break;
                    }
                }
            }
            
            // If we found matching topics, return them
            if (matchedTopics.length > 0) {
                if (matchedTopics.length === 1) {
                    return matchedTopics[0];
                } else {
                    // Multiple topics matched, provide comprehensive answer
                    return matchedTopics.slice(0, 3).join('\n\n---\n\n');
                }
            }
            
            // Smart fallback for any other question
            return this.generateSmartAnswer(msg);
        },

        // Generate answer for any question
        generateSmartAnswer: function(msg) {
            // Question starters
            if (msg.startsWith('what')) {
                return '📚 Rivo is a sensory-friendly navigation app that helps people with autism and sensory sensitivities find quiet, comfortable routes. It avoids noisy and crowded areas! What else would you like to know? 🤔';
            }
            if (msg.startsWith('how')) {
                return '📖 To use Rivo: 1) Click your location on the map 2) Select destination 3) Follow the sensory-friendly route 4) Report problem areas to help others. Need help with something specific? 😊';
            }
            if (msg.startsWith('why')) {
                return '🎯 Rivo was created because many people with sensory sensitivities struggle with noisy routes. We help you find peaceful paths! 🧘';
            }
            if (msg.startsWith('can') || msg.startsWith('does') || msg.startsWith('will')) {
                return '✨ Yes! Rivo can help with navigation, find quiet routes, show comfort ratings, let you report issues, and help the community find better paths! 🚀';
            }
            if (msg.startsWith('where')) {
                return '📍 Rivo works everywhere! Just open the app, click on any location on the map, and get sensory-friendly directions! Available online at http://localhost:3000';
            }
            if (msg.startsWith('is')) {
                return '✅ Yes! Rivo is free, safe, community-powered, designed for autistic people, and helps find quiet routes. What specific question do you have? 😊';
            }
            if (msg.startsWith('tell')) {
                return '🎤 Rivo is an amazing sensory-friendly navigation app! It helps neurodivergent people (especially autistic folks) find peaceful routes away from noise and crowds. Want to know more? 👂';
            }
            
            // General catch-all
            return '💬 Great question about Rivo! I can tell you about:\n🗺️ Navigation & routes\n🧘 Sensory-friendly planning\n👥 Community features\n📊 Comfort ratings\n🚫 Avoiding noisy areas\n💰 Pricing (it\'s free!)\n\nWhat would you like to know more about? 😊';
        }
    };

    // Initialize AI Engine with optional Gemini
    let aiEngine = null;
    let geminiLoaded = false;
    
    // Try to initialize Gemini
    window.initializeGeminiAI = async function(apiKey) {
        try {
            console.log('🔄 Attempting to initialize Gemini AI...');
            
            // Check if GoogleGenerativeAI is available
            if (typeof window.GoogleGenerativeAI === 'undefined') {
                console.log('📦 Loading Gemini SDK from CDN...');
                
                // Dynamically import from CDN
                const module = await import('https://esm.run/@google/generative-ai');
                window.GoogleGenerativeAI = module.GoogleGenerativeAI;
                console.log('✅ Gemini SDK loaded');
            }
            
            // Initialize AI engine with Gemini
            if (typeof AIUnderstandingEngine !== 'undefined') {
                aiEngine = new AIUnderstandingEngine(apiKey);
                geminiLoaded = true;
                console.log('✅ Gemini AI initialized successfully with key:', apiKey.substring(0, 10) + '...');
                
                // Add notification
                const messagesDiv = document.getElementById('harbor-messages');
                if (messagesDiv) {
                    const notif = document.createElement('div');
                    notif.className = 'harbor-message assistant';
                    notif.innerHTML = `<div class="harbor-bubble">🚀 Gemini AI activated! I can now understand complex queries and control the map.</div>`;
                    messagesDiv.appendChild(notif);
                }
                
                return true;
            } else {
                console.error('❌ AIUnderstandingEngine not found');
                initializeFallbackAI();
                return false;
            }
        } catch (error) {
            console.error('❌ Gemini initialization failed:', error);
            initializeFallbackAI();
            return false;
        }
    };
    
    function initializeFallbackAI() {
        if (typeof AIUnderstandingEngine !== 'undefined') {
            aiEngine = new AIUnderstandingEngine();
            console.log('✅ Fallback AI initialized (pattern matching)');
        } else {
            console.warn('⚠️ No AI engine available');
        }
    }
    
    // Initialize on load with retry mechanism
    window.addEventListener('load', async function() {
        console.log('🚀 Page loaded, initializing AI...');
        
        // Wait for AI engine to be available (with timeout)
        let retries = 0;
        const maxRetries = 10;
        
        while (typeof AIUnderstandingEngine === 'undefined' && retries < maxRetries) {
            console.log(`⏳ Waiting for AIUnderstandingEngine... (attempt ${retries + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 200));
            retries++;
        }
        
        if (typeof AIUnderstandingEngine === 'undefined') {
            console.error('❌ AIUnderstandingEngine not found after waiting');
            console.log('⚠️ Using basic fallback (knowledge base only)');
            return;
        }
        
        console.log('✅ AIUnderstandingEngine found!');
        
        // Try Gemini first (user should set their API key here)
        const geminiApiKey = "AIzaSyAW7APyJgT4xNDCD9vFwY1jjnfi74ozNtE";
        
        if (geminiApiKey && geminiApiKey !== "YOUR_API_KEY_HERE") {
            const success = await window.initializeGeminiAI(geminiApiKey);
            if (!success) {
                console.log('⚠️ Gemini failed, using fallback');
            }
        } else {
            console.log('⚠️ No API key found, using fallback AI');
            initializeFallbackAI();
        }
    });

    // Global functions
    window.toggleHarborChatbot = function() {
        const widget = document.getElementById('harbor-chatbot-widget');
        const toggleBtn = document.getElementById('harbor-toggle-btn');
        
        if (!widget) return;

        widget.classList.toggle('open');
        
        if (widget.classList.contains('open')) {
            toggleBtn.classList.add('hidden');
            const input = document.getElementById('harbor-input');
            if (input) input.focus();
        } else {
            toggleBtn.classList.remove('hidden');
        }
    };

    window.sendHarborMessage = async function() {
        const input = document.getElementById('harbor-input');
        const message = input.value.trim();
        
        if (!message) return;

        const messagesDiv = document.getElementById('harbor-messages');
        if (!messagesDiv) return;

        // Add user message
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'harbor-message user';
        userMsgDiv.innerHTML = `<div class="harbor-bubble">${window.escapeHtml(message)}</div>`;
        messagesDiv.appendChild(userMsgDiv);

        // Clear input and scroll immediately
        input.value = '';
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'harbor-message assistant';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `<div class="harbor-bubble">💭 Thinking...</div>`;
        messagesDiv.appendChild(typingDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        let responseText = '';
        let aiResponse = null;

        console.log('🔍 AI Engine status:', {
            aiEngineExists: !!aiEngine,
            geminiLoaded: geminiLoaded,
            aiEngineUseGemini: aiEngine?.useGemini
        });

        // Try AI Engine first (includes Gemini if loaded)
        if (aiEngine) {
            try {
                console.log('🤖 Processing with AI Engine...');
                aiResponse = await aiEngine.processUserMessage(message);
                responseText = aiResponse.message;
                
                // Log AI details
                console.log('🤖 AI Response:', {
                    userMessage: message,
                    intent: aiResponse.intent,
                    confidence: aiResponse.confidence,
                    source: aiResponse.source || 'pattern-matching',
                    action: aiResponse.action,
                    data: aiResponse.data
                });
                
                // Handle actions and provide visual feedback
                if (aiResponse.action) {
                    switch(aiResponse.action) {
                        case 'CALCULATE_ROUTE':
                            responseText += '\n\n🗺️ Displaying route on map...';
                            if (window.handleAIAction) {
                                window.handleAIAction(aiResponse);
                            }
                            // Scroll to map
                            setTimeout(() => {
                                const mapContainer = document.getElementById('myMap') || document.querySelector('.map-container');
                                if (mapContainer) {
                                    mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                            }, 500);
                            break;
                            
                        case 'SET_ORIGIN':
                            responseText += '\n\n📍 Origin marked on map!';
                            if (window.handleAIAction) {
                                window.handleAIAction(aiResponse);
                            }
                            break;
                            
                        case 'SET_DESTINATION':
                            responseText += '\n\n🎯 Destination set! Set origin to calculate route.';
                            if (window.handleAIAction) {
                                window.handleAIAction(aiResponse);
                            }
                            break;
                            
                        case 'START_NAVIGATION':
                            responseText += '\n\n🚀 Starting turn-by-turn navigation!';
                            if (window.handleAIAction) {
                                window.handleAIAction(aiResponse);
                            }
                            break;
                            
                        default:
                            if (window.handleAIAction) {
                                window.handleAIAction(aiResponse);
                            }
                    }
                }
            } catch (error) {
                console.error('AI processing error:', error);
                responseText = harborKnowledge.getResponse(message);
            }
        } else {
            // Fallback to knowledge base
            responseText = harborKnowledge.getResponse(message);
        }

        // Remove typing indicator
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();

        // Add assistant message
        const assistantMsgDiv = document.createElement('div');
        assistantMsgDiv.className = 'harbor-message assistant';
        assistantMsgDiv.innerHTML = `<div class="harbor-bubble">${window.escapeHtml(responseText)}</div>`;
        messagesDiv.appendChild(assistantMsgDiv);

        input.focus();
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    };

    window.handleHarborKeyPress = function(event) {
        if (event.key === 'Enter') {
            window.sendHarborMessage();
        }
    };

    window.escapeHtml = function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Show toggle button when page loads
    window.addEventListener('load', function() {
        const toggleBtn = document.getElementById('harbor-toggle-btn');
        if (toggleBtn) {
            toggleBtn.style.display = 'flex';
        }
    });
})();
