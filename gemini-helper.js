/**
 * Gemini API Helper Functions
 * Easy way to test and update Gemini API keys
 */

// Global function to set Gemini API key
window.setGeminiApiKey = function(apiKey) {
  if (!apiKey || apiKey.length < 20) {
    console.error('❌ Invalid API key. Please provide a valid Gemini API key.');
    return false;
  }
  
  console.log('🔄 Setting new Gemini API key...');
  
  // Update the config
  if (window.CONFIG) {
    window.CONFIG.geminiApiKey = apiKey;
  }
  
  // Update local storage for persistence
  localStorage.setItem('geminiApiKey', apiKey);
  
  // Clear any cached disabled state
  localStorage.removeItem('geminiDisabled');
  
  // Re-initialize the AI engine if it exists
  if (window.aiEngine) {
    window.aiEngine.geminiApiKey = apiKey;
    window.aiEngine.geminiDisabled = false;
    window.aiEngine.useGemini = true;
    console.log('✅ AI Engine updated with new API key');
  }
  
  // Test the new API key
  testGeminiApiKeyDirect(apiKey);
  
  return true;
};

// Direct API key testing function
window.testGeminiApiKeyDirect = async function(apiKey) {
  const keyToTest = apiKey || window.CONFIG?.geminiApiKey || localStorage.getItem('geminiApiKey');
  
  if (!keyToTest) {
    console.error('❌ No API key to test. Use setGeminiApiKey("your-key") first.');
    return false;
  }
  
  console.log('🧪 Testing Gemini API key:', keyToTest.substring(0, 20) + '...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(keyToTest)}`);
    
    if (response.ok) {
      const data = await response.json();
      const models = data?.models || [];
      const modelNames = models.map(m => m.name.replace('models/', '')).slice(0, 5);
      
      console.log('✅ API Key is VALID!');
      console.log('📊 Available models:', modelNames.join(', '));
      console.log('🎉 Total models available:', models.length);
      
      // Test with a simple generation
      return await testGeminiGeneration(keyToTest);
    } else {
      const errorText = await response.text();
      console.error('❌ API Key is INVALID!');
      console.error('📋 Response:', response.status, errorText);
      console.warn('💡 Get a new key from: https://aistudio.google.com/app/apikey');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to test API key:', error.message);
    return false;
  }
};

// Test actual text generation
async function testGeminiGeneration(apiKey) {
  console.log('🔬 Testing text generation...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: 'Say "Hello from Gemini!" if you are working correctly.' }]
        }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (generatedText) {
        console.log('✅ Text generation SUCCESSFUL!');
        console.log('🤖 Gemini says:', generatedText);
        return true;
      } else {
        console.warn('⚠️ API key works but generation returned empty response');
        return false;
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Text generation FAILED:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Text generation ERROR:', error.message);
    return false;
  }
}

// Function to check current API key status
window.checkGeminiStatus = function() {
  const apiKey = window.CONFIG?.geminiApiKey || localStorage.getItem('geminiApiKey');
  
  console.log('📊 Gemini Status Report:');
  console.log('🔑 API Key:', apiKey ? apiKey.substring(0, 20) + '...' : 'Not set');
  console.log('🔧 Config loaded:', !!window.CONFIG);
  console.log('🤖 AI Engine:', !!window.aiEngine);
  console.log('✨ Gemini enabled:', window.aiEngine?.useGemini || false);
  console.log('🚫 Gemini disabled:', window.aiEngine?.geminiDisabled || false);
  
  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY' && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
    console.log('🧪 Running API key test...');
    testGeminiApiKeyDirect(apiKey);
  } else {
    console.warn('⚠️ No valid API key found. Use setGeminiApiKey("your-key") to set one.');
  }
};

// Auto-check status on load
if (document.readyState === 'complete') {
  setTimeout(() => {
    console.log('🔍 Auto-checking Gemini status...');
    checkGeminiStatus();
  }, 1000);
} else {
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('🔍 Auto-checking Gemini status...');
      checkGeminiStatus();
    }, 1000);
  });
}

console.log('🛠️ Gemini Helper loaded! Available functions:');
console.log('   setGeminiApiKey("your-key") - Set your API key');
console.log('   testGeminiApiKeyDirect() - Test current API key');
console.log('   checkGeminiStatus() - Check overall status');