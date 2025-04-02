
// Swap page specific functionality
function loadSwapPage(container) {
  console.log("Loading swap page...");
  
  if (!cryptoAssets.length) {
    fetchCryptoData().then(() => loadSwapPage(container));
    return;
  }
  
  container.innerHTML = `
    <div class="container mx-auto max-w-md">
      <h1 class="text-2xl font-bold mb-6">Swap Crypto</h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <form id="swap-form">
          <!-- From Asset -->
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 mb-2">From</label>
            <div class="relative">
              <select id="from-asset-select" class="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                ${cryptoAssets.map(asset => `
                  <option value="${asset.symbol}">
                    ${asset.name} (${asset.balance.toFixed(4)} ${asset.symbol})
                  </option>
                `).join('')}
              </select>
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
            
            <div class="mt-2 relative">
              <input type="number" id="from-amount" class="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="0.00" step="0.0001" min="0">
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button type="button" id="from-max-btn" class="text-primary text-sm font-medium">MAX</button>
              </div>
            </div>
            
            <div class="mt-1 flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400" id="from-amount-in-usd">$0.00</span>
              <span class="text-gray-500 dark:text-gray-400">
                Balance: <span id="from-current-balance">0.00</span>
              </span>
            </div>
          </div>
          
          <!-- Swap Direction Button -->
          <div class="flex justify-center my-4">
            <button type="button" id="swap-direction-btn" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <i class="fas fa-arrow-down"></i>
            </button>
          </div>
          
          <!-- To Asset -->
          <div class="mb-6">
            <label class="block text-gray-700 dark:text-gray-300 mb-2">To</label>
            <div class="relative">
              <select id="to-asset-select" class="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                ${cryptoAssets.map((asset, index) => `
                  <option value="${asset.symbol}" ${index === 1 ? 'selected' : ''}>
                    ${asset.name} (${asset.balance.toFixed(4)} ${asset.symbol})
                  </option>
                `).join('')}
              </select>
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
            
            <div class="mt-2">
              <input type="number" id="to-amount" class="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="0.00" readonly>
            </div>
            
            <div class="mt-1 flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400" id="to-amount-in-usd">$0.00</span>
              <span class="text-gray-500 dark:text-gray-400">
                Balance: <span id="to-current-balance">0.00</span>
              </span>
            </div>
          </div>
          
          <!-- Exchange Rate -->
          <div class="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm text-gray-600 dark:text-gray-300">
            <div class="flex justify-between items-center">
              <span>Exchange Rate</span>
              <span id="exchange-rate">1 BTC ≈ 15.23 ETH</span>
            </div>
            <div class="flex justify-between items-center mt-1">
              <span>Network Fee</span>
              <span>0.1%</span>
            </div>
          </div>
          
          <button type="submit" class="w-full py-3 bg-primary text-white rounded-md hover:opacity-90 transition-opacity">Swap</button>
        </form>
      </div>
    </div>
  `;
  
  // Add event listeners
  setupSwapPageEvents();
}

// Setup events for swap page
function setupSwapPageEvents() {
  const fromAssetSelect = document.getElementById('from-asset-select');
  const toAssetSelect = document.getElementById('to-asset-select');
  const fromAmountInput = document.getElementById('from-amount');
  const toAmountInput = document.getElementById('to-amount');
  const fromAmountInUsdElement = document.getElementById('from-amount-in-usd');
  const toAmountInUsdElement = document.getElementById('to-amount-in-usd');
  const fromCurrentBalanceElement = document.getElementById('from-current-balance');
  const toCurrentBalanceElement = document.getElementById('to-current-balance');
  const fromMaxBtn = document.getElementById('from-max-btn');
  const swapDirectionBtn = document.getElementById('swap-direction-btn');
  const exchangeRateElement = document.getElementById('exchange-rate');
  const swapForm = document.getElementById('swap-form');
  
  // Make sure second asset is different from the first
  function ensureDifferentAssets() {
    if (fromAssetSelect.value === toAssetSelect.value) {
      const options = Array.from(toAssetSelect.options);
      const differentOption = options.find(option => option.value !== fromAssetSelect.value);
      
      if (differentOption) {
        toAssetSelect.value = differentOption.value;
      }
    }
  }
  
  // Update exchange rate display
  function updateExchangeRate() {
    const fromSymbol = fromAssetSelect.value;
    const toSymbol = toAssetSelect.value;
    
    const fromAsset = cryptoAssets.find(a => a.symbol === fromSymbol);
    const toAsset = cryptoAssets.find(a => a.symbol === toSymbol);
    
    if (fromAsset && toAsset) {
      const rate = fromAsset.price / toAsset.price;
      exchangeRateElement.textContent = `1 ${fromSymbol} ≈ ${rate.toFixed(4)} ${toSymbol}`;
    }
  }
  
  // Update amounts
  function updateAmounts() {
    const fromSymbol = fromAssetSelect.value;
    const toSymbol = toAssetSelect.value;
    
    const fromAsset = cryptoAssets.find(a => a.symbol === fromSymbol);
    const toAsset = cryptoAssets.find(a => a.symbol === toSymbol);
    
    if (fromAsset && toAsset) {
      // Update balances
      fromCurrentBalanceElement.textContent = `${fromAsset.balance.toFixed(4)} ${fromSymbol}`;
      toCurrentBalanceElement.textContent = `${toAsset.balance.toFixed(4)} ${toSymbol}`;
      
      // Calculate conversion
      const fromAmount = parseFloat(fromAmountInput.value) || 0;
      const conversionRate = fromAsset.price / toAsset.price;
      const fee = fromAmount * 0.001; // 0.1% fee
      const toAmount = (fromAmount - fee) * conversionRate;
      
      // Update to amount
      toAmountInput.value = toAmount.toFixed(4);
      
      // Update USD values
      const fromValueInUsd = fromAmount * fromAsset.price;
      const toValueInUsd = toAmount * toAsset.price;
      
      fromAmountInUsdElement.textContent = formatCurrency(fromValueInUsd);
      toAmountInUsdElement.textContent = formatCurrency(toValueInUsd);
    }
  }
  
  // Initialize
  ensureDifferentAssets();
  updateExchangeRate();
  updateAmounts();
  
  // Event: From asset selection changes
  if (fromAssetSelect) {
    fromAssetSelect.addEventListener('change', () => {
      ensureDifferentAssets();
      updateExchangeRate();
      updateAmounts();
    });
  }
  
  // Event: To asset selection changes
  if (toAssetSelect) {
    toAssetSelect.addEventListener('change', () => {
      ensureDifferentAssets();
      updateExchangeRate();
      updateAmounts();
    });
  }
  
  // Event: From amount changes
  if (fromAmountInput) {
    fromAmountInput.addEventListener('input', updateAmounts);
  }
  
  // Event: Max button clicked
  if (fromMaxBtn) {
    fromMaxBtn.addEventListener('click', () => {
      const fromSymbol = fromAssetSelect.value;
      const asset = cryptoAssets.find(a => a.symbol === fromSymbol);
      
      if (asset && fromAmountInput) {
        fromAmountInput.value = asset.balance.toFixed(4);
        updateAmounts();
      }
    });
  }
  
  // Event: Swap direction button clicked
  if (swapDirectionBtn) {
    swapDirectionBtn.addEventListener('click', () => {
      const fromAsset = fromAssetSelect.value;
      const toAsset = toAssetSelect.value;
      
      fromAssetSelect.value = toAsset;
      toAssetSelect.value = fromAsset;
      
      updateExchangeRate();
      updateAmounts();
    });
  }
  
  // Event: Form submission
  if (swapForm) {
    swapForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fromAmount = parseFloat(fromAmountInput.value);
      const fromSymbol = fromAssetSelect.value;
      const toSymbol = toAssetSelect.value;
      const toAmount = parseFloat(toAmountInput.value);
      
      const fromAsset = cryptoAssets.find(a => a.symbol === fromSymbol);
      
      if (!fromAmount || fromAmount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
      }
      
      if (fromAsset && fromAmount > fromAsset.balance) {
        showToast('Insufficient balance', 'error');
        return;
      }
      
      // Simulate successful swap
      showToast(`Successfully swapped ${fromAmount} ${fromSymbol} to ${toAmount.toFixed(4)} ${toSymbol}`, 'success');
      
      // Reset form
      fromAmountInput.value = '';
      toAmountInput.value = '';
      updateAmounts();
    });
  }
}
