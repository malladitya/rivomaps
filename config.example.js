// API Configuration Template
// Copy this file to config.js and add your actual API keys
// DO NOT commit config.js with real keys to Git!

// Store frontend API keys here. Do NOT commit real keys to public repos.
const config = {
  // Get your Gemini API key from: https://aistudio.google.com/app/apikey
  geminiApiKey: 'YOUR_GEMINI_API_KEY_HERE',
  
  // Get your OpenWeatherMap API key from: https://openweathermap.org/api
  openWeatherMapApiKey: 'YOUR_OPENWEATHERMAP_API_KEY_HERE',
  
  // Get your EmailJS public key from: https://www.emailjs.com/
  emailjsPublicKey: 'YOUR_EMAILJS_PUBLIC_KEY_HERE',
  
  // Get your Azure Maps key from: https://azure.microsoft.com/en-us/services/azure-maps/
  azureMapsKey: 'YOUR_AZURE_MAPS_KEY_HERE'
};

// Warnings for missing keys
if (config.geminiApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
  console.warn('⚠️ Gemini API key not configured. Add your key to config.js for AI features.');
}
if (config.openWeatherMapApiKey === 'YOUR_OPENWEATHERMAP_API_KEY_HERE') {
  console.warn('⚠️ OpenWeatherMap API key not configured. Add your key to config.js');
}
if (config.azureMapsKey === 'YOUR_AZURE_MAPS_KEY_HERE') {
  console.warn('⚠️ Azure Maps key not configured. Add your subscription key to config.js');
}

window.CONFIG = config;
