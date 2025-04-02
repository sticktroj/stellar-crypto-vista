
// Utility functions

// Format currency
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CONFIG.defaultFiat || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Generate a mock address for a cryptocurrency
function getMockAddress(symbol) {
  const addressPrefixes = {
    BTC: '1',
    ETH: '0x',
    BNB: 'bnb',
    SOL: 'sol',
    XRP: 'r',
    ADA: 'addr',
    DOGE: 'D',
    USDT: '0x',
    TRX: 'T',
    TON: 'EQ'
  };
  
  const prefix = addressPrefixes[symbol] || '';
  const randomChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let address = prefix;
  
  // Generate random characters
  const length = symbol === 'ETH' || symbol === 'USDT' ? 40 : 26;
  for (let i = 0; i < length; i++) {
    address += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  
  return address;
}

// Copy to clipboard
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

// Truncate text with ellipsis
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Create a simple QR code placeholder (for demo purposes)
function createQRCodePlaceholder(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Clear container
  container.innerHTML = '';
  
  // Create a placeholder QR code
  const qrCode = document.createElement('div');
  qrCode.className = 'qr-code';
  qrCode.style.width = '200px';
  qrCode.style.height = '200px';
  qrCode.style.backgroundColor = '#FFFFFF';
  qrCode.style.display = 'flex';
  qrCode.style.alignItems = 'center';
  qrCode.style.justifyContent = 'center';
  qrCode.style.position = 'relative';
  
  // Add QR code pattern placeholder
  const pattern = document.createElement('div');
  pattern.style.width = '80%';
  pattern.style.height = '80%';
  pattern.style.backgroundImage = 'linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)';
  pattern.style.backgroundSize = '10px 10px';
  
  // Add corner squares
  const corners = ['top-left', 'top-right', 'bottom-left'];
  corners.forEach(position => {
    const corner = document.createElement('div');
    corner.style.position = 'absolute';
    corner.style.width = '30px';
    corner.style.height = '30px';
    corner.style.backgroundColor = '#000';
    
    if (position === 'top-left') {
      corner.style.top = '20px';
      corner.style.left = '20px';
    } else if (position === 'top-right') {
      corner.style.top = '20px';
      corner.style.right = '20px';
    } else if (position === 'bottom-left') {
      corner.style.bottom = '20px';
      corner.style.left = '20px';
    }
    
    const innerCorner = document.createElement('div');
    innerCorner.style.position = 'absolute';
    innerCorner.style.top = '5px';
    innerCorner.style.left = '5px';
    innerCorner.style.width = '20px';
    innerCorner.style.height = '20px';
    innerCorner.style.backgroundColor = '#fff';
    
    corner.appendChild(innerCorner);
    qrCode.appendChild(corner);
  });
  
  qrCode.appendChild(pattern);
  container.appendChild(qrCode);
}

// Show toast notification
function showToast(message, type = 'info') {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Create icon based on type
  let icon = '';
  if (type === 'success') {
    icon = '<i class="fas fa-check-circle mr-2"></i>';
  } else if (type === 'error') {
    icon = '<i class="fas fa-exclamation-circle mr-2"></i>';
  } else if (type === 'info') {
    icon = '<i class="fas fa-info-circle mr-2"></i>';
  }
  
  // Set toast content
  toast.innerHTML = `${icon}<div>${message}</div>`;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Automatically remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in forwards';
    
    // Remove from DOM after animation
    setTimeout(() => {
      toastContainer.removeChild(toast);
      
      // Remove container if no more toasts
      if (toastContainer.children.length === 0) {
        document.body.removeChild(toastContainer);
      }
    }, 300);
  }, 3000);
}
