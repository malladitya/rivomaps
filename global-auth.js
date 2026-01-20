// Global Authentication State Manager
// This script manages user authentication state across all pages

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpRStd3cJuavDoB87i_6OLS7krIl8Kkvc",
  authDomain: "rivo-maps-82621.firebaseapp.com",
  projectId: "rivo-maps-82621",
  storageBucket: "rivo-maps-82621.firebasestorage.app",
  messagingSenderId: "679917061688",
  appId: "1:679917061688:web:3adc8be2b3cfadea3f93f7",
  measurementId: "G-SYY6Y70MEL"
};

// Initialize Firebase and Auth (only if not already initialized)
let app, auth;
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
} else if (typeof window.firebase !== 'undefined') {
  auth = window.firebase.auth();
}

// Global auth state management
window.globalAuth = {
  currentUser: null,
  
  // Initialize auth state listener
  init() {
    if (!auth) {
      console.log('Firebase auth not available, checking localStorage');
      this.checkStoredUser();
      return;
    }
    
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      this.updateHeaderAvatar(user);
      
      // Store auth state in localStorage for persistence
      if (user) {
        localStorage.setItem('rivoUser', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
      } else {
        localStorage.removeItem('rivoUser');
      }
    });
  },
  
  // Check for stored user on page load
  checkStoredUser() {
    const storedUser = localStorage.getItem('rivoUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.updateHeaderAvatar(userData);
      } catch (e) {
        localStorage.removeItem('rivoUser');
      }
    }
  },
  
  // Update header avatar across all pages
  updateHeaderAvatar(user) {
    const headerLoginBtn = document.getElementById('header-login-btn');
    const headerAvatar = document.getElementById('header-avatar');
    
    if (headerLoginBtn && headerAvatar) {
      if (user) {
        const initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
        headerAvatar.textContent = initial;
        headerAvatar.title = user.displayName || user.email;
        headerAvatar.onclick = () => window.openAuthModal();
        
        headerLoginBtn.style.display = 'none';
        headerAvatar.style.display = 'flex';
      } else {
        headerLoginBtn.style.display = 'inline-flex';
        headerAvatar.style.display = 'none';
      }
    }
  },
  
  // Open auth modal (works across pages)
  openAuthModal() {
    // If on index.html, use the modal
    if (document.getElementById('authModal')) {
      if (typeof openAuthModal === 'function') {
        openAuthModal();
      }
    } else {
      // Redirect to index.html with auth parameter
      window.location.href = 'index.html?auth=true';
    }
  },
  
  // Sign out function
  async signOut() {
    if (auth && this.currentUser) {
      try {
        await auth.signOut();
        this.currentUser = null;
        localStorage.removeItem('rivoUser');
        this.updateHeaderAvatar(null);
        
        // Show success message if possible
        if (typeof showAlertModal === 'function') {
          showAlertModal('Successfully signed out!', 'success');
        } else {
          alert('Successfully signed out!');
        }
        
        // Redirect to home page
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } catch (error) {
        console.error('Sign out error:', error);
        if (typeof showAlertModal === 'function') {
          showAlertModal('Error signing out: ' + error.message, 'error');
        } else {
          alert('Error signing out: ' + error.message);
        }
      }
    } else {
      // No Firebase auth, just clear localStorage
      this.currentUser = null;
      localStorage.removeItem('rivoUser');
      this.updateHeaderAvatar(null);
      window.location.href = 'index.html';
    }
  },
  
  // Delete account function
  async deleteAccount() {
    if (!this.currentUser) {
      alert('No user is currently signed in.');
      return;
    }
    
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    try {
      await this.currentUser.delete();
      this.currentUser = null;
      localStorage.removeItem('rivoUser');
      this.updateHeaderAvatar(null);
      
      if (typeof showAlertModal === 'function') {
        showAlertModal('Account deleted successfully!', 'success');
      } else {
        alert('Account deleted successfully!');
      }
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } catch (error) {
      console.error('Delete account error:', error);
      let errorMessage = error.message;
      
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please sign in again to delete your account.';
      }
      
      if (typeof showAlertModal === 'function') {
        showAlertModal(errorMessage, 'error');
      } else {
        alert(errorMessage);
      }
    }
  }
};

// Global functions for onclick handlers
window.openAuthModal = function() {
  window.globalAuth.openAuthModal();
};

window.handleGlobalSignOut = function() {
  window.globalAuth.signOut();
};

window.handleGlobalDeleteAccount = function() {
  window.globalAuth.deleteAccount();
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for Firebase to load if it's loading
  setTimeout(() => {
    window.globalAuth.init();
  }, 100);
  
  // Check for auth parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('auth') === 'true' && document.getElementById('authModal')) {
    setTimeout(() => {
      if (typeof openAuthModal === 'function') {
        openAuthModal();
      }
    }, 500);
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.globalAuth;
}