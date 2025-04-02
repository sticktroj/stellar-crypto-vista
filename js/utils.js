
// Common utility functions

// Format number with commas
function formatNumber(number, decimals = 2) {
  return number.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// Format currency
function formatCurrency(number, currency = 'USD', decimals = 2) {
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// Format percentage
function formatPercentage(number, decimals = 2) {
  return number.toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// Truncate text with ellipsis
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Copy text to clipboard
function copyToClipboard(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
}

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `py-2 px-4 rounded-md shadow-md transform transition-all duration-300 translate-x-full opacity-0 `;
  
  // Add type-specific styling
  switch (type) {
    case 'success':
      toast.classList.add('bg-green-500', 'text-white');
      break;
    case 'error':
      toast.classList.add('bg-red-500', 'text-white');
      break;
    case 'warning':
      toast.classList.add('bg-yellow-500', 'text-white');
      break;
    default:
      toast.classList.add('bg-blue-500', 'text-white');
  }
  
  toast.innerText = message;
  toastContainer.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.replace('translate-x-full', 'translate-x-0');
    toast.classList.replace('opacity-0', 'opacity-100');
  }, 10);
  
  // Animate out and remove after duration
  setTimeout(() => {
    toast.classList.replace('translate-x-0', 'translate-x-full');
    toast.classList.replace('opacity-100', 'opacity-0');
    
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, duration);
}

// Generate a random hash-like string
function generateRandomHash(length = 40) {
  const characters = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Create a QR code placeholder (in a real app, this would generate an actual QR code)
function createQRCodePlaceholder(containerId, text) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="border-4 border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center">
      <div class="text-center">
        <div class="grid grid-cols-10 gap-1 w-48 h-48 mx-auto">
          ${Array(100).fill().map(() => 
            `<div class="bg-gray-800 dark:bg-gray-200 rounded-sm w-full h-full ${Math.random() > 0.7 ? 'opacity-100' : 'opacity-0'}"></div>`
          ).join('')}
        </div>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">QR Code for ${truncateText(text, 20)}</p>
      </div>
    </div>
  `;
}

// Add page-specific JavaScript files
function loadPageScripts() {
  const page = currentPage || 'dashboard';
  const scriptSrc = `js/pages/${page}.js`;
  
  // Check if script is already loaded
  const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = scriptSrc;
    document.body.appendChild(script);
  }
}
