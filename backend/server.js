require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// API routes
const userRoutes = require('./routes/user');
const noiseZoneRoutes = require('./routes/noiseZone');
const weatherRoutes = require('./routes/weather');
app.use('/api/user', userRoutes);
app.use('/api/noise-zone', noiseZoneRoutes);
app.use('/api/weather', weatherRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
