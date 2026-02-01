# Rivo - AI-Powered Google Maps Application

A comprehensive web application combining Google Maps, Firebase, Azure AI services, and Gemini AI for advanced mapping, analytics, chatbot functionality, and intelligent routing.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Firebase Integration](#firebase-integration)
- [Azure AI Integration](#azure-ai-integration)
- [Deployment](#deployment)
- [Documentation](#documentation)

## ✨ Features

- **Interactive Google Maps** - Real-time map visualization with markers and routing
- **AI Chatbot** - Powered by Gemini AI for intelligent responses
- **Advanced Routing** - Turn-by-turn directions with live recalculation
- **Analytics Dashboard** - Google Analytics and custom metrics tracking
- **Authentication** - Firebase and custom auth integration
- **Multi-language NLP** - AI-powered natural language processing
- **Real-time Updates** - Live location tracking and notifications
- **Weather Integration** - Current weather data display
- **Sensory Awareness** - Report and visualize noise, crowds, and construction zones
- **Azure AI Services** - Integration with Azure for enhanced AI capabilities

## 📁 Project Structure

```
├── index.html                      # Main entry point
├── server.js                       # Express server
├── config.js                       # Configuration settings
├── style.css                       # Main styles
├── layout.js                       # Layout management
├── script.js                       # Core functionality
│
├── backend/                        # Backend services
│   ├── server.js                   # Backend server
│   ├── cache/                      # Caching layer
│   ├── models/                     # Data models
│   ├── routes/                     # API routes
│   └── services/                   # Business logic
│
├── components/                     # Reusable UI components
│   ├── header.html
│   └── footer.html
│
├── implementations/                # Feature implementations
│   ├── ai-chatbot.html
│   ├── analytics-integration-examples.js
│   ├── ai-action-handler.js
│   ├── backend-analytics.js
│   ├── gemini-route-analyzer.js
│   └── ui-enhancements.js
│
├── rivomaps/                       # Map-related features
│   ├── ai-chatbot.html
│   ├── gemini-route-analyzer.js
│   ├── ai-demo.html
│   └── [Multiple integration guides]
│
├── demos/                          # Demo applications
│   ├── ai-demo.html
│   ├── gemini-demo.html
│   ├── storage-demo.html
│   └── auth-test.html
│
├── docs/                           # Documentation
│   ├── FIREBASE_SETUP_GUIDE.md
│   ├── ANALYTICS_SETUP_GUIDE.md
│   ├── ENABLE_FIRESTORE_GUIDE.md
│   └── [Additional guides]
│
├── firebase-*.js                   # Firebase integration files
├── global-auth.js                  # Global authentication
├── helpers.js                      # Utility functions
└── local-storage.js                # Local storage management
```

## 📋 Prerequisites

- Node.js (v14+)
- npm or yarn
- Google Maps API key
- Firebase project credentials
- Azure AI services credentials (optional)
- Gemini API key

## 🚀 Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd "rivo google ai"
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create `config.js` from `config.example.js`:
```bash
cp config.example.js config.js
```

4. **Configure weather settings:**
Create `weather-config.js` from `weather-config.example.js`:
```bash
cp weather-config.example.js weather-config.js
```

## ⚙️ Configuration

### API Keys Required

Update `config.js` with your credentials:

```javascript
// Google Maps API
GOOGLE_MAPS_API_KEY: "your_google_maps_key"

// Firebase
FIREBASE_CONFIG: {
  apiKey: "your_firebase_api_key",
  authDomain: "your_project.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "your_messaging_id",
  appId: "your_app_id"
}

// Gemini AI
GEMINI_API_KEY: "your_gemini_api_key"

// Azure AI (optional)
AZURE_AI_KEY: "your_azure_key"
AZURE_ENDPOINT: "your_azure_endpoint"
```

### Weather Configuration

Update `weather-config.js`:
```javascript
WEATHER_API_KEY: "your_weather_api_key"
WEATHER_API_ENDPOINT: "your_endpoint"
```

## 💻 Usage

### Start the Application

```bash
npm start
```

Server runs on `http://localhost:3000`

### Main Features

**1. Map Interaction:**
- View interactive Google Maps
- Add markers for reports (noise, crowds, construction)
- Get real-time directions with turn-by-turn guidance

**2. AI Chatbot:**
- Ask questions about locations, routes, and weather
- Get intelligent responses powered by Gemini AI
- Natural language processing for context-aware answers

**3. Analytics:**
- Track user interactions and events
- View analytics dashboard
- Monitor application metrics

**4. Authentication:**
- Firebase authentication
- Global auth system
- Session management

## 🔌 API Endpoints

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports/noise` - Report noise zone
- `POST /api/reports/crowd` - Report crowded area
- `POST /api/reports/construction` - Report construction zone
- `DELETE /api/reports/:id` - Delete a report

### Analytics
- `GET /api/analytics/events` - Get analytics events
- `POST /api/analytics/track` - Track user event
- `GET /api/analytics/dashboard` - Get dashboard data

### AI Services
- `POST /api/ai/chat` - Send chat message
- `POST /api/ai/analyze-route` - Analyze route with AI
- `POST /api/ai/process-image` - Process image with Vision API

## 🔥 Firebase Integration

### Setup
See [Firebase Setup Guide](docs/FIREBASE_SETUP_GUIDE.md)

### Features
- User authentication
- Real-time database
- Cloud Firestore
- Analytics tracking
- Cloud Storage

### Enable Firestore
See [Enable Firestore Guide](docs/ENABLE_FIRESTORE_GUIDE.md)

## 🤖 Azure AI Integration

### Setup
See [Azure AI Integration Guide](rivomaps/AZURE_AI_INTEGRATION_GUIDE.txt)

### Features
- Computer Vision API
- Text Analytics
- Language Understanding
- Custom ML Models

## 📊 Analytics

The application includes comprehensive analytics tracking:

### Data Collection
See [Analytics Data Collected](docs/ANALYTICS_DATA_COLLECTED.md)

### Setup Guide
See [Analytics Setup Guide](docs/ANALYTICS_SETUP_GUIDE.md)

### Dashboard
See [Analytics Quick Start](docs/ANALYTICS_QUICK_START.md)

## 🚢 Deployment

See [Deployment Instructions](DEPLOYMENT_INSTRUCTIONS.md)

### Platforms Supported
- Firebase Hosting
- Azure App Service
- Heroku
- Traditional web servers

## 📖 Documentation

### Main Guides
- [Firebase Integration Complete](docs/FIREBASE_INTEGRATION_COMPLETE.md)
- [Firebase Quick Reference](docs/FIREBASE_QUICK_REFERENCE.md)
- [API Fix Summary](API_FIX_SUMMARY.md)
- [Map Integration Complete](rivomaps/MAP_INTEGRATION_COMPLETE.md)
- [Implementation Complete](rivomaps/IMPLEMENTATION_COMPLETE.md)

### Feature Guides
- [Live Location & Directions](rivomaps/LIVE_LOCATION_DIRECTIONS_GUIDE.md)
- [Live Recalculation](rivomaps/LIVE_RECALCULATION_GUIDE.md)
- [AI Chatbot Guide](rivomaps/AI_CHATBOT_GUIDE.md)
- [AI-Powered Understanding](rivomaps/AI_POWERED_UNDERSTANDING_GUIDE.md)

### Testing & Demos
- [How to Test](rivomaps/HOW_TO_TEST.txt)
- [Demo Presentation Guide](rivomaps/DEMO_PRESENTATION_GUIDE.md)

## 🧪 Testing

### Available Demo Pages
- `demo-presentation.html` - Full feature demonstration
- `ai-demo.html` - AI capabilities demo
- `gemini-demo.html` - Gemini AI integration
- `storage-demo.html` - Firebase storage demo
- `auth-test.html` - Authentication testing
- `test-turn-by-turn.html` - Turn-by-turn navigation
- `test-live-recalculation.html` - Live route recalculation

### Running Tests

Open any demo file in your browser to test features.

## 🛠️ Development

### Code Style
- Follow existing code conventions
- Use meaningful variable names
- Comment complex logic
- Test before committing

### Adding New Features
1. Create feature in `implementations/` or relevant folder
2. Update corresponding HTML/JS files
3. Add API endpoints in `backend/routes/`
4. Update documentation
5. Test thoroughly

## 🐛 Troubleshooting

### Common Issues

**Maps not displaying:**
- Verify Google Maps API key is valid
- Check network connectivity
- Clear browser cache

**Authentication failing:**
- Verify Firebase config
- Check API keys
- Review auth.js files

**Analytics not tracking:**
- Verify Analytics setup
- Check Firebase integration
- Review console for errors

### Debug Mode

Enable debug logging in `config.js`:
```javascript
DEBUG: true
```

## 📝 License

[Your License Here]

## 👤 Author

Rivo Project Team

## 📧 Support

For issues and support, please refer to the documentation files in the `docs/` and `rivomaps/` directories.

## 🔗 Related Links

- [Google Maps API Documentation](https://developers.google.com/maps)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Azure AI Services](https://azure.microsoft.com/en-us/products/ai-services/)
- [Gemini API Documentation](https://ai.google.dev/)
