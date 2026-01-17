console.log("🚀 Initializing Glowera AI Firebase Authentication...");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtjqkCgYSGxiZFULDLIC5QZXFb7kJgzJw",
  authDomain: "imageai-9b8b8.firebaseapp.com",
  projectId: "imageai-9b8b8",
  storageBucket: "imageai-9b8b8.firebasestorage.app",
  messagingSenderId: "302539017696",
  appId: "1:302539017696:web:c25e5a22b8b87ad36aef85",
  measurementId: "G-M6ECXN7LDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

// Update site title for Glowera AI
document.title = "Glowera AI - Next-Gen Image Generation";

// Safe DOM element getter
function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.log(`ℹ️ Element not found (may be on different page): ${id}`);
  }
  return element;
}

// Get DOM elements safely
const profileIcon = getElement('profileIcon');
const dropdownMenu = getElement('dropdownMenu');
const menuSignAction = getElement('menuSignAction');
const topSignLink = getElement('topSignLink');
const menuSubmitLink = getElement('menuSubmitLink');

// ==========================================
// Authentication Functions
// ==========================================

async function signIn() {
  console.log('🔑 Starting Google Sign-In...');
  
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('✅ User signed in:', result.user.email);
    
    // Close any open dropdown
    if (dropdownMenu) {
      dropdownMenu.classList.remove('show');
    }
    
    // Show welcome message
    showNotification(`Welcome to Glowera AI, ${result.user.displayName || 'User'}!`);
    
    return result.user;
  } catch (error) {
    console.error('❌ Sign-in error:', error);
    
    // User-friendly error messages
    if (error.code === 'auth/popup-closed-by-user') {
      showNotification('Sign-in was cancelled. Please try again.', 'warning');
    } else if (error.code === 'auth/popup-blocked') {
      showNotification('Popup was blocked. Please allow popups for this site.', 'warning');
    } else {
      showNotification('Failed to sign in. Please try again.', 'error');
    }
    throw error;
  }
}

async function signOutUser() {
  try {
    await signOut(auth);
    console.log('👋 User signed out');
    showNotification('Signed out successfully.');
  } catch (error) {
    console.error('❌ Sign-out error:', error);
    showNotification('Failed to sign out. Please try again.', 'error');
  }
}

function showNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      ${message}
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#fee' : type === 'warning' ? '#ffeb3b' : '#e8f5e9'};
    color: ${type === 'error' ? '#c62828' : type === 'warning' ? '#333' : '#2e7d32'};
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
    font-weight: 500;
    border-left: 4px solid ${type === 'error' ? '#c62828' : type === 'warning' ? '#ff9800' : '#4caf50'};
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Add CSS animations for notifications
if (!document.querySelector('#notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

function updateUI(user) {
  console.log('🔄 Updating UI for user:', user ? user.email : 'No user');
  
  // Update profile icon
  if (profileIcon) {
    if (user) {
      const displayName = user.displayName || user.email.split('@')[0];
      const initial = displayName.charAt(0).toUpperCase();
      
      profileIcon.textContent = initial;
      profileIcon.style.background = 'linear-gradient(135deg, #C792FF 0%, #FF6B9D 100%)';
      profileIcon.title = `Logged in as ${displayName}`;
      
      if (menuSignAction) {
        menuSignAction.textContent = 'Sign Out';
        menuSignAction.onclick = (e) => {
          e.preventDefault();
          signOutUser();
        };
      }
      
      if (topSignLink) {
        topSignLink.textContent = 'Sign Out';
        topSignLink.onclick = (e) => {
          e.preventDefault();
          signOutUser();
        };
      }
      
    } else {
      profileIcon.textContent = '👤';
      profileIcon.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      profileIcon.title = 'Account';
      
      if (menuSignAction) {
        menuSignAction.textContent = 'Sign In';
        menuSignAction.onclick = (e) => {
          e.preventDefault();
          signIn();
        };
      }
      
      if (topSignLink) {
        topSignLink.textContent = 'Sign In';
        topSignLink.onclick = (e) => {
          e.preventDefault();
          signIn();
        };
      }
    }
  }
}

function requireAuth(e) {
  if (!auth.currentUser) {
    e.preventDefault();
    e.stopPropagation();
    
    showNotification('Please sign in to access this feature.', 'warning');
    
    // Try to sign in
    setTimeout(() => {
      signIn().then(user => {
        if (user) {
          // After successful sign-in, retry the action
          const originalClick = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          e.target.dispatchEvent(originalClick);
        }
      });
    }, 1500);
  }
}

// ==========================================
// Event Listeners (only if elements exist)
// ==========================================

// Profile dropdown toggle
if (profileIcon && dropdownMenu) {
  profileIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!profileIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove('show');
    }
  });

  dropdownMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Sign in/out from menu
if (menuSignAction) {
  menuSignAction.addEventListener('click', (e) => {
    e.preventDefault();
    if (dropdownMenu) dropdownMenu.classList.remove('show');
    
    if (auth.currentUser) {
      signOutUser();
    } else {
      signIn();
    }
  });
}

// Sign in/out from top nav
if (topSignLink) {
  topSignLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (auth.currentUser) {
      signOutUser();
    } else {
      signIn();
    }
  });
}

// Protect navigation
if (menuSubmitLink) {
  menuSubmitLink.addEventListener('click', requireAuth);
}

// ==========================================
// Firebase Auth State Observer
// ==========================================

onAuthStateChanged(auth, (user) => {
  console.log('🔐 Auth state changed:', user ? `User: ${user.email}` : 'No user');
  
  // Store user globally for other scripts
  window.currentUser = user;
  window.firebaseAuthUser = user;
  window.gloweraUser = user;
  
  updateUI(user);
});

// ==========================================
// Export for other modules
// ==========================================

export { auth, signIn, signOutUser };

export function getCurrentUser() {
  return auth.currentUser;
}

// Make functions globally available for HTML onclick handlers
window.openSignIn = signIn;
window.toggleProfileMenu = () => {
  if (dropdownMenu) {
    dropdownMenu.classList.toggle('show');
  }
};
window.requireAuthGlowera = requireAuth;

console.log("✅ Glowera AI Authentication module loaded successfully!");
