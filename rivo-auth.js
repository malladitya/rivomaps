// Rivo Authentication & Profile Integration
import { onAuthChange, getCurrentUser, signOutUser } from './firebase-auth.js';
import { 
    createUserProfile, 
    getUserProfile,
    saveFavoriteRoute,
    getFavoriteRoutes,
    removeFavoriteRoute,
    saveRecentSearch,
    getRecentSearches,
    saveAvoidedLocation,
    getAvoidedLocations,
    updateUserPreferences
} from './firebase-firestore.js';

let currentUser = null;
let userProfile = null;

// Initialize authentication
export function initAuth() {
    return new Promise((resolve) => {
        onAuthChange(async (user) => {
            if (user) {
                currentUser = user;
                await loadUserProfile(user.uid);
                showUserUI();
                resolve(user);
            } else {
                currentUser = null;
                userProfile = null;
                // Redirect to auth page
                window.location.href = 'auth-test.html';
            }
        });
    });
}

// Load user profile from Firestore
async function loadUserProfile(userId) {
    const result = await getUserProfile(userId);
    
    if (result.success) {
        userProfile = result.data;
    } else {
        // Create new profile if doesn't exist
        await createUserProfile(userId, {
            email: currentUser.email,
            displayName: currentUser.displayName,
            favoriteRoutes: [],
            recentSearches: [],
            avoidedLocations: [],
            preferences: {
                avoidTolls: false,
                avoidHighways: false,
                darkMode: false
            }
        });
        
        const newProfile = await getUserProfile(userId);
        if (newProfile.success) {
            userProfile = newProfile.data;
        }
    }
    
    return userProfile;
}

// Show user UI elements
function showUserUI() {
    const userAvatar = document.getElementById('userAvatar');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    
    if (userAvatar && currentUser) {
        const initial = currentUser.displayName 
            ? currentUser.displayName.charAt(0).toUpperCase() 
            : currentUser.email.charAt(0).toUpperCase();
        
        userAvatar.textContent = initial;
        userAvatar.style.display = 'flex';
    }
    
    if (userName && currentUser) {
        userName.textContent = currentUser.displayName || 'User';
    }
    
    if (userEmail && currentUser) {
        userEmail.textContent = currentUser.email;
    }
}

// Get current user
export function getUser() {
    return currentUser;
}

// Get user profile
export function getProfile() {
    return userProfile;
}

// Save current route as favorite
export async function saveCurrentRoute(routeData) {
    if (!currentUser) {
        alert('Please sign in to save routes');
        return { success: false };
    }
    
    const result = await saveFavoriteRoute(currentUser.uid, routeData);
    
    if (result.success) {
        // Reload profile to get updated data
        await loadUserProfile(currentUser.uid);
        return result;
    }
    
    return result;
}

// Load favorite routes
export async function loadFavoriteRoutes() {
    if (!currentUser) return { success: false, routes: [] };
    
    return await getFavoriteRoutes(currentUser.uid);
}

// Delete favorite route
export async function deleteFavoriteRoute(routeId) {
    if (!currentUser) return { success: false };
    
    const result = await removeFavoriteRoute(currentUser.uid, routeId);
    
    if (result.success) {
        await loadUserProfile(currentUser.uid);
    }
    
    return result;
}

// Save search to history
export async function saveSearch(origin, destination) {
    if (!currentUser) return;
    
    await saveRecentSearch(currentUser.uid, { origin, destination });
    await loadUserProfile(currentUser.uid);
}

// Load search history
export async function loadSearchHistory() {
    if (!currentUser) return { success: false, searches: [] };
    
    return await getRecentSearches(currentUser.uid);
}

// Save avoided location
export async function addAvoidedLocation(locationData) {
    if (!currentUser) {
        alert('Please sign in to save avoided locations');
        return { success: false };
    }
    
    const result = await saveAvoidedLocation(currentUser.uid, locationData);
    
    if (result.success) {
        await loadUserProfile(currentUser.uid);
    }
    
    return result;
}

// Get avoided locations
export async function loadAvoidedLocations() {
    if (!currentUser) return { success: false, locations: [] };
    
    return await getAvoidedLocations(currentUser.uid);
}

// Update preferences
export async function savePreferences(preferences) {
    if (!currentUser) return { success: false };
    
    const result = await updateUserPreferences(currentUser.uid, preferences);
    
    if (result.success) {
        await loadUserProfile(currentUser.uid);
    }
    
    return result;
}

// Sign out
export async function handleSignOut() {
    const result = await signOutUser();
    if (result.success) {
        window.location.href = 'auth-test.html';
    }
}
