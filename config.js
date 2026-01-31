// API Configuration - Load from environment variables
// DO NOT commit .env file to Git


// Store frontend API keys here. Do NOT commit real keys to public repos.
const config = {
  geminiApiKey: 'YOUR_NEW_GEMINI_API_KEY_HERE', // Replace with your NEW Gemini API key from Google AI Studio
  openWeatherMapApiKey: 'b74c01ac989158152c0e93df14d15ba1', // Replace with your actual OpenWeatherMap API key
  emailjsPublicKey: 'your_public_id'
};

if (config.geminiApiKey === 'YOUR_NEW_GEMINI_API_KEY_HERE') {
  console.warn('⚠️ Please replace YOUR_NEW_GEMINI_API_KEY_HERE with your actual Gemini API key from Google AI Studio');
}
if (config.openWeatherMapApiKey === 'b74c01ac989158152c0e93df14d15ba1') {
  console.warn('⚠️ OpenWeatherMap API key not configured. Add your key to config.js');
}

window.CONFIG = config;
