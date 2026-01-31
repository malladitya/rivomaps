const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get weather forecast for a location
router.get('/', async (req, res) => {
  const location = req.query.location;
  if (!location) return res.status(400).json({ error: 'Location is required' });
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    const weather = response.data.weather[0];
    // Check for thunderstorm or lightning in weather conditions
    const thunderstormCodes = [200,201,202,210,211,212,221,230,231,232];
    const isThunderstorm = thunderstormCodes.includes(weather.id);
    const thunderWarning = isThunderstorm ? 'Thunderstorm/Lightning detected! Please take precautions.' : null;
    res.json({
      location: response.data.name,
      temperature: response.data.main.temp,
      description: weather.description,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed,
      thunderWarning
    });
  } catch (err) {
    res.status(500).json({ error: 'Weather API error or invalid location' });
  }
});

module.exports = router;
