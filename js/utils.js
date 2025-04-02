
// Utility functions for the app

// Format a number to a readable string with specified decimal places
function formatNumber(value, decimals = 6) {
  // For very small numbers, show more decimals
  if (Math.abs(value) < 0.001 && value !== 0) {
    return value.toFixed(8);
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Format a number as currency (USD)
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format a number as percentage
function formatPercentage(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  }).format(value / 100);
}

// Create a short address for display
function shortenAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Create HTML for a crypto icon
function createCryptoIcon(symbol) {
  const iconClass = CONFIG.cryptoIcons[symbol] || 'fa-solid fa-coins';
  return `<div class="crypto-icon crypto-icon-${symbol.toLowerCase()}">
    <i class="${iconClass}"></i>
  </div>`;
}

// Create a skeleton loading placeholder
function createSkeleton(width, height, classes = '') {
  return `<div class="skeleton ${classes}" style="width: ${width}; height: ${height};"></div>`;
}

// Safely parse JSON with error handling
function safeParseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return null;
  }
}

// Handle API errors
function handleApiError(error) {
  console.error('API Error:', error);
  showToast('Error fetching data. Please try again later.', 'error');
}

// Show a toast notification
function showToast(message, type = 'info') {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-4 right-4 z-50';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `p-3 rounded-md mb-2 flex items-center shadow-lg ${
    type === 'error' 
      ? 'bg-red-500 text-white' 
      : type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-blue-500 text-white'
  }`;
  
  // Add icon based on type
  let icon = 'fa-info-circle';
  if (type === 'error') icon = 'fa-triangle-exclamation';
  if (type === 'success') icon = 'fa-check-circle';
  
  toast.innerHTML = `
    <i class="fas ${icon} mr-2"></i>
    <span>${message}</span>
  `;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
}
