/**
 * Gemini Route Analyzer
 * Analyzes routes using Gemini AI for sensory comfort
 */

class GeminiRouteAnalyzer {
  constructor(geminiApiKey) {
    this.apiKey = geminiApiKey;
    this.initialized = false;
    this.initializeGemini();
  }

  async initializeGemini() {
    try {
      if (typeof GoogleGenerativeAI === 'undefined') {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        window.GoogleGenerativeAI = GoogleGenerativeAI;
      }
      
      const genAI = new GoogleGenerativeAI(this.apiKey);
      // Use v1 endpoint (not v1beta) - specify API version explicitly
      this.model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        apiVersion: "v1"  // Force v1 endpoint instead of v1beta
      });
      this.visionModel = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        apiVersion: "v1"  // Force v1 endpoint instead of v1beta
      });
      this.initialized = true;
      console.log('✅ Gemini Route Analyzer initialized (v1 endpoint)');
    } catch (error) {
      console.error('Failed to initialize Gemini:', error);
    }
  }

  /**
   * Analyze street view image for sensory triggers
   */
  async analyzeStreetViewImage(imageUrl, location) {
    if (!this.initialized) {
      console.warn('Gemini not initialized');
      return null;
    }

    try {
      // Fetch image and convert to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64 = await this.blobToBase64(blob);
      
      const prompt = `Analyze this street view image for sensory comfort and accessibility.

Location: ${location}

Identify and rate (0-100):
1. **Crowd Density**: How crowded is this area?
2. **Traffic Intensity**: Amount of vehicle traffic
3. **Noise Sources**: Construction, traffic, crowds, etc.
4. **Visual Stimuli**: Bright lights, signs, busy visuals
5. **Overall Comfort**: For someone with sensory sensitivities

Respond in JSON:
{
  "crowdDensity": 0-100,
  "trafficIntensity": 0-100,
  "noiseSources": ["list of noise sources"],
  "visualStimuli": ["list of visual triggers"],
  "comfortRating": 0-100,
  "description": "Brief 1-sentence description",
  "recommendations": ["suggestions for navigation"]
}`;

      const imagePart = {
        inlineData: {
          data: base64.split(',')[1],
          mimeType: blob.type
        }
      };

      const result = await this.visionModel.generateContent([prompt, imagePart]);
      const text = result.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Image analysis error:', error);
      return null;
    }
  }

  /**
   * Analyze route waypoints for comfort
   */
  async analyzeRouteWaypoints(waypoints, routeInfo = {}) {
    if (!this.initialized) {
      console.warn('Gemini not initialized');
      return null;
    }

    const waypointList = waypoints.map((wp, i) => 
      `${i + 1}. ${wp.name || wp.address || `${wp.lat}, ${wp.lng}`}`
    ).join('\n');

    const prompt = `Analyze this navigation route for sensory comfort:

Route Information:
- Distance: ${routeInfo.distance || 'Unknown'}
- Duration: ${routeInfo.duration || 'Unknown'}
- Transport mode: ${routeInfo.mode || 'Walking'}

Waypoints:
${waypointList}

Analyze each waypoint for:
1. Expected noise level
2. Expected crowd density
3. Sensory triggers
4. Comfort recommendations

Overall route rating:
- Comfort score (0-100)
- Key concerns
- Alternative suggestions

Respond in JSON:
{
  "overallComfort": 0-100,
  "noiseRisk": 0-100,
  "crowdRisk": 0-100,
  "waypoints": [
    {
      "index": 0,
      "comfort": 0-100,
      "concerns": ["list"],
      "recommendation": "suggestion"
    }
  ],
  "summary": "Brief overall assessment",
  "alternatives": "Suggested improvements or alternative routes"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Waypoint analysis error:', error);
      return null;
    }
  }

  /**
   * Get smart route recommendations
   */
  async getRouteRecommendations(origin, destination, userPreferences = {}) {
    if (!this.initialized) {
      console.warn('Gemini not initialized');
      return null;
    }

    const prompt = `Generate sensory-friendly route recommendations from "${origin}" to "${destination}".

User Preferences:
- Sensitivity: ${userPreferences.sensitivities?.join(', ') || 'Noise, crowds'}
- Priority: ${userPreferences.priority || 'Comfort over speed'}
- Transport: ${userPreferences.mode || 'Walking'}
- Time of day: ${userPreferences.timeOfDay || 'Current'}

Suggest 3 routes:
1. **Most Comfortable**: Quietest, least crowded (may be longer)
2. **Balanced**: Good comfort + reasonable time
3. **Fastest**: Quickest route (note sensory concerns)

For each route provide:
- Expected comfort score (0-100)
- Estimated time
- Key highlights
- Sensory warnings
- Why this route

Respond in JSON:
{
  "routes": [
    {
      "name": "Route name",
      "type": "comfort|balanced|fast",
      "comfortScore": 0-100,
      "estimatedTime": "duration",
      "highlights": ["positive points"],
      "warnings": ["sensory concerns"],
      "reasoning": "why choose this route",
      "recommendedFor": "who should use this"
    }
  ]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Route recommendation error:', error);
      return null;
    }
  }

  /**
   * Convert blob to base64
   */
  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

// Export
window.GeminiRouteAnalyzer = GeminiRouteAnalyzer;

// Helper function to set Gemini API key
window.setGeminiApiKey = function(apiKey) {
  localStorage.setItem('geminiApiKey', apiKey);
  console.log('✅ Gemini API key saved');
  
  // Reinitialize AI if chatbot is loaded
  if (window.initializeGeminiAI) {
    window.initializeGeminiAI(apiKey);
  }
  
  // Create route analyzer
  window.routeAnalyzer = new GeminiRouteAnalyzer(apiKey);
  
  return 'Gemini API key set successfully! Reload the page to activate.';
};

// Helper function to analyze current route
window.analyzeCurrentRoute = async function(route) {
  if (!window.routeAnalyzer) {
    return 'Please set Gemini API key first using: setGeminiApiKey("YOUR_KEY")';
  }
  
  const analysis = await window.routeAnalyzer.analyzeRouteWaypoints(
    route.waypoints || [],
    {
      distance: route.distance,
      duration: route.duration,
      mode: route.travelMode
    }
  );
  
  console.log('📊 Route Analysis:', analysis);
  return analysis;
};
