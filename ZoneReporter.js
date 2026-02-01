/**
 * Client-side zone validation and reporting
 */

class ZoneReporter {
  constructor(userId) {
    this.userId = userId;
    this.apiBase = 'http://localhost:3000/api';
  }

  /**
   * Report a zone with validation
   */
  async reportZone(zoneType, lat, lng, options = {}) {
    try {
      // Validate coordinates
      if (!this.isValidCoordinates(lat, lng)) {
        throw new Error('Invalid GPS coordinates');
      }

      // Validate zone type
      const validTypes = ['noise', 'crowds', 'construction'];
      if (!validTypes.includes(zoneType)) {
        throw new Error('Invalid zone type');
      }

      const payload = {
        userId: this.userId,
        lat,
        lng,
        severity: options.severity || 5,
        description: options.description || '',
        photoUrl: options.photoUrl || null
      };

      const endpoint = zoneType === 'noise' ? '/reports/noise' 
                     : zoneType === 'crowds' ? '/reports/crowd'
                     : '/reports/construction';

      const response = await fetch(`${this.apiBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to report zone');
      return await response.json();
    } catch (error) {
      console.error('Zone report error:', error);
      throw error;
    }
  }

  /**
   * Get user reputation score
   */
  async getReputation() {
    try {
      const response = await fetch(`${this.apiBase}/users/${this.userId}/reputation`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching reputation:', error);
      return null;
    }
  }

  /**
   * Get verified zones
   */
  async getVerifiedZones() {
    try {
      const response = await fetch(`${this.apiBase}/zones/verified`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching zones:', error);
      return [];
    }
  }

  /**
   * Get all active zones
   */
  async getAllZones() {
    try {
      const response = await fetch(`${this.apiBase}/zones`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching zones:', error);
      return [];
    }
  }

  /**
   * Flag a zone as suspicious
   */
  async flagZone(zoneId, reason) {
    try {
      const response = await fetch(`${this.apiBase}/zones/${zoneId}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      return await response.json();
    } catch (error) {
      console.error('Error flagging zone:', error);
      throw error;
    }
  }

  /**
   * Validate GPS coordinates
   */
  isValidCoordinates(lat, lng) {
    return !isNaN(lat) && !isNaN(lng) && 
           lat >= -90 && lat <= 90 && 
           lng >= -180 && lng <= 180;
  }

  /**
   * Calculate distance between two points (in meters)
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Find nearby zones
   */
  async findNearbyZones(lat, lng, radiusMeters = 100) {
    const zones = await this.getAllZones();
    return zones.filter(zone => {
      const distance = this.calculateDistance(lat, lng, zone.coordinates.lat, zone.coordinates.lng);
      return distance <= radiusMeters;
    });
  }

  /**
   * Get admin statistics
   */
  async getStats() {
    try {
      const response = await fetch(`${this.apiBase}/admin/stats`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  }
}

// Export for browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ZoneReporter;
}
