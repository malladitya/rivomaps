// Local Storage Manager for Rivo Maps
// Stores user data, routes, preferences without needing a backend database

class RivoStorage {
  constructor() {
    this.STORAGE_KEYS = {
      USER_DATA: 'rivo_user_data',
      SAVED_ROUTES: 'rivo_saved_routes',
      PREFERENCES: 'rivo_preferences',
      SEARCH_HISTORY: 'rivo_search_history',
      FAVORITES: 'rivo_favorites'
    };
  }

  // ===== USER DATA =====
  
  getUserData() {
    const data = localStorage.getItem(this.STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  saveUserData(userData) {
    const dataToSave = {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName || userData.email,
      photoURL: userData.photoURL || null,
      lastLogin: new Date().toISOString(),
      createdAt: userData.createdAt || new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(dataToSave));
    return dataToSave;
  }

  clearUserData() {
    localStorage.removeItem(this.STORAGE_KEYS.USER_DATA);
  }

  // ===== SAVED ROUTES =====
  
  getSavedRoutes() {
    const routes = localStorage.getItem(this.STORAGE_KEYS.SAVED_ROUTES);
    return routes ? JSON.parse(routes) : [];
  }

  saveRoute(routeData) {
    const routes = this.getSavedRoutes();
    const newRoute = {
      id: Date.now().toString(),
      from: routeData.from,
      to: routeData.to,
      distance: routeData.distance,
      duration: routeData.duration,
      savedAt: new Date().toISOString(),
      coordinates: routeData.coordinates || null
    };
    routes.unshift(newRoute); // Add to beginning
    
    // Keep only last 50 routes
    const limitedRoutes = routes.slice(0, 50);
    localStorage.setItem(this.STORAGE_KEYS.SAVED_ROUTES, JSON.stringify(limitedRoutes));
    return newRoute;
  }

  deleteRoute(routeId) {
    const routes = this.getSavedRoutes();
    const updatedRoutes = routes.filter(route => route.id !== routeId);
    localStorage.setItem(this.STORAGE_KEYS.SAVED_ROUTES, JSON.stringify(updatedRoutes));
    return updatedRoutes;
  }

  clearAllRoutes() {
    localStorage.setItem(this.STORAGE_KEYS.SAVED_ROUTES, JSON.stringify([]));
  }

  // ===== PREFERENCES =====
  
  getPreferences() {
    const prefs = localStorage.getItem(this.STORAGE_KEYS.PREFERENCES);
    return prefs ? JSON.parse(prefs) : {
      theme: 'light',
      mapStyle: 'standard',
      units: 'metric', // or 'imperial'
      avoidTolls: false,
      avoidHighways: false,
      defaultTransportMode: 'driving'
    };
  }

  savePreferences(preferences) {
    const currentPrefs = this.getPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    localStorage.setItem(this.STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPrefs));
    return updatedPrefs;
  }

  // ===== SEARCH HISTORY =====
  
  getSearchHistory() {
    const history = localStorage.getItem(this.STORAGE_KEYS.SEARCH_HISTORY);
    return history ? JSON.parse(history) : [];
  }

  addToSearchHistory(searchTerm) {
    const history = this.getSearchHistory();
    
    // Remove duplicate if exists
    const filtered = history.filter(item => item.term !== searchTerm);
    
    // Add new search to beginning
    filtered.unshift({
      term: searchTerm,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 20 searches
    const limitedHistory = filtered.slice(0, 20);
    localStorage.setItem(this.STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(limitedHistory));
    return limitedHistory;
  }

  clearSearchHistory() {
    localStorage.setItem(this.STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify([]));
  }

  // ===== FAVORITES =====
  
  getFavorites() {
    const favorites = localStorage.getItem(this.STORAGE_KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite(place) {
    const favorites = this.getFavorites();
    
    // Check if already exists
    const exists = favorites.some(fav => fav.name === place.name && fav.lat === place.lat);
    if (exists) {
      return { success: false, message: 'Already in favorites' };
    }
    
    const newFavorite = {
      id: Date.now().toString(),
      name: place.name,
      address: place.address || '',
      lat: place.lat,
      lng: place.lng,
      addedAt: new Date().toISOString()
    };
    
    favorites.unshift(newFavorite);
    
    // Keep only last 30 favorites
    const limitedFavorites = favorites.slice(0, 30);
    localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify(limitedFavorites));
    return { success: true, data: newFavorite };
  }

  removeFavorite(favoriteId) {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== favoriteId);
    localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  }

  // ===== UTILITY FUNCTIONS =====
  
  exportAllData() {
    return {
      userData: this.getUserData(),
      savedRoutes: this.getSavedRoutes(),
      preferences: this.getPreferences(),
      searchHistory: this.getSearchHistory(),
      favorites: this.getFavorites(),
      exportedAt: new Date().toISOString()
    };
  }

  importData(data) {
    try {
      if (data.userData) localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(data.userData));
      if (data.savedRoutes) localStorage.setItem(this.STORAGE_KEYS.SAVED_ROUTES, JSON.stringify(data.savedRoutes));
      if (data.preferences) localStorage.setItem(this.STORAGE_KEYS.PREFERENCES, JSON.stringify(data.preferences));
      if (data.searchHistory) localStorage.setItem(this.STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(data.searchHistory));
      if (data.favorites) localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify(data.favorites));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  clearAllData() {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  getStorageUsage() {
    let totalSize = 0;
    Object.values(this.STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += new Blob([item]).size;
      }
    });
    
    return {
      used: (totalSize / 1024).toFixed(2) + ' KB',
      usedBytes: totalSize,
      percentOfLimit: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(2) + '%' // Assuming 5MB limit
    };
  }
}

// Create global instance
window.rivoStorage = new RivoStorage();

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RivoStorage;
}
