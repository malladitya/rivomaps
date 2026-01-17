// Firestore User Profile Manager
import { db } from './firebase-config.js';
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    arrayUnion,
    arrayRemove,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Create or update user profile
export async function createUserProfile(userId, userData) {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...userData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });
        
        return { success: true };
    } catch (error) {
        console.error('Error creating user profile:', error);
        return { success: false, error: error.message };
    }
}

// Get user profile
export async function getUserProfile(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            return { success: true, data: userSnap.data() };
        } else {
            return { success: false, error: 'User profile not found' };
        }
    } catch (error) {
        console.error('Error getting user profile:', error);
        return { success: false, error: error.message };
    }
}

// Update user preferences
export async function updateUserPreferences(userId, preferences) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            preferences,
            updatedAt: serverTimestamp()
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error updating preferences:', error);
        return { success: false, error: error.message };
    }
}

// Save favorite route
export async function saveFavoriteRoute(userId, route) {
    try {
        const userRef = doc(db, 'users', userId);
        const routeData = {
            id: Date.now().toString(),
            name: route.name || `Route ${new Date().toLocaleDateString()}`,
            origin: route.origin,
            destination: route.destination,
            waypoints: route.waypoints || [],
            distance: route.distance,
            duration: route.duration,
            savedAt: new Date().toISOString()
        };
        
        await updateDoc(userRef, {
            favoriteRoutes: arrayUnion(routeData),
            updatedAt: serverTimestamp()
        });
        
        return { success: true, route: routeData };
    } catch (error) {
        console.error('Error saving favorite route:', error);
        return { success: false, error: error.message };
    }
}

// Remove favorite route
export async function removeFavoriteRoute(userId, routeId) {
    try {
        const userRef = doc(db, 'users', userId);
        const profile = await getUserProfile(userId);
        
        if (profile.success && profile.data.favoriteRoutes) {
            const routeToRemove = profile.data.favoriteRoutes.find(r => r.id === routeId);
            if (routeToRemove) {
                await updateDoc(userRef, {
                    favoriteRoutes: arrayRemove(routeToRemove),
                    updatedAt: serverTimestamp()
                });
                return { success: true };
            }
        }
        
        return { success: false, error: 'Route not found' };
    } catch (error) {
        console.error('Error removing favorite route:', error);
        return { success: false, error: error.message };
    }
}

// Get favorite routes
export async function getFavoriteRoutes(userId) {
    try {
        const profile = await getUserProfile(userId);
        
        if (profile.success) {
            return { 
                success: true, 
                routes: profile.data.favoriteRoutes || [] 
            };
        }
        
        return { success: false, routes: [] };
    } catch (error) {
        console.error('Error getting favorite routes:', error);
        return { success: false, routes: [], error: error.message };
    }
}

// Save recent search
export async function saveRecentSearch(userId, search) {
    try {
        const userRef = doc(db, 'users', userId);
        const searchData = {
            id: Date.now().toString(),
            origin: search.origin,
            destination: search.destination,
            timestamp: new Date().toISOString()
        };
        
        // Keep only last 10 searches
        const profile = await getUserProfile(userId);
        let recentSearches = profile.data?.recentSearches || [];
        recentSearches.unshift(searchData);
        recentSearches = recentSearches.slice(0, 10);
        
        await updateDoc(userRef, {
            recentSearches,
            updatedAt: serverTimestamp()
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error saving recent search:', error);
        return { success: false, error: error.message };
    }
}

// Get recent searches
export async function getRecentSearches(userId) {
    try {
        const profile = await getUserProfile(userId);
        
        if (profile.success) {
            return { 
                success: true, 
                searches: profile.data.recentSearches || [] 
            };
        }
        
        return { success: false, searches: [] };
    } catch (error) {
        console.error('Error getting recent searches:', error);
        return { success: false, searches: [], error: error.message };
    }
}

// Save avoided location
export async function saveAvoidedLocation(userId, location) {
    try {
        const userRef = doc(db, 'users', userId);
        const locationData = {
            id: Date.now().toString(),
            name: location.name,
            address: location.address,
            coordinates: location.coordinates,
            reason: location.reason || 'User preference',
            savedAt: new Date().toISOString()
        };
        
        await updateDoc(userRef, {
            avoidedLocations: arrayUnion(locationData),
            updatedAt: serverTimestamp()
        });
        
        return { success: true, location: locationData };
    } catch (error) {
        console.error('Error saving avoided location:', error);
        return { success: false, error: error.message };
    }
}

// Get avoided locations
export async function getAvoidedLocations(userId) {
    try {
        const profile = await getUserProfile(userId);
        
        if (profile.success) {
            return { 
                success: true, 
                locations: profile.data.avoidedLocations || [] 
            };
        }
        
        return { success: false, locations: [] };
    } catch (error) {
        console.error('Error getting avoided locations:', error);
        return { success: false, locations: [], error: error.message };
    }
}
