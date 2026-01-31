const express = require('express');
const router = express.Router();
const NoiseZone = require('../models/NoiseZone');
const User = require('../models/User');

// Add a new noise zone
router.post('/', async (req, res) => {
  try {
    const { location, description, userEmail } = req.body;
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const zone = new NoiseZone({ location, description, reportedBy: user._id });
    await zone.save();
    res.status(201).json(zone);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all noise zones
router.get('/', async (req, res) => {
  try {
    const zones = await NoiseZone.find().populate('reportedBy', 'name email');
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
