/**
 * AI-Powered Natural Language Processing Engine
 * Intelligent understanding of user commands and queries with Google Gemini
 * @version 3.0 - Gemini Enhanced
 */

console.log('📦 Loading AI NLP Engine...');

class AIUnderstandingEngine {
  constructor(geminiApiKey = null) {
    console.log('🔧 Initializing AIUnderstandingEngine with API key:', geminiApiKey ? 'Provided' : 'None');
    this.conversationHistory = [];
    this.userPreferences = {
      origin: null,
      destination: null,
      preferenceType: 'comfort',
      selectedModes: ['WALKING'],
      avoidAreas: []
    };
    
    // IMPORTANT: Replace with your actual Gemini API key from https://aistudio.google.com/app/apikey
    this.geminiApiKey = geminiApiKey || window.CONFIG?.geminiApiKey || 'YOUR_GEMINI_API_KEY';
    
    if (this.geminiApiKey === 'YOUR_GEMINI_API_KEY') {
      console.warn('⚠️ WARNING: Using placeholder API key. Get your key from https://aistudio.google.com/app/apikey');
    }
    this.geminiModel = null;
    this.useGemini = !!this.geminiApiKey;
    this.geminiEndpointBase = 'https://generativelanguage.googleapis.com/v1/models';
    this.geminiModelCandidates = [
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash',
      'gemini-2.0-flash-001',
      'gemini-2.0-flash-lite',
      'gemini-2.0-flash-lite-001',
      'gemini-2.5-pro'
    ];
    
    if (this.useGemini) {
      console.log('✅ Gemini AI activated - Enhanced intelligence enabled (v1 REST)');
    }
    
    // Confidence thresholds
    this.confidenceThreshold = 0.6;
    
    // Define AI intents (what the user wants to do)
    this.intents = {
      SET_LOCATION: { patterns: ['my location', 'im at', 'current location', 'where i am', 'at', 'position'], priority: 10 },
      SET_DESTINATION: { patterns: ['go to', 'navigate to', 'take me to', 'directions to', 'route to', 'heading to'], priority: 9 },
      GET_ROUTE: { patterns: ['route', 'directions', 'how do i get', 'way to', 'path to', 'show route'], priority: 8 },
      GET_COMFORT: { patterns: ['comfort level', 'sensory', 'how comfortable', 'stress level', 'noise', 'crowd'], priority: 7 },
      CHECK_TIME: { patterns: ['how long', 'time', 'duration', 'arrive', 'eta'], priority: 6 },
      REPORT_NOISE: { patterns: ['report noise', 'report a noise', 'how to report', 'report a zone', 'report zone', 'noise report', 'how do i report'], priority: 8 },
      VISION_BENEFITS: { patterns: ['vision', 'benefits', 'why rivo', 'why use rivo', 'what are benefits', 'mission', 'purpose', 'advantage'], priority: 7 },
      HELP: { patterns: ['help', 'what can you do', 'commands', 'guide', 'how to'], priority: 5 },
      START_NAV: { patterns: ['start', 'begin', 'navigate', 'let\'s go', 'start navigation'], priority: 8 },
      AVOID_AREA: { patterns: ['avoid', 'skip', 'don\'t go', 'no', 'stay away'], priority: 7 },
      PREFERENCE: { patterns: ['prefer', 'comfortable', 'fast', 'quiet', 'peaceful'], priority: 6 },
      GREET: { patterns: ['hello', 'hi', 'hey', 'greetings'], priority: 1 }
    };

    // Major cities/locations database
    this.locationDatabase = {
      'delhi': { lat: 28.6139, lng: 77.2090, aliases: ['delhi', 'new delhi', 'dilli'] },
      'chandigarh': { lat: 30.7333, lng: 76.7794, aliases: ['chandigarh', 'mohali'] },
      'ghaziabad': { lat: 28.6692, lng: 77.4538, aliases: ['ghaziabad', 'gzb'] },
      'noida': { lat: 28.5355, lng: 77.3910, aliases: ['noida', 'ncr'] },
      'panipat': { lat: 29.3910, lng: 79.1580, aliases: ['panipat'] },
      'airport': { lat: 28.5562, lng: 77.1000, aliases: ['airport', 'indira gandhi', 'igia'] },
      'sector 7': { lat: 30.7389, lng: 76.7641, aliases: ['sector 7', 's7', 'sector7'] },
      'sector 17': { lat: 30.7428, lng: 76.7589, aliases: ['sector 17', 's17', 'sector17'] },
      'mall': { lat: 30.7000, lng: 76.8000, aliases: ['mall', 'shopping mall', 'elante', 'shopping center'] },
      'market': { lat: 30.7200, lng: 76.7700, aliases: ['market', 'bazaar', 'sector 22'] }
    };
  }

  /**
   * Main entry point: Process user message and return AI response
   * Enhanced with Gemini intelligence
   */
  async processUserMessage(userMessage) {
    // Store in history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    });

    // Try Gemini first if available
    if (this.useGemini) {
      try {
        const geminiResponse = await this.processWithGemini(userMessage);
        if (geminiResponse) {
          this.conversationHistory.push({
            role: 'assistant',
            content: geminiResponse.message,
            timestamp: Date.now(),
            intent: geminiResponse.intent,
            confidence: geminiResponse.confidence,
            source: 'gemini'
          });
          return geminiResponse;
        }
      } catch (error) {
        console.warn('Gemini processing failed, using fallback:', error);
      }
    }

    // Fallback to pattern matching (now async)
    return await this.processWithPatternMatching(userMessage);
  }

  /**
   * Process message using Google Gemini AI
   */
  async processWithGemini(userMessage) {
    const context = `You are Harbor, an AI assistant for Rivo Navigation, a sensory-friendly navigation app.
Users have autism or sensory sensitivities and need quiet, comfortable routes.

Current user context:
- Origin: ${this.userPreferences.origin ? JSON.stringify(this.userPreferences.origin) : 'Not set'}
- Destination: ${this.userPreferences.destination ? JSON.stringify(this.userPreferences.destination) : 'Not set'}
- Preference: ${this.userPreferences.preferenceType}
- Avoid areas: ${this.userPreferences.avoidAreas.map(a => a.name).join(', ') || 'None'}

Available locations database:
- Delhi (28.6139, 77.2090)
- Chandigarh (30.7333, 76.7794)
- Sector 17 (30.7428, 76.7589)
- Ghaziabad (28.6692, 77.4538)
- Noida (28.5355, 77.3910)
- Airport (28.5562, 77.1000)

User message: "${userMessage}"

IMPORTANT: 
- If user mentions origin AND destination in ONE message, set action to "CALCULATE_ROUTE"
- Extract actual location names from the message
- If user wants to avoid crowds/noise, add to avoidAreas

Analyze and respond with JSON:
{
  "intent": "SET_LOCATION|SET_DESTINATION|GET_ROUTE|START_NAV|REPORT_NOISE|HELP|AVOID_AREA|GET_COMFORT|GREET|GENERAL",
  "origin": "exact location name or null",
  "destination": "exact location name or null",
  "preferences": ["comfort", "speed", "quiet"],
  "avoidAreas": ["crowds", "noise", "construction"],
  "confidence": 0.0-1.0,
  "action": "CALCULATE_ROUTE|SET_ORIGIN|SET_DESTINATION|START_NAVIGATION|SHOW_HELP|ADD_AVOID_AREA|null",
  "message": "Brief confirmation that you're setting up the route (1 sentence, use emoji)"
}`;

    try {
      const text = await this.callGeminiV1(context);
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Build response data
        let responseData = {};
        
        // Handle origin
        if (parsed.origin) {
          const originLocation = this.findLocationInDatabase(parsed.origin);
          if (originLocation) {
            this.userPreferences.origin = originLocation;
            responseData.origin = originLocation;
          }
        }
        
        // Handle destination
        if (parsed.destination) {
          const destLocation = this.findLocationInDatabase(parsed.destination);
          if (destLocation) {
            this.userPreferences.destination = destLocation;
            responseData.destination = destLocation;
          }
        }
        
        // Handle avoid areas
        if (parsed.avoidAreas && parsed.avoidAreas.length > 0) {
          parsed.avoidAreas.forEach(area => {
            if (!this.userPreferences.avoidAreas.some(a => a.name === area)) {
              this.userPreferences.avoidAreas.push({ name: area, type: 'general' });
            }
          });
        }
        
        // Handle preferences
        if (parsed.preferences && parsed.preferences.length > 0) {
          if (parsed.preferences.includes('comfort') || parsed.preferences.includes('quiet')) {
            this.userPreferences.preferenceType = 'comfort';
          } else if (parsed.preferences.includes('speed')) {
            this.userPreferences.preferenceType = 'speed';
          }
          responseData.preference = this.userPreferences.preferenceType;
        }
        
        // Determine final action - if both origin and destination are set, calculate route
        let finalAction = parsed.action;
        if (this.userPreferences.origin && this.userPreferences.destination && 
            (parsed.action === 'SET_DESTINATION' || parsed.action === 'CALCULATE_ROUTE')) {
          finalAction = 'CALCULATE_ROUTE';
          responseData = {
            origin: this.userPreferences.origin,
            destination: this.userPreferences.destination,
            preference: this.userPreferences.preferenceType,
            modes: this.userPreferences.selectedModes,
            avoidAreas: this.userPreferences.avoidAreas
          };
        } else if (parsed.origin && !parsed.destination) {
          finalAction = 'SET_ORIGIN';
          responseData = { location: this.userPreferences.origin };
        } else if (parsed.destination && !this.userPreferences.origin) {
          finalAction = 'SET_DESTINATION';
          responseData = { location: this.userPreferences.destination };
        }
        
        return {
          message: parsed.message || text,
          action: finalAction,
          data: responseData,
          intent: parsed.intent,
          confidence: parsed.confidence || 0.9,
          preferences: this.userPreferences,
          conversationContext: this.getConversationContext(),
          source: 'gemini'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Gemini processing error:', error);
      return null;
    }
  }

  /**
   * Call Gemini v1 REST API directly to avoid v1beta SDK routing.
   */
  async callGeminiV1(prompt) {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key not provided');
    }

    let lastError = null;

    // First try known candidates
    for (const modelName of this.geminiModelCandidates) {
      const endpoint = `${this.geminiEndpointBase}/${modelName}:generateContent?key=${encodeURIComponent(this.geminiApiKey)}`;
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }]
              }
            ]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          lastError = new Error(`Gemini v1 error ${response.status}: ${errorText}`);
          continue;
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          lastError = new Error('Gemini v1 returned empty response');
          continue;
        }

        return text;
      } catch (error) {
        lastError = error;
      }
    }

    // If all candidates fail, discover available models and retry
    const discovered = await this.listGeminiModels();
    const firstUsable = discovered.find(model => model.supportedGenerationMethods?.includes('generateContent'));
    if (firstUsable?.name) {
      const modelName = firstUsable.name.replace('models/', '');
      const endpoint = `${this.geminiEndpointBase}/${modelName}:generateContent?key=${encodeURIComponent(this.geminiApiKey)}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          console.log(`✅ Using discovered Gemini model: ${modelName}`);
          return text;
        }
      }
    }

    throw lastError || new Error('Gemini v1 request failed');
  }

  /**
   * List available Gemini models for this API key.
   */
  async listGeminiModels() {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(this.geminiApiKey)}`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      const models = data?.models || [];
      console.log('🔍 Available Gemini models:', models.map(m => m.name));
      return models;
    } catch (error) {
      console.warn('⚠️ Failed to list Gemini models', error);
      return [];
    }
  }

  /**
   * Find location in database by name
   */
  findLocationInDatabase(locationName) {
    const lowerName = locationName.toLowerCase();
    for (const [key, data] of Object.entries(this.locationDatabase)) {
      if (data.aliases.some(alias => lowerName.includes(alias))) {
        return {
          name: key,
          lat: data.lat,
          lng: data.lng,
          confidence: 0.9
        };
      }
    }
    return null;
  }

  /**
   * Fallback: Process with pattern matching
   */
  async processWithPatternMatching(userMessage) {
    // Clean input
    const cleanMessage = userMessage.toLowerCase().trim();

    // Step 1: Detect Intent
    const intent = this.detectIntent(cleanMessage);

    // Step 2: Extract Entities (locations, numbers, etc.)
    const entities = await this.extractEntities(cleanMessage);

    // Step 3: Update user preferences with extracted data
    this.updatePreferences(entities);

    // Step 4: Generate response based on intent & entities
    const response = this.generateResponse(intent, entities, cleanMessage);

    // Store response in history
    this.conversationHistory.push({
      role: 'assistant',
      content: response.message,
      timestamp: Date.now(),
      intent: intent.name,
      confidence: intent.confidence
    });

    return response;
  }

  /**
   * Detect user intent using pattern matching and scoring
   */
  detectIntent(message) {
    let bestMatch = { name: 'UNKNOWN', confidence: 0, priority: 0 };

    for (const [intentName, intentData] of Object.entries(this.intents)) {
      for (const pattern of intentData.patterns) {
        // Calculate confidence based on pattern match
        const regex = new RegExp(`\\b${pattern}\\b`);
        if (regex.test(message)) {
          const confidence = this.calculateConfidence(message, pattern);
          if (confidence > bestMatch.confidence) {
            bestMatch = { 
              name: intentName, 
              confidence: confidence,
              priority: intentData.priority,
              pattern: pattern
            };
          }
        }
      }
    }

    return bestMatch.confidence > this.confidenceThreshold 
      ? bestMatch 
      : { name: 'UNKNOWN', confidence: 0, priority: 0 };
  }

  /**
   * Extract entities from user message
   */
  async extractEntities(message) {
    const entities = {
      locations: [],
      coordinates: [],
      numbers: [],
      modes: [],
      preferences: [],
      keywords: []
    };

    // Extract coordinates (lat, lng format)
    const coordRegex = /(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/g;
    let match;
    while ((match = coordRegex.exec(message)) !== null) {
      entities.coordinates.push({
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
        text: match[0]
      });
    }

    // Extract location names from database
    let foundDbLocation = false;
    for (const [locKey, locData] of Object.entries(this.locationDatabase)) {
      for (const alias of locData.aliases) {
        if (message.includes(alias)) {
          entities.locations.push({
            name: locKey,
            lat: locData.lat,
            lng: locData.lng,
            confidence: this.calculateLocationConfidence(message, alias)
          });
          foundDbLocation = true;
        }
      }
    }

    // Fallback: If no location found in DB, try geocoding any capitalized word (likely a place)
    if (!foundDbLocation) {
      // Simple heuristic: look for capitalized words (potential place names)
      const placeRegex = /\b([A-Z][a-z]+(?: [A-Z][a-z]+)*)\b/g;
      let placeMatch;
      let tried = new Set();
      while ((placeMatch = placeRegex.exec(message)) !== null) {
        const placeName = placeMatch[1];
        if (tried.has(placeName.toLowerCase())) continue;
        tried.add(placeName.toLowerCase());
        // Call Nominatim geocoding API synchronously (blocking)
        try {
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`;
          const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
          if (resp.ok) {
            const results = await resp.json();
            if (results && results.length > 0) {
              const loc = results[0];
              entities.locations.push({
                name: placeName,
                lat: parseFloat(loc.lat),
                lng: parseFloat(loc.lon),
                confidence: 0.8
              });
              break; // Only add first geocoded place
            }
          }
        } catch (e) {
          // Ignore geocoding errors
        }
      }
    }

    // Extract numbers (distances, etc.)
    const numberRegex = /\d+(\.\d+)?/g;
    while ((match = numberRegex.exec(message)) !== null) {
      entities.numbers.push(parseFloat(match[0]));
    }

    // Extract transport modes
    const modes = ['walking', 'transit', 'driving', 'cycling'];
    modes.forEach(mode => {
      if (message.includes(mode)) {
        entities.modes.push(mode.toUpperCase());
      }
    });

    // Extract preferences
    const prefPatterns = {
      'comfort': ['comfortable', 'calm', 'quiet', 'peaceful', 'sensory', 'easy'],
      'speed': ['fast', 'quick', 'shortest', 'quickest'],
      'safety': ['safe', 'secure', 'well-lit'],
      'scenic': ['beautiful', 'scenic', 'scenic route']
    };

    for (const [pref, keywords] of Object.entries(prefPatterns)) {
      keywords.forEach(keyword => {
        if (message.includes(keyword)) {
          entities.preferences.push(pref);
        }
      });
    }

    // Extract general keywords
    const keywords = message.match(/\b[a-z]{4,}\b/g) || [];
    entities.keywords = [...new Set(keywords)];

    return entities;
  }

  /**
   * Update user preferences based on extracted entities
   */
  updatePreferences(entities) {
    // Update origin/destination based on extracted locations
    if (entities.locations.length > 0) {
      const location = entities.locations[0];
      if (!this.userPreferences.origin) {
        this.userPreferences.origin = location;
      } else {
        this.userPreferences.destination = location;
      }
    }

    // Update coordinate-based locations
    if (entities.coordinates.length > 0 && !this.userPreferences.origin) {
      this.userPreferences.origin = {
        lat: entities.coordinates[0].lat,
        lng: entities.coordinates[0].lng
      };
    }

    // Update transport modes
    if (entities.modes.length > 0) {
      this.userPreferences.selectedModes = entities.modes;
    }

    // Update preference type
    if (entities.preferences.includes('comfort')) {
      this.userPreferences.preferenceType = 'comfort';
    } else if (entities.preferences.includes('speed')) {
      this.userPreferences.preferenceType = 'speed';
    }
  }

  /**
   * Generate intelligent response based on intent & entities
   */
  generateResponse(intent, entities, originalMessage) {
    const intentName = intent.name;
    
    let message = '';
    let action = null;
    let data = {};

    switch (intentName) {
      case 'SET_LOCATION':
        if (entities.coordinates.length > 0) {
          this.userPreferences.origin = {
            lat: entities.coordinates[0].lat,
            lng: entities.coordinates[0].lng
          };
          message = `✅ Got your location: ${entities.coordinates[0].lat.toFixed(4)}, ${entities.coordinates[0].lng.toFixed(4)}`;
          action = 'SET_ORIGIN';
          data = { location: this.userPreferences.origin };
        } else if (entities.locations.length > 0) {
          this.userPreferences.origin = entities.locations[0];
          message = `✅ Set origin to ${entities.locations[0].name.toUpperCase()}`;
          action = 'SET_ORIGIN';
          data = { location: this.userPreferences.origin };
        } else {
          message = '📍 Please provide your location (e.g., "28.6692, 77.4538" or "Ghaziabad")';
        }
        break;

      case 'SET_DESTINATION':
        if (entities.coordinates.length > 0) {
          this.userPreferences.destination = {
            lat: entities.coordinates[0].lat,
            lng: entities.coordinates[0].lng
          };
          message = `✅ Destination set: ${entities.coordinates[0].lat.toFixed(4)}, ${entities.coordinates[0].lng.toFixed(4)}`;
          action = 'SET_DESTINATION';
          data = { location: this.userPreferences.destination };
        } else if (entities.locations.length > 0) {
          this.userPreferences.destination = entities.locations[0];
          message = `✅ Navigating to ${entities.locations[0].name.toUpperCase()}`;
          action = 'SET_DESTINATION';
          data = { location: this.userPreferences.destination };
        } else {
          message = '🗺️ Where do you want to go? (e.g., "Airport", "Sector 17", or coordinates)';
        }
        break;

      case 'GET_ROUTE':
        if (this.userPreferences.origin && this.userPreferences.destination) {
          message = `🛣️ Computing ${this.userPreferences.preferenceType} route from ${this.userPreferences.origin.name || 'your location'} to ${this.userPreferences.destination.name || 'destination'}...`;
          action = 'CALCULATE_ROUTE';
          data = {
            origin: this.userPreferences.origin,
            destination: this.userPreferences.destination,
            preference: this.userPreferences.preferenceType,
            modes: this.userPreferences.selectedModes
          };
        } else {
          message = '📍 Please set both origin and destination first. Say "I am at [location]" and "Take me to [destination]"';
        }
        break;

      case 'GET_COMFORT':
        const comfortLevel = Math.floor(Math.random() * 40) + 60; // Simulated comfort
        const emoji = comfortLevel > 70 ? '😊' : comfortLevel > 50 ? '😐' : '😰';
        message = `${emoji} Comfort Level: ${comfortLevel}% (${comfortLevel > 70 ? 'Great' : comfortLevel > 50 ? 'Moderate' : 'Low comfort'})`;
        action = 'CHECK_COMFORT';
        data = { comfort: comfortLevel };
        break;

      case 'START_NAV':
        if (this.userPreferences.destination) {
          message = `🚀 Starting navigation to ${this.userPreferences.destination.name || 'destination'}! Follow the route...`;
          action = 'START_NAVIGATION';
          data = { destination: this.userPreferences.destination };
        } else {
          message = '🗺️ Set a destination first!';
        }
        break;

      case 'HELP':
        message = `📚 I can help with:
• "Take me to [place]" - Navigation
• "My location is [place]" - Set current location
• "Show me route" - Get directions
• "Comfort level" - Check sensory comfort
• "Avoid [area]" - Skip certain areas
• "Report noise" - Learn how to report noisy zones
• "Vision and benefits" - Learn about Rivo's mission
• "Start navigation" - Begin guided tour`;
        action = 'SHOW_HELP';
        break;

      case 'REPORT_NOISE':
        message = `📋 Here's how to report a noise zone:

1️⃣ Scroll down to "Report a Zone" section
2️⃣ Enter the location name OR click the location button for current position
3️⃣ Select 🔊 "Noise Zone" from the dropdown menu
4️⃣ Click the "Report Zone" button
5️⃣ Your report helps other users avoid noisy areas!

💡 Tips:
• Reports stay active for 5 minutes for verification
• Community reports make Rivo better for everyone
• You can report multiple zones if needed`;
        action = 'SHOW_REPORT_GUIDE';
        break;

      case 'VISION_BENEFITS':
        message = `🧠 AI-Powered Sensory Routing

Our intelligent algorithm analyzes real-time data to avoid:
• Noisy areas (construction, traffic, crowds)
• Overwhelming visual stimuli (busy intersections, flashing signs)
• Crowded spaces (rush-hour zones, events)

Instead, we route through parks, quiet streets, and calming pathways—reducing anxiety and enabling independence.`;
        action = 'SHOW_VISION';
        break;

      case 'GREET':
        message = `👋 Hello! I'm Harbor, your AI navigation assistant. I can help you find sensory-friendly routes. Try "Help" to see what I can do!`;
        break;

      case 'AVOID_AREA':
        if (entities.locations.length > 0) {
          this.userPreferences.avoidAreas.push(entities.locations[0]);
          message = `✅ Added ${entities.locations[0].name} to your avoid list`;
          action = 'ADD_AVOID_AREA';
          data = { area: entities.locations[0] };
        } else {
          message = '🚫 Which area do you want to avoid?';
        }
        break;

      case 'PREFERENCE':
        if (entities.preferences.length > 0) {
          message = `✅ Set preference to ${entities.preferences[0].toUpperCase()}`;
          action = 'SET_PREFERENCE';
          data = { preference: entities.preferences[0] };
        }
        break;

      default:
        message = this.generateContextualResponse(originalMessage, entities);
        action = 'ANSWER';
    }

    return {
      message: message,
      action: action,
      data: data,
      intent: intent.name,
      confidence: intent.confidence,
      preferences: this.userPreferences,
      conversationContext: this.getConversationContext()
    };
  }

  /**
   * Generate smart suggestions based on message content
   */
  generateSmartSuggestion(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('where')) return 'Try saying "Take me to [place]"';
    if (lowerMsg.includes('how')) return 'I can calculate routes and show you directions!';
    if (lowerMsg.includes('can') || lowerMsg.includes('do')) return 'Type "Help" to see all my capabilities';
    return 'Type "Help" if you need guidance!';
  }

  /**
   * Generate contextual and intelligent responses to user questions
   */
  generateContextualResponse(message, entities) {
    const lowerMsg = message.toLowerCase();
    
    // Contextual Q&A based on keywords
    if (lowerMsg.includes('what') || lowerMsg.includes('who')) {
      if (lowerMsg.includes('rivo') || lowerMsg.includes('app')) {
        return '🏃 Rivo is a navigation app designed for people with autism and sensory sensitivities. It helps you find quiet, comfortable routes and avoid noisy or crowded areas.';
      }
      if (lowerMsg.includes('sensory') || lowerMsg.includes('autism')) {
        return '🧠 Sensory-friendly routes consider factors like noise levels, crowd density, and visual stress. I help identify the most comfortable paths for your journey.';
      }
      if (lowerMsg.includes('benefit') || lowerMsg.includes('vision') || lowerMsg.includes('purpose') || lowerMsg.includes('mission') || lowerMsg.includes('advantage')) {
        return `🧠 AI-Powered Sensory Routing

Our intelligent algorithm analyzes real-time data to avoid:
• Noisy areas (construction, traffic, crowds)
• Overwhelming visual stimuli (busy intersections, flashing signs)
• Crowded spaces (rush-hour zones, events)

Instead, we route through parks, quiet streets, and calming pathways—reducing anxiety and enabling independence.`;
      }
      if (lowerMsg.includes('route') || lowerMsg.includes('navigation')) {
        return '🗺️ I calculate routes based on your preferences. You can choose between comfort and speed. Set your location and destination to get started!';
      }
      if (lowerMsg.includes('quiet') || lowerMsg.includes('calm')) {
        return '🧘 I find peaceful routes that avoid noisy areas, busy streets, and crowded zones. This is perfect if you have sensory sensitivities.';
      }
    }
    
    if (lowerMsg.includes('how') || lowerMsg.includes('help')) {
      if (lowerMsg.includes('work') || lowerMsg.includes('use')) {
        return '📖 Start by saying "My location is [place]" then "Take me to [destination]". I will find the best sensory-friendly route for you!';
      }
      if (lowerMsg.includes('avoid') || lowerMsg.includes('noise') || lowerMsg.includes('crowd')) {
        return '🚫 Say "Avoid [area]" and I will keep that location off your routes. I also analyze community reports about noisy or crowded zones.';
      }
      if (lowerMsg.includes('community') || lowerMsg.includes('report')) {
        return '👥 Community reports help make routes better. Users share information about noisy areas, construction, or crowds. This helps all Rivo users!';
      }
    }
    
    if (lowerMsg.includes('can') || lowerMsg.includes('do')) {
      return '✨ I can:\n• Find quiet, sensory-friendly routes\n• Calculate travel time\n• Show step-by-step directions\n• Help you avoid noisy areas\n• Provide comfort ratings\n\nTry "Help" for specific commands!';
    }
    
    if (lowerMsg.includes('comfort')) {
      return '😊 Comfort rating shows how sensory-friendly a route is. Higher comfort = fewer noisy areas, less crowding, and more green spaces. Lower comfort = busier, louder areas.';
    }
    
    if (lowerMsg.includes('direction') || lowerMsg.includes('turn')) {
      return '🛣️ Give me a destination! Say "Take me to [place]" and I will provide turn-by-turn directions. You can also ask for comfort level details along the way.';
    }
    
    if (lowerMsg.includes('autis') || lowerMsg.includes('sensory') || lowerMsg.includes('neurodivers')) {
      return '🤝 Rivo is specifically designed for neurodivergent individuals, especially those with autism. It acknowledges sensory sensitivities and helps find comfortable environments.';
    }
    
    // Default helpful response
    return `💬 That's a great question! I'm here to help with navigation and finding sensory-friendly routes. Try "Help" to see my commands, or tell me where you want to go!`;
  }

  /**
   * Calculate confidence score for intent matching
   */
  calculateConfidence(message, pattern) {
    let confidence = 0.5; // Base confidence
    
    // Higher confidence if exact pattern found
    if (message.includes(pattern)) {
      confidence += 0.3;
    }
    
    // Higher confidence if pattern appears at start
    if (message.startsWith(pattern)) {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Calculate location confidence
   */
  calculateLocationConfidence(message, alias) {
    // Higher confidence if location name is exact match
    if (message.includes(alias)) {
      return 0.9;
    }
    return 0.7;
  }

  /**
   * Get conversation context for maintaining coherence
   */
  getConversationContext() {
    const recent = this.conversationHistory.slice(-4); // Last 4 messages
    return {
      totalMessages: this.conversationHistory.length,
      recentContext: recent,
      currentState: {
        hasOrigin: !!this.userPreferences.origin,
        hasDestination: !!this.userPreferences.destination,
        preferenceType: this.userPreferences.preferenceType
      }
    };
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get user conversation summary
   */
  getConversationSummary() {
    return {
      origin: this.userPreferences.origin,
      destination: this.userPreferences.destination,
      preference: this.userPreferences.preferenceType,
      modes: this.userPreferences.selectedModes,
      avoidAreas: this.userPreferences.avoidAreas,
      totalInteractions: this.conversationHistory.length
    };
  }

  /**
   * Analyze route for sensory comfort using Gemini
   */
  async analyzeRouteSensoryComfort(route, userPreferences = {}) {
    if (!this.useGemini) {
      return this.basicRouteSensoryAnalysis(route);
    }

    const context = `Analyze this navigation route for sensory comfort:

Route details:
- Distance: ${route.distance || 'Unknown'}
- Duration: ${route.duration || 'Unknown'}
- Steps: ${route.steps?.length || 0}

User preferences:
- Prefers: ${userPreferences.preferenceType || 'comfort'}
- Sensitivities: noise, crowds, visual stimuli

Rate this route:
{
  "comfortScore": 0-100,
  "noiseRisk": 0-100,
  "crowdRisk": 0-100,
  "triggers": ["list of potential sensory triggers"],
  "recommendations": ["suggestions for safer navigation"],
  "summary": "Brief 1-sentence assessment"
}`;

    try {
      const result = await this.geminiModel.generateContent(context);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Route analysis error:', error);
    }
    
    return this.basicRouteSensoryAnalysis(route);
  }

  /**
   * Basic route sensory analysis (fallback)
   */
  basicRouteSensoryAnalysis(route) {
    const baseComfort = 70;
    const distance = parseFloat(route.distance) || 0;
    const comfort = Math.max(40, Math.min(100, baseComfort - (distance * 0.5)));
    
    return {
      comfortScore: Math.round(comfort),
      noiseRisk: Math.round(100 - comfort),
      crowdRisk: 50,
      triggers: ['Traffic noise', 'Potential crowds'],
      recommendations: ['Use headphones', 'Travel during off-peak hours'],
      summary: `Comfort level: ${Math.round(comfort)}%`
    };
  }

  /**
   * Chat with Gemini for natural conversation
   */
  async chat(userMessage, context = {}) {
    if (!this.useGemini) {
      return this.generateContextualResponse(userMessage, {});
    }

    const systemContext = `You are Harbor, a friendly navigation assistant for Rivo - a sensory-friendly navigation app.

Current context:
- User location: ${context.location || 'Unknown'}
- Current route: ${context.route || 'None'}

Be helpful, empathetic, and concise. Respond in 1-2 sentences with an emoji.

User: "${userMessage}"`;

    try {
      const result = await this.geminiModel.generateContent(systemContext);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Chat error:', error);
      return this.generateContextualResponse(userMessage, {});
    }
  }
}

// Export for use in browser
window.AIUnderstandingEngine = AIUnderstandingEngine;
console.log('✅ AIUnderstandingEngine exported to window');
