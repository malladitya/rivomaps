// Harbor Chatbot Widget - Injected JavaScript
(function() {
    const css = `
        #harbor-chatbot-widget {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 380px;
            height: 500px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(40px) saturate(180%);
            -webkit-backdrop-filter: blur(40px) saturate(180%);
            border-radius: 20px;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2), 
                        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
            display: none;
            flex-direction: column;
            z-index: 99999;
            font-family: 'Poppins', sans-serif;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.3);
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
            background: rgba(248, 249, 250, 0.3);
            backdrop-filter: blur(10px);
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
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(20px);
            color: #1e293b;
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-bottom-left-radius: 3px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .harbor-input-section {
            padding: 12px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            display: flex;
            gap: 8px;
        }

        .harbor-input-section input {
            flex: 1;
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 20px;
            padding: 10px 14px;
            font-family: 'Poppins', sans-serif;
            font-size: 13px;
            outline: none;
            transition: all 0.3s;
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
            color: #1e293b;
        }

        .harbor-input-section input::placeholder {
            color: rgba(30, 41, 59, 0.6);
        }

        .harbor-input-section input:focus {
            border-color: #0EA5A2;
            background: rgba(255, 255, 255, 0.7);
            box-shadow: 0 4px 16px rgba(14, 165, 162, 0.2);
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

    // Sample list of calm places (can be replaced with dynamic data)
    // Calm places near SAS Nagar (Mohali)
    const calmPlaces = [
        { name: 'Sukhna Lake', coords: [76.8100, 30.7415] },
        { name: 'Punjab Cricket Association Stadium Park', coords: [76.7221, 30.6976] },
        { name: 'Silvi Park', coords: [76.7087, 30.7046] },
        { name: 'Rose Garden', coords: [76.7722, 30.7520] },
        { name: 'Japanese Garden', coords: [76.7794, 30.7132] },
        { name: 'Leisure Valley', coords: [76.7737, 30.7410] },
        { name: 'Thunder Zone Amusement & Water Park', coords: [76.6902, 30.6667] }
    ];

    // Calculate distance between two [lon, lat] points in meters
    function calcDistance(a, b) {
        const R = 6371000;
        const lat1 = a[1] * Math.PI / 180;
        const lat2 = b[1] * Math.PI / 180;
        const dLat = (b[1] - a[1]) * Math.PI / 180;
        const dLon = (b[0] - a[0]) * Math.PI / 180;
        const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
        return R * c;
    }

    // Find nearest calm place to userCoords ([lon, lat])
    function getNearestCalmPlace(userCoords) {
        if (!userCoords) return null;
        let minDist = Infinity, nearest = null;
        for (const place of calmPlaces) {
            const dist = calcDistance(userCoords, place.coords);
            if (dist < minDist) {
                minDist = dist;
                nearest = { ...place, distance: Math.round(dist) };
            }
        }
        return nearest;
    }

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
                keywords: ['avoid', 'skip', 'construction'],
                info: 'Report problem areas: 1) NOISE 🔊 - loud areas, 2) CROWDS 👥 - busy spots, 3) CONSTRUCTION 🏗️ - ongoing work. Your reports help all Rivo users! 🚫'
            },
            'report': {
                keywords: ['report', 'how to report', 'report noise', 'report zone', 'report a zone', 'reporting'],
                info: '📋 How to Report Issues:\n\n1️⃣ Scroll to "Report a Zone" section\n2️⃣ Enter location or use current position\n3️⃣ Select issue type: 🔊 Noise / 👥 Crowd / 🏗️ Construction\n4️⃣ Click "Report Zone"\n5️⃣ Your report helps the community!\n\n💡 Reports stay active for 5 minutes and help other users find better routes.'
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

            // PRIORITY 1: Any message containing "report" + "noise/zone/crowd/construction"
            if ((msg.includes('report') && (msg.includes('noise') || msg.includes('zone') || msg.includes('crowd') || msg.includes('construction'))) ||
                (msg.includes('how') && msg.includes('report')) ||
                (msg.includes('noise zone') || msg.includes('noise zones'))) {
                this._lastTopic = 'report';
                return `📍 How to Report a Zone - Step by Step:

🎯 Quick Steps:
1️⃣ Scroll down to the "Report a Zone" section on this page
2️⃣ Enter location - Type a place name OR click 📍 for your current location
3️⃣ Select type from the dropdown:
   • 🔊 Noise Zone - construction, traffic, loud events
   • 👥 Crowd Zone - busy areas, gatherings
   • 🚧 Construction - roadwork, building sites
4️⃣ Click "Report Zone" button to submit

💡 Good to know:
• Your report stays active for 5 minutes
• Other users will be routed away from reported areas
• You're helping make navigation better for everyone!

Say take me to report section and I'll scroll you there! 🎯`;
            }

            // Handle "guide" follow-ups when last question was about reporting
            if ((msg.includes('guide') || msg.includes('plse') || msg.includes('please')) && 
                (this._lastTopic === 'report' || msg.includes('report'))) {
                this._lastTopic = 'report';
                return `📍 **How to Report a Zone** - Complete Guide:

🎯 **Step 1**: Scroll down to "Report a Zone" section
📍 **Step 2**: Enter location name OR click the location button
📝 **Step 3**: Select zone type:
   • 🔊 Noise Zone - construction, traffic, events
   • 👥 Crowd Zone - busy areas, gatherings
   • 🚧 Construction - roadwork, building sites
✅ **Step 4**: Click "Report Zone" button

💡 **Tips:**
• Your reports stay active for 5 minutes
• Other users will be routed away from these areas
• You're helping make navigation better for everyone!

Say "take me to report section" to go there directly! 🎯`;
            }

            // Track topic for follow-ups
            if (msg.includes('report') || msg.includes('noise') || msg.includes('zone')) {
                this._lastTopic = 'report';
            }

            // Custom answers for specific user questions (with dynamic distance/time if available)
            // 1. Sensory-friendly places nearby (flexible matching, now uses real nearest calm place)
            if ((msg.includes('sensory') || msg.includes('calm') || msg.includes('quiet')) && (msg.includes('place') || msg.includes('spot') || msg.includes('area')) && (msg.includes('nearby') || msg.includes('close') || msg.includes('around') || msg.includes('near'))) {
                // Try to get user location from global state (aiAssistant, navigationState)
                let userCoords = null;
                if (window.aiAssistant && window.aiAssistant.currentUserLocation) {
                    userCoords = window.aiAssistant.currentUserLocation;
                } else if (window.navigationState && window.navigationState.currentLocation) {
                    userCoords = window.navigationState.currentLocation;
                }
                // If not available, try browser geolocation (async)
                if (!userCoords && navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(pos) {
                        const coords = [pos.coords.longitude, pos.coords.latitude];
                        window.aiAssistant = window.aiAssistant || {};
                        window.aiAssistant.currentUserLocation = coords;
                        // Re-trigger chatbot with same message to get real answer
                        setTimeout(() => {
                            if (window.sendHarborMessage) {
                                const input = document.getElementById('harbor-input');
                                if (input) {
                                    input.value = message;
                                    window.sendHarborMessage();
                                }
                            }
                        }, 300);
                    });
                    return '⏳ Locating you... Please allow location access to find the nearest calm space.';
                }
                const nearest = getNearestCalmPlace(userCoords);
                if (nearest) {
                    return (
                        '🧘 You are close to a calm and safe space.\n' +
                        `The nearest sensory-friendly place is ${nearest.name} (${nearest.distance} meters away).\n` +
                        'This place is known for low noise, softer lighting, and fewer people, making it a good spot to take a break.'
                    );
                } else {
                    return (
                        '🧘 You are close to a calm and safe space.\n' +
                        'The nearest sensory-friendly place is not available (location unknown).\n' +
                        'Please enable location access and try again.'
                    );
                }
            }
            // 2. Simple step-by-step directions
            if (msg.includes('guide me') && (msg.includes('simple') || msg.includes('step-by-step'))) {
                let meters = (window.navigationState && window.navigationState.totalDistanceRemaining) ? Math.round(window.navigationState.totalDistanceRemaining) : 'X';
                let minutes = (window.navigationState && window.navigationState.totalDistanceRemaining) ? Math.round(window.navigationState.totalDistanceRemaining / 70) : 'X'; // assume 70m/min walking
                let dest = window.nearestCalmSpaceName || 'the nearest calm space';
                return (
                    '🗺️ Here is a slow and easy path to follow:\n' +
                    'Take a deep breath.\n' +
                    `Walk straight ahead for [${meters} meters / ${minutes} minutes].\n` +
                    'Turn left/right at the next clear landmark (like a sign, tree, or building).\n' +
                    `Continue walking slowly until you reach [${dest}].\n` +
                    'You can stop at any time if you need to rest.\n' +
                    'You are doing great. There is no rush.'
                );
            }
            // 3. Distance from a safe or calm space
            if ((msg.includes('how far') || msg.includes('distance')) && (msg.includes('safe') || msg.includes('calm'))) {
                let meters = (window.navigationState && window.navigationState.totalDistanceRemaining) ? Math.round(window.navigationState.totalDistanceRemaining) : 'X';
                let minutes = (window.navigationState && window.navigationState.totalDistanceRemaining) ? Math.round(window.navigationState.totalDistanceRemaining / 70) : 'X';
                return (
                    `📏 You are about [${minutes} minutes or ${meters} meters] away from this calm space.\n` +
                    'That is a short and manageable distance.\n' +
                    'Help is nearby, and you are safe.'
                );
            }
            // 4. Traveling this route more comfortably next time
            if (msg.includes('travel this route more comfortably') || (msg.includes('travel') && msg.includes('comfortably'))) {
                return (
                    '😊 To make this journey easier in the future, you can:\n' +
                    '• Travel during quieter times of the day\n' +
                    '• Use noise-canceling headphones or earplugs\n' +
                    '• Choose routes with less traffic and fewer crowds\n' +
                    '• Save this calm location in Rivo as a favorite safe place\n' +
                    '• Take breaks often — it’s okay to pause\n' +
                    'Rivo is always here to help you move at your own pace'
                );
            }

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
                aiEngine = new AIUnderstandingEngine(window.CONFIG?.geminiApiKey);
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
            aiEngine = new AIUnderstandingEngine(window.CONFIG?.geminiApiKey);
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
        const geminiApiKey = window.CONFIG?.geminiApiKey || "YOUR_GEMINI_API_KEY";
        // Accept any non-empty key, only skip if it's a known placeholder
        if (geminiApiKey && geminiApiKey !== "YOUR_API_KEY_HERE" && geminiApiKey !== "YOUR_GEMINI_API_KEY") {
            const success = await window.initializeGeminiAI(geminiApiKey);
            if (!success) {
                console.log('⚠️ Gemini failed, using fallback');
            } else {
                // Test the API key to verify it's working
                console.log('🧪 Verifying API key functionality...');
                if (aiEngine && typeof aiEngine.testApiKey === 'function') {
                    const isValid = await aiEngine.testApiKey();
                    if (!isValid) {
                        console.warn('⚠️ API key test failed. Check console for details.');
                    }
                }
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

        // Try AI Engine first (includes Gemini if loaded)
        const msg = message.toLowerCase().trim();
        const isSensoryPlaceQuery = ((msg.includes('sensory') || msg.includes('calm') || msg.includes('quiet')) && (msg.includes('place') || msg.includes('spot') || msg.includes('area')) && (msg.includes('nearby') || msg.includes('close') || msg.includes('around') || msg.includes('near')));
        // If both origin and destination are set, trigger directions
        const userLoc = (window.aiAssistant && window.aiAssistant.currentUserLocation);
        const destLoc = (window.aiAssistant && window.aiAssistant.currentDestination);
        
        // PRIORITY CHECK: Report-related questions should be handled directly
        const isReportQuestion = (msg.includes('report') && (msg.includes('noise') || msg.includes('zone') || msg.includes('crowd') || msg.includes('construction'))) ||
                                 (msg.includes('how') && msg.includes('report')) ||
                                 msg.includes('noise zone') || msg.includes('noise zones');
        
        if (isReportQuestion) {
            console.log('🎯 Report question detected - using direct response');
            responseText = harborKnowledge.getResponse(message);
        } else if (userLoc && destLoc && (msg.includes('guide') || msg.includes('directions') || msg.includes('step-by-step'))) {
            // Generate and show step-by-step directions
            if (typeof window.planComfortableRoute === 'function') {
                window.planComfortableRoute(userLoc, destLoc, false);
            }
            responseText = '🗺️ Here are your simple step-by-step directions! (See map for details)';
        } else if (isSensoryPlaceQuery) {
            responseText = harborKnowledge.getResponse(message);
        } else if (typeof aiEngine !== 'undefined' && aiEngine) {
            try {
                console.log('🤖 Processing with AI Engine...');
                aiResponse = await aiEngine.processUserMessage(message);
                
                // Check if Gemini was just disabled due to API key error
                if (aiEngine.geminiDisabled && !window._geminiDisabledWarningShown) {
                    window._geminiDisabledWarningShown = true;
                    const warningDiv = document.createElement('div');
                    warningDiv.className = 'harbor-message assistant';
                    warningDiv.innerHTML = `<div class="harbor-bubble">⚠️ Gemini API key blocked. Using enhanced pattern matching instead!</div>`;
                    messagesDiv.appendChild(warningDiv);
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }
                
                if (aiResponse && aiResponse.message) {
                    responseText = aiResponse.message;
                    if (aiResponse.action) {
                        switch(aiResponse.action) {
                            case 'CALCULATE_ROUTE':
                                responseText += '\n\n🗺️ Displaying route on map...';
                                if (window.handleAIAction) window.handleAIAction(aiResponse);
                                setTimeout(() => {
                                    const mapContainer = document.getElementById('myMap') || document.querySelector('.map-container');
                                    if (mapContainer) {
                                        mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                }, 500);
                                break;
                            case 'SET_ORIGIN':
                                responseText += '\n\n📍 Origin marked on map!';
                                if (window.handleAIAction) window.handleAIAction(aiResponse);
                                break;
                            case 'SET_DESTINATION':
                                responseText += '\n\n🎯 Destination set! Set origin to calculate route.';
                                if (window.handleAIAction) window.handleAIAction(aiResponse);
                                break;
                            case 'START_NAVIGATION':
                                responseText += '\n\n🚀 Starting turn-by-turn navigation!';
                                if (window.handleAIAction) window.handleAIAction(aiResponse);
                                break;
                            default:
                                if (window.handleAIAction) window.handleAIAction(aiResponse);
                        }
                    }
                } else {
                    console.warn('⚠️ AI Engine returned empty response, using knowledge base');
                    responseText = harborKnowledge.getResponse(message);
                }
            } catch (error) {
                console.error('❌ AI processing error:', error);
                responseText = harborKnowledge.getResponse(message);
            }
        } else {
            console.log('⚠️ AI Engine not available, using knowledge base');
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
