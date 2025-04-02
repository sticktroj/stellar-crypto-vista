
// Send page functionality

// Initialize the send page
function initSendPage() {
  console.log('Initializing send page...');
  
  // Get parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const assetSymbol = urlParams.get('symbol') || 'BTC';
  
  // Set the initial selected asset
  const selectAsset = document.getElementById('asset-select');
  if (selectAsset) {
    selectAsset.value = assetSymbol;
    updateAssetDetails(assetSymbol);
  }
  
  // Set up event listeners
  setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
  // Asset selection change
  const selectAsset = document.getElementById('asset-select');
  if (selectAsset) {
    selectAsset.addEventListener('change', (e) => {
      updateAssetDetails(e.target.value);
    });
  }
  
  // Max amount button
  const maxButton = document.getElementById('max-amount');
  if (maxButton) {
    maxButton.addEventListener('click', setMaxAmount);
  }
  
  // Send form submission
  const sendForm = document.getElementById('send-form');
  if (sendForm) {
    sendForm.addEventListener('submit', handleSendSubmit);
  }
}

// Update asset details when selection changes
function updateAssetDetails(symbol) {
  // Find the asset in the global assets array
  const asset = cryptoAssets.find(a => a.symbol === symbol);
  if (!asset) return;
  
  // Update available balance
  const balanceElement = document.getElementById('available-balance');
  if (balanceElement) {
    balanceElement.textContent = `Available: ${formatNumber(asset.balance)} ${asset.symbol}`;
  }
  
  // Update send button text
  const sendButton = document.querySelector('.send-button');
  if (sendButton) {
    sendButton.textContent = `Send ${asset.symbol}`;
  }
  
  // Clear amount field to avoid confusion
  const amountInput = document.getElementById('amount');
  if (amountInput) {
    amountInput.value = '';
    
    // Also clear the USD equivalent
    const amountUsdElement = document.getElementById('amount-usd');
    if (amountUsdElement) {
      amountUsdElement.textContent = '';
    }
  }
}

// Set maximum available amount
function setMaxAmount() {
  const selectAsset = document.getElementById('asset-select');
  const amountInput = document.getElementById('amount');
  
  if (!selectAsset || !amountInput) return;
  
  const symbol = selectAsset.value;
  const asset = cryptoAssets.find(a => a.symbol === symbol);
  
  if (asset) {
    amountInput.value = asset.balance;
    updateUsdValue(asset.balance, asset.price);
  }
}

// Update USD equivalent value
function updateUsdValue(amount, price) {
  const amountUsdElement = document.getElementById('amount-usd');
  if (!amountUsdElement) return;
  
  if (amount && !isNaN(amount) && price) {
    const usdValue = amount * price;
    amountUsdElement.textContent = `≈ ${formatCurrency(usdValue)}`;
  } else {
    amountUsdElement.textContent = '';
  }
}

// Handle form submission
function handleSendSubmit(e) {
  e.preventDefault();
  
  const selectAsset = document.getElementById('asset-select');
  const amountInput = document.getElementById('amount');
  const addressInput = document.getElementById('address');
  
  if (!selectAsset || !amountInput || !addressInput) return;
  
  const symbol = selectAsset.value;
  const amount = parseFloat(amountInput.value);
  const address = addressInput.value.trim();
  
  // Validate inputs
  if (!symbol) {
    showToast('Please select an asset', 'error');
    return;
  }
  
  if (!amount || isNaN(amount) || amount <= 0) {
    showToast('Please enter a valid amount', 'error');
    return;
  }
  
  if (!address) {
    showToast('Please enter a recipient address', 'error');
    return;
  }
  
  // Find the asset
  const asset = cryptoAssets.find(a => a.symbol === symbol);
  
  if (!asset) {
    showToast('Asset not found', 'error');
    return;
  }
  
  // Check if user has enough balance
  if (amount > asset.balance) {
    showToast('Insufficient balance', 'error');
    return;
  }
  
  // Simulate transaction processing
  const sendButton = document.querySelector('.send-button');
  if (sendButton) {
    sendButton.disabled = true;
    sendButton.textContent = 'Processing...';
  }
  
  // Simulate network delay
  setTimeout(() => {
    showToast(`Successfully sent ${amount} ${symbol}`, 'success');
    
    // Reset form
    if (amountInput) amountInput.value = '';
    if (addressInput) addressInput.value = '';
    
    // Update button state
    if (sendButton) {
      sendButton.disabled = false;
      sendButton.textContent = `Send ${symbol}`;
    }
    
    // Redirect to wallet after short delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }, 1500);
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initSendPage);

// Add event listener for amount input to update USD value
document.addEventListener('DOMContentLoaded', function() {
  const amountInput = document.getElementById('amount');
  const selectAsset = document.getElementById('asset-select');
  
  if (amountInput && selectAsset) {
    amountInput.addEventListener('input', function() {
      const symbol = selectAsset.value;
      const amount = parseFloat(this.value);
      const asset = cryptoAssets.find(a => a.symbol === symbol);
      
      if (asset) {
        updateUsdValue(amount, asset.price);
      }
    });
  }
});
