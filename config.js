// API Configuration - Load from environment variables
// DO NOT commit .env file to Git


// Store frontend API keys here. Do NOT commit real keys to public repos.
const config = {
  geminiApiKey: 'AIzaSyC0lilIDNS10lOogA7x4Er3JZ3Uv3lsPiQ', // Replace with your actual Gemini API key
  openWeatherMapApiKey: 'b74c01ac989158152c0e93df14d15ba1', // Replace with your actual OpenWeatherMap API key
  emailjsPublicKey: 'your_public_id'
};

if (config.geminiApiKey === 'AIzaSyC0lilIDNS10lOogA7x4Er3JZ3Uv3lsPiQ') {
  console.warn('⚠️ Gemini API key not configured. Add your key to config.js');
}
if (config.openWeatherMapApiKey === 'b74c01ac989158152c0e93df14d15ba1') {
  console.warn('⚠️ OpenWeatherMap API key not configured. Add your key to config.js');
}

window.CONFIG = config;
