
// Swap page functionality

// Initialize swap page
function initSwapPage() {
  console.log('Initializing swap page...');
  
  // Get parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const fromAsset = urlParams.get('from') || 'BTC';
  const toAsset = urlParams.get('to') || 'ETH';
  
  // Set the initial selected assets
  const fromAssetSelect = document.getElementById('from-asset');
  const toAssetSelect = document.getElementById('to-asset');
  
  if (fromAssetSelect && toAssetSelect) {
    fromAssetSelect.value = fromAsset;
    
    // Make sure toAsset is not the same as fromAsset
    if (toAsset === fromAsset) {
      // Find first different asset
      const differentAsset = cryptoAssets.find(a => a.symbol !== fromAsset);
      toAssetSelect.value = differentAsset ? differentAsset.symbol : 'ETH';
    } else {
      toAssetSelect.value = toAsset;
    }
    
    // Update UI based on selections
    updateFromAssetDetails(fromAsset);
    updateSwapRate();
  }
  
  // Set up event listeners
  setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
  // Asset selection changes
  const fromAssetSelect = document.getElementById('from-asset');
  const toAssetSelect = document.getElementById('to-asset');
  
  if (fromAssetSelect) {
    fromAssetSelect.addEventListener('change', (e) => {
      const newFromAsset = e.target.value;
      updateFromAssetDetails(newFromAsset);
      
      // If to-asset is the same as new from-asset, change it
      if (toAssetSelect.value === newFromAsset) {
        // Find first different asset
        const differentAsset = cryptoAssets.find(a => a.symbol !== newFromAsset);
        toAssetSelect.value = differentAsset ? differentAsset.symbol : 'ETH';
      }
      
      updateSwapRate();
      updateToAmount();
    });
  }
  
  if (toAssetSelect) {
    toAssetSelect.addEventListener('change', () => {
      updateSwapRate();
      updateToAmount();
    });
  }
  
  // Max button
  const maxButton = document.getElementById('max-amount');
  if (maxButton) {
    maxButton.addEventListener('click', setMaxAmount);
  }
  
  // Swap direction button
  const swapDirectionButton = document.getElementById('swap-direction');
  if (swapDirectionButton) {
    swapDirectionButton.addEventListener('click', swapDirection);
  }
  
  // From amount input
  const fromAmountInput = document.getElementById('from-amount');
  if (fromAmountInput) {
    fromAmountInput.addEventListener('input', updateToAmount);
  }
  
  // Swap form submission
  const swapForm = document.getElementById('swap-form');
  if (swapForm) {
    swapForm.addEventListener('submit', handleSwapSubmit);
  }
}

// Update from asset details
function updateFromAssetDetails(symbol) {
  // Find the asset
  const asset = cryptoAssets.find(a => a.symbol === symbol);
  if (!asset) return;
  
  // Update available balance
  const balanceElement = document.getElementById('available-balance');
  if (balanceElement) {
    balanceElement.textContent = `Available: ${formatNumber(asset.balance)} ${asset.symbol}`;
  }
  
  // Clear amount field to avoid confusion
  const fromAmountInput = document.getElementById('from-amount');
  if (fromAmountInput) {
    fromAmountInput.value = '';
    
    // Also clear the USD equivalent
    const fromUsdElement = document.getElementById('from-usd');
    if (fromUsdElement) {
      fromUsdElement.textContent = '';
    }
    
    // And clear the to amount
    const toAmountInput = document.getElementById('to-amount');
    if (toAmountInput) {
      toAmountInput.value = '';
      
      // Also clear the to USD equivalent
      const toUsdElement = document.getElementById('to-usd');
      if (toUsdElement) {
        toUsdElement.textContent = '';
      }
    }
  }
}

// Update swap rate
function updateSwapRate() {
  const fromAssetSelect = document.getElementById('from-asset');
  const toAssetSelect = document.getElementById('to-asset');
  const swapRateElement = document.getElementById('swap-rate');
  
  if (!fromAssetSelect || !toAssetSelect || !swapRateElement) return;
  
  const fromSymbol = fromAssetSelect.value;
  const toSymbol = toAssetSelect.value;
  
  const fromAsset = cryptoAssets.find(a => a.symbol === fromSymbol);
  const toAsset = cryptoAssets.find(a => a.symbol === toSymbol);
  
  if (!fromAsset || !toAsset) return;
  
  // Calculate swap rate
  const rate = toAsset.price / fromAsset.price;
  
  // Update UI
  swapRateElement.textContent = `1 ${fromSymbol} = ${formatNumber(rate)} ${toSymbol}`;
}

// Set maximum available amount
function setMaxAmount() {
  const fromAssetSelect = document.getElementById('from-asset');
  const fromAmountInput = document.getElementById('from-amount');
  
  if (!fromAssetSelect || !fromAmountInput) return;
  
  const symbol = fromAssetSelect.value;
  const asset = cryptoAssets.find(a => a.symbol === symbol);
  
  if (asset) {
    fromAmountInput.value = asset.balance;
    updateFromUsdValue(asset.balance, asset.price);
    updateToAmount();
  }
}

// Swap direction of assets
function swapDirection() {
  const fromAssetSelect = document.getElementById('from-asset');
  const toAssetSelect = document.getElementById('to-asset');
  
  if (!fromAssetSelect || !toAssetSelect) return;
  
  // Swap values
  const temp = fromAssetSelect.value;
  fromAssetSelect.value = toAssetSelect.value;
  toAssetSelect.value = temp;
  
  // Update UI
  updateFromAssetDetails(fromAssetSelect.value);
  updateSwapRate();
  
  // Reset amount fields
  const fromAmountInput = document.getElementById('from-amount');
  const toAmountInput = document.getElementById('to-amount');
  
  if (fromAmountInput && toAmountInput) {
    fromAmountInput.value = '';
    toAmountInput.value = '';
  }
}

// Update to amount based on from amount
function updateToAmount() {
  const fromAssetSelect = document.getElementById('from-asset');
  const toAssetSelect = document.getElementById('to-asset');
  const fromAmountInput = document.getElementById('from-amount');
  const toAmountInput = document.getElementById('to-amount');
  
  if (!fromAssetSelect || !toAssetSelect || !fromAmountInput || !toAmountInput) return;
  
  const fromSymbol = fromAssetSelect.value;
  const toSymbol = toAssetSelect.value;
  const fromAmount = parseFloat(fromAmountInput.value);
  
  if (isNaN(fromAmount) || fromAmount <= 0) {
    toAmountInput.value = '';
    
    // Clear USD values
    updateFromUsdValue(0, 0);
    updateToUsdValue(0, 0);
    return;
  }
  
  const fromAsset = cryptoAssets.find(a => a.symbol === fromSymbol);
  const toAsset = cryptoAssets.find(a => a.symbol === toSymbol);
  
  if (!fromAsset || !toAsset) return;
  
  // Calculate swap amount
  const rate = toAsset.price / fromAsset.price;
  const toAmount = fromAmount * rate;
  
  // Update to amount input
  toAmountInput.value = toAmount.toFixed(8);
  
  // Update USD values
  updateFromUsdValue(fromAmount, fromAsset.price);
  updateToUsdValue(toAmount, toAsset.price);
}

// Update USD equivalent for from amount
function updateFromUsdValue(amount, price) {
  const fromUsdElement = document.getElementById('from-usd');
  if (!fromUsdElement) return;
  
  if (amount && !isNaN(amount) && price) {
    const usdValue = amount * price;
    fromUsdElement.textContent = `≈ ${formatCurrency(usdValue)}`;
  } else {
    fromUsdElement.textContent = '';
  }
}

// Update USD equivalent for to amount
function updateToUsdValue(amount, price) {
  const toUsdElement = document.getElementById('to-usd');
  if (!toUsdElement) return;
  
  if (amount && !isNaN(amount) && price) {
    const usdValue = amount * price;
    toUsdElement.textContent = `≈ ${formatCurrency(usdValue)}`;
  } else {
    toUsdElement.textContent = '';
  }
}

// Handle swap form submission
function handleSwapSubmit(e) {
  e.preventDefault();
  
  const fromAssetSelect = document.getElementById('from-asset');
  const toAssetSelect = document.getElementById('to-asset');
  const fromAmountInput = document.getElementById('from-amount');
  
  if (!fromAssetSelect || !toAssetSelect || !fromAmountInput) return;
  
  const fromSymbol = fromAssetSelect.value;
  const toSymbol = toAssetSelect.value;
  const fromAmount = parseFloat(fromAmountInput.value);
  
  // Validate inputs
  if (!fromSymbol || !toSymbol) {
    showToast('Please select assets', 'error');
    return;
  }
  
  if (!fromAmount || isNaN(fromAmount) || fromAmount <= 0) {
    showToast('Please enter a valid amount', 'error');
    return;
  }
  
  // Find the assets
  const fromAsset = cryptoAssets.find(a => a.symbol === fromSymbol);
  
  if (!fromAsset) {
    showToast('Asset not found', 'error');
    return;
  }
  
  // Check if user has enough balance
  if (fromAmount > fromAsset.balance) {
    showToast('Insufficient balance', 'error');
    return;
  }
  
  // Calculate receiving amount
  const toAsset = cryptoAssets.find(a => a.symbol === toSymbol);
  const toAmount = fromAmount * (toAsset.price / fromAsset.price);
  
  // Simulate transaction processing
  const swapButton = document.querySelector('.swap-button');
  if (swapButton) {
    swapButton.disabled = true;
    swapButton.textContent = 'Processing Swap...';
  }
  
  // Simulate network delay
  setTimeout(() => {
    showToast(`Successfully swapped ${fromAmount} ${fromSymbol} for ${toAmount.toFixed(8)} ${toSymbol}`, 'success');
    
    // Reset form
    if (fromAmountInput) fromAmountInput.value = '';
    
    // Update button state
    if (swapButton) {
      swapButton.disabled = false;
      swapButton.textContent = 'Swap Now';
    }
    
    // Redirect to wallet after short delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }, 1500);
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initSwapPage);
