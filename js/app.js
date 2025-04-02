
// Main application script

// Initialize app when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  applyTheme(getInitialTheme());
  
  // Initialize wallet
  initWallet();
  
  // Initialize navigation
  initNavigation();
});
