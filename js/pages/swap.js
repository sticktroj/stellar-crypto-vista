
// Swap page functionality

let swapRate = 0;

// Load swap page content
function loadSwapPage(container) {
  container.innerHTML = `
    <div class="container mx-auto max-w-md">
      <div class="mb-6 flex items-center">
        <a href="#dashboard" class="mr-2" id="back-to-dashboard">
          <i class="fas fa-chevron-left"></i>
        </a>
        <h1 class="text-2xl font-bold dark:text-white">Swap Crypto</h1>
      </div>
      
      <div class="space-y-6">
        <!-- From Asset -->
        <div class="crypto-card p-4">
          <div class="flex justify-between mb-2">
            <span class="text-sm text-muted-foreground">From</span>
            <span class="text-sm text-muted-foreground from-balance"></span>
          </div>
          
          <div class="flex gap-3 mb-2">
            <select id="from-asset" class="w-1/3 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white">
              ${generateAssetOptions()}
            </select>
            
            <div class="flex-1 flex gap-2">
              <input
                id="from-amount"
                type="number"
                placeholder="0.00"
                step="any"
                class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <button type="button" id="max-amount" class="btn-outline">
                Max
              </button>
            </div>
          </div>
          
          <p class="text-sm text-muted-foreground from-fiat-value"></p>
        </div>
        
        <!-- Swap Button -->
        <div class="flex justify-center">
          <button 
            id="swap-assets"
            class="rounded-full p-2 bg-gray-200 dark:bg-gray-700" 
          >
            <i class="fas fa-arrow-right-arrow-left text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>
        
        <!-- To Asset -->
        <div class="crypto-card p-4">
          <div class="mb-2">
            <span class="text-sm text-muted-foreground">To</span>
          </div>
          
          <div class="flex gap-3 mb-2">
            <select id="to-asset" class="w-1/3 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white">
              ${generateToAssetOptions(selectedAsset ? selectedAsset.symbol : '')}
            </select>
            
            <input
              id="to-amount"
              type="number"
              placeholder="0.00"
              step="any"
              class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <p class="text-sm text-muted-foreground to-fiat-value"></p>
        </div>
        
        <div id="swap-rate" class="text-center text-sm text-muted-foreground">
          <!-- Swap rate will be displayed here -->
        </div>
        
        <button 
          id="swap-button"
          class="btn-primary w-full flex items-center justify-center" 
          disabled
        >
          <i class="fas fa-right-left mr-2"></i>
          Swap Now
        </button>
      </div>
    </div>
  `;
  
  // Add event listeners
  const backButton = document.getElementById('back-to-dashboard');
  if (backButton) {
    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('dashboard');
    });
  }
  
  const fromAssetSelect = document.getElementById('from-asset');
  if (fromAssetSelect) {
    fromAssetSelect.addEventListener('change', () => {
      updateToAssetOptions();
      calculateSwapRate();
      updateSwapForm();
    });
    
    // Set initial value to selected asset if available
    if (selectedAsset) {
      fromAssetSelect.value = selectedAsset.symbol;
    }
  }
  
  const toAssetSelect = document.getElementById('to-asset');
  if (toAssetSelect) {
    toAssetSelect.addEventListener('change', () => {
      calculateSwapRate();
      updateSwapForm();
    });
  }
  
  const fromAmountInput = document.getElementById('from-amount');
  if (fromAmountInput) {
    fromAmountInput.addEventListener('input', () => {
      updateToAmount();
      updateSwapForm();
    });
  }
  
  const toAmountInput = document.getElementById('to-amount');
  if (toAmountInput) {
    toAmountInput.addEventListener('input', () => {
      updateFromAmount();
      updateSwapForm();
    });
  }
  
  const maxButton = document.getElementById('max-amount');
  if (maxButton) {
    maxButton.addEventListener('click', handleMaxSwapAmount);
  }
  
  const swapAssetsButton = document.getElementById('swap-assets');
  if (swapAssetsButton) {
    swapAssetsButton.addEventListener('click', handleSwapAssets);
  }
  
  const swapButton = document.getElementById('swap-button');
  if (swapButton) {
    swapButton.addEventListener('click', handleSwap);
  }
  
  // Initialize form
  updateToAssetOptions();
  calculateSwapRate();
  updateSwapForm();
}

// Generate options for "to" asset select (excluding the "from" asset)
function generateToAssetOptions(excludeSymbol) {
  if (isLoading) {
    return '<option>Loading...</option>';
  }
  
  if (!cryptoAssets.length) {
    return '<option>No assets available</option>';
  }
  
  return cryptoAssets
    .filter(asset => asset.symbol !== excludeSymbol)
    .map(asset => {
      return `<option value="${asset.symbol}">${asset.symbol}</option>`;
    }).join('');
}

// Update "to" asset options when "from" asset changes
function updateToAssetOptions() {
  const fromAssetSelect = document.getElementById('from-asset');
  const toAssetSelect = document.getElementById('to-asset');
  
  if (!fromAssetSelect || !toAssetSelect) return;
  
  const fromSymbol = fromAssetSelect.value;
  const currentToSymbol = toAssetSelect.value;
  
  // Save current selection
  const currentSelection = toAssetSelect.value;
  
  // Update options
  toAssetSelect.innerHTML = generateToAssetOptions(fromSymbol);
  
  // Try to restore previous selection if it's still valid
  if (currentSelection && currentSelection !== fromSymbol) {
    const option = toAssetSelect.querySelector(`option[value="${currentSelection}"]`);
    if (option) {
      toAssetSelect.value = currentSelection;
    }
  }
  
  // If the from and to assets are the same, select a different "to" asset
  if (fromSymbol === toAssetSelect.value) {
    // Select the first option that's not the from asset
    const firstOption = toAssetSelect.querySelector('option');
    if (firstOption) {
      toAssetSelect.value = firstOption.value;
    }
  }
}

// Calculate swap rate between selected assets
function calculateSwapRate() {
  const fromAssetSelect = document.getElementById('from-asset');
  const toAssetSelect = document.getElementById('to-asset');
  const swapRateElement = document.getElementById('swap-rate');
  
  if (!fromAssetSelect || !toAssetSelect || !swapRateElement) return;
  
  const fromSymbol = fromAssetSelect.value;
  const toSymbol = toAssetSelect.value;
  
  const fromAsset = cryptoAssets.find(a => a.symbol === fromSymbol);
  const toAsset = cryptoAssets.find(a => a.symbol === toSymbol);
  
  if (fromAsset && toAsset) {
    // Calculate rate
    swapRate = toAsset.price / fromAsset.price;
    
    // Display rate
    swapRateElement.textContent = `Rate: 1 ${fromSymbol} = ${formatNumber(swapRate)} ${toSymbol}`;
  }
}

// Update "to" amount based on "from" amount
function updateToAmount() {
  const fromAmountInput = document.getElementById('from-amount');
  const toAmountInput = document.getElementById('to-amount');
  
  if (!fromAmountInput || !toAmountInput) return;
  
  const fromAmount = parseFloat(fromAmountInput.value);
  
  if (!isNaN(fromAmount) && swapRate) {
    toAmountInput.value = (fromAmount * swapRate).toFixed(8);
  } else {
    toAmountInput.value = '';
  }
}

// Update "from" amount based on "to" amount
function updateFromAmount() {
  const fromAmountInput = document.getElementById('from-amount');
  const toAmountInput = document.getElementById('to-amount');
  
  if (!fromAmountInput || !toAmountInput) return;
  
  const toAmount = parseFloat(toAmountInput.value);
  
  if (!isNaN(toAmount) && swapRate) {
    fromAmountInput.value = (toAmount / swapRate).toFixed(8);
  } else {
    fromAmountInput.value = '';
  }
}

// Update swap form based on inputs
function updateSwapForm() {
  const fromAssetSelect = document.getElementById('from-asset');
  const toAssetSelect = document.getElementById('to-asset');
  const fromAmountInput = document.getElementById('from-amount');
  const toAmountInput = document.getElementById('to-amount');
  const fromBalanceElement = document.querySelector('.from-balance');
  const fromFiatValueElement = document.querySelector('.from-fiat-value');
  const toFiatValueElement = document.querySelector('.to-fiat-value');
  const swapButton = document.getElementById('swap-button');
  
  if (!fromAssetSelect || !toAssetSelect || !fromAmountInput || !toAmountInput || !swapButton) return;
  
  const fromSymbol = fromAssetSelect.value;
  const toSymbol = toAssetSelect.value;
  
  const fromAsset = cryptoAssets.find(a => a.symbol === fromSymbol);
  const toAsset = cryptoAssets.find(a => a.symbol === toSymbol);
  
  if (fromAsset && toAsset) {
    // Update balance display
    if (fromBalanceElement) {
      fromBalanceElement.textContent = `Available: ${formatNumber(fromAsset.balance)} ${fromAsset.symbol}`;
    }
    
    // Update fiat values
    const fromAmount = parseFloat(fromAmountInput.value);
    const toAmount = parseFloat(toAmountInput.value);
    
    if (fromFiatValueElement && !isNaN(fromAmount)) {
      fromFiatValueElement.textContent = `≈ ${formatCurrency(fromAmount * fromAsset.price)}`;
    } else if (fromFiatValueElement) {
      fromFiatValueElement.textContent = '';
    }
    
    if (toFiatValueElement && !isNaN(toAmount)) {
      toFiatValueElement.textContent = `≈ ${formatCurrency(toAmount * toAsset.price)}`;
    } else if (toFiatValueElement) {
      toFiatValueElement.textContent = '';
    }
    
    // Enable/disable swap button
    const hasFromAmount = fromAmountInput.value && !isNaN(parseFloat(fromAmountInput.value)) && parseFloat(fromAmountInput.value) > 0;
    const hasToAmount = toAmountInput.value && !isNaN(parseFloat(toAmountInput.value)) && parseFloat(toAmountInput.value) > 0;
    const validAmount = hasFromAmount && parseFloat(fromAmountInput.value) <= fromAsset.balance;
    
    swapButton.disabled = !hasFromAmount || !hasToAmount || !validAmount;
    
    // Add error styling for invalid amount
    if (hasFromAmount && !validAmount) {
      fromAmountInput.classList.add('border-red-500');
      if (fromFiatValueElement) {
        fromFiatValueElement.classList.add('text-negative');
        fromFiatValueElement.textContent = 'Insufficient balance';
      }
    } else {
      fromAmountInput.classList.remove('border-red-500');
      if (fromFiatValueElement) {
        fromFiatValueElement.classList.remove('text-negative');
      }
    }
  }
}

// Handle max amount button click
function handleMaxSwapAmount() {
  const fromAssetSelect = document.getElementById('from-asset');
  const fromAmountInput = document.getElementById('from-amount');
  
  if (!fromAssetSelect || !fromAmountInput) return;
  
  const fromSymbol = fromAssetSelect.value;
  const fromAsset = cryptoAssets.find(a => a.symbol === fromSymbol);
  
  if (fromAsset) {
    fromAmountInput.value = fromAsset.balance;
    updateToAmount();
    updateSwapForm();
  }
}

// Handle swap assets button click
function handleSwapAssets() {
  const fromAssetSelect = document.getElementById('from-asset');
  const toAssetSelect = document.getElementById('to-asset');
  
  if (!fromAssetSelect || !toAssetSelect) return;
  
  const fromSymbol = fromAssetSelect.value;
  const toSymbol = toAssetSelect.value;
  
  // Swap values
  fromAssetSelect.value = toSymbol;
  
  // Update "to" asset options (this will exclude the new "from" asset)
  updateToAssetOptions();
  
  // Set "to" asset to previous "from" asset
  toAssetSelect.value = fromSymbol;
  
  // Update form
  calculateSwapRate();
  updateToAmount();
  updateSwapForm();
}

// Handle swap button click
function handleSwap() {
  const fromAssetSelect = document.getElementById('from-asset');
  const toAssetSelect = document.getElementById('to-asset');
  const fromAmountInput = document.getElementById('from-amount');
  const toAmountInput = document.getElementById('to-amount');
  
  if (!fromAssetSelect || !toAssetSelect || !fromAmountInput || !toAmountInput) return;
  
  const fromSymbol = fromAssetSelect.value;
  const toSymbol = toAssetSelect.value;
  const fromAmount = parseFloat(fromAmountInput.value);
  const toAmount = parseFloat(toAmountInput.value);
  
  // Simulate swap
  showToast(`Swapped ${fromAmount} ${fromSymbol} to ${toAmount} ${toSymbol}`, 'success');
  
  // Reset form
  fromAmountInput.value = '';
  toAmountInput.value = '';
  updateSwapForm();
}

// Update UI for swap page
function currentPageUpdateUI() {
  if (currentPage !== 'swap') return;
  
  // Update asset options
  const fromAssetSelect = document.getElementById('from-asset');
  if (fromAssetSelect) {
    const currentValue = fromAssetSelect.value;
    fromAssetSelect.innerHTML = generateAssetOptions();
    
    // Restore selected value if possible
    if (currentValue) {
      fromAssetSelect.value = currentValue;
    } else if (selectedAsset) {
      fromAssetSelect.value = selectedAsset.symbol;
    }
  }
  
  // Update "to" asset options
  updateToAssetOptions();
  
  // Update swap rate and form
  calculateSwapRate();
  updateSwapForm();
}
