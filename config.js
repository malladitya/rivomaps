// API Configuration - Load from environment variables
// DO NOT commit .env file to Git

const config = {
  geminiApiKey: 'AIzaSyBr-mdA5gSbeWN5DgDNEgL92_7NX0sX3AY',
  emailjsPublicKey: 'your_public_id'
};

if (config.geminiApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
  console.warn('⚠️ Gemini API key not configured. Add your key to .env file');
}

window.CONFIG = config;
