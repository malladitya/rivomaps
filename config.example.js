// API Configuration - Load from environment variables
// DO NOT commit .env file to Git
// Copy this file to config.js and add your actual API keys

// Store frontend API keys here. Do NOT commit real keys to public repos.
const config = {
  geminiApiKey: 'YOUR_GEMINI_API_KEY_HERE', // Replace with your NEW Gemini API key from Google AI Studio
  openWeatherMapApiKey: 'YOUR_OPENWEATHERMAP_API_KEY_HERE', // Replace with your actual OpenWeatherMap API key
  emailjsPublicKey: 'YOUR_EMAILJS_PUBLIC_KEY_HERE'
};

if (config.geminiApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
  console.warn('⚠️ Please replace YOUR_GEMINI_API_KEY_HERE with your actual Gemini API key from Google AI Studio');
}
if (config.openWeatherMapApiKey === 'YOUR_OPENWEATHERMAP_API_KEY_HERE') {
  console.warn('⚠️ OpenWeatherMap API key not configured. Add your key to config.js');
}

window.CONFIG = config;
