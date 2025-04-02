
// Main application script

// Initialize app when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  applyTheme(getInitialTheme());
  
  // Initialize wallet
  initWallet();
  
  // Initialize navigation
  initNavigation();
  
  // Show a welcome toast
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    setTimeout(() => {
      showToast('Welcome to your Crypto Wallet', 'info');
    }, 1000);
  }
  
  console.log("App initialized successfully!");
});

// Show toast notification
function showToast(message, type = 'info') {
  const toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) {
    console.error('Toast container not found');
    return;
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span>${message}</span>
    </div>
  `;
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out forwards';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out forwards';
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}
