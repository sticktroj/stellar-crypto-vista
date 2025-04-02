
// Send page functionality

// Load send page content
function loadSendPage(container) {
  container.innerHTML = `
    <div class="container mx-auto max-w-md">
      <div class="mb-6 flex items-center">
        <a href="#dashboard" class="mr-2" id="back-to-dashboard">
          <i class="fas fa-chevron-left"></i>
        </a>
        <h1 class="text-2xl font-bold dark:text-white">Send Crypto</h1>
      </div>
      
      <form id="send-form" class="space-y-6">
        <div class="space-y-2">
          <label for="asset" class="dark:text-white">Select Asset</label>
          <select id="asset" class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            ${generateAssetOptions()}
          </select>
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between">
            <label for="amount" class="dark:text-white">Amount</label>
            <span class="text-sm text-muted-foreground asset-balance"></span>
          </div>
          
          <div class="flex gap-2">
            <input
              id="amount"
              type="number"
              placeholder="0.00"
              step="any"
              class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <button type="button" id="max-amount" class="btn-outline">
              Max
            </button>
          </div>
          
          <p class="text-sm text-muted-foreground fiat-value"></p>
        </div>
        
        <div class="space-y-2">
          <label for="address" class="dark:text-white">Recipient Address</label>
          <input
            id="address"
            placeholder="Enter wallet address"
            class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <button 
          type="submit" 
          class="btn-primary w-full flex items-center justify-center" 
          id="send-button"
          disabled
        >
          <i class="fas fa-paper-plane mr-2"></i>
          Send <span class="asset-symbol ml-1"></span>
        </button>
      </form>
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
  
  const assetSelect = document.getElementById('asset');
  if (assetSelect) {
    assetSelect.addEventListener('change', updateSendForm);
    
    // Set initial value to selected asset if available
    if (selectedAsset) {
      assetSelect.value = selectedAsset.symbol;
    }
  }
  
  const amountInput = document.getElementById('amount');
  if (amountInput) {
    amountInput.addEventListener('input', updateSendForm);
  }
  
  const addressInput = document.getElementById('address');
  if (addressInput) {
    addressInput.addEventListener('input', updateSendForm);
  }
  
  const maxButton = document.getElementById('max-amount');
  if (maxButton) {
    maxButton.addEventListener('click', handleMaxAmount);
  }
  
  const sendForm = document.getElementById('send-form');
  if (sendForm) {
    sendForm.addEventListener('submit', handleSendFormSubmit);
  }
  
  // Initialize form
  updateSendForm();
}

// Generate options for asset select
function generateAssetOptions() {
  if (isLoading) {
    return '<option>Loading...</option>';
  }
  
  if (!cryptoAssets.length) {
    return '<option>No assets available</option>';
  }
  
  return cryptoAssets.map(asset => {
    return `
      <option value="${asset.symbol}">
        ${asset.symbol} (${formatNumber(asset.balance)})
      </option>
    `;
  }).join('');
}

// Update send form based on selected asset and inputs
function updateSendForm() {
  const assetSelect = document.getElementById('asset');
  const amountInput = document.getElementById('amount');
  const addressInput = document.getElementById('address');
  const sendButton = document.getElementById('send-button');
  const assetBalanceElement = document.querySelector('.asset-balance');
  const fiatValueElement = document.querySelector('.fiat-value');
  const assetSymbolElements = document.querySelectorAll('.asset-symbol');
  
  if (!assetSelect || !amountInput || !addressInput || !sendButton) return;
  
  const selectedSymbol = assetSelect.value;
  const asset = cryptoAssets.find(a => a.symbol === selectedSymbol);
  
  if (asset) {
    // Update balance display
    if (assetBalanceElement) {
      assetBalanceElement.textContent = `Available: ${formatNumber(asset.balance)} ${asset.symbol}`;
    }
    
    // Update asset symbol in button
    assetSymbolElements.forEach(el => {
      el.textContent = asset.symbol;
    });
    
    // Update fiat value
    const amount = parseFloat(amountInput.value);
    if (fiatValueElement && !isNaN(amount)) {
      fiatValueElement.textContent = `≈ ${formatCurrency(amount * asset.price)}`;
    } else if (fiatValueElement) {
      fiatValueElement.textContent = '';
    }
    
    // Enable/disable send button
    const hasAmount = amountInput.value && !isNaN(parseFloat(amountInput.value)) && parseFloat(amountInput.value) > 0;
    const hasAddress = addressInput.value.trim() !== '';
    const validAmount = hasAmount && parseFloat(amountInput.value) <= asset.balance;
    
    sendButton.disabled = !hasAmount || !hasAddress || !validAmount;
    
    // Add error styling for invalid amount
    if (hasAmount && !validAmount) {
      amountInput.classList.add('border-red-500');
      if (fiatValueElement) {
        fiatValueElement.classList.add('text-negative');
        fiatValueElement.textContent = 'Insufficient balance';
      }
    } else {
      amountInput.classList.remove('border-red-500');
      if (fiatValueElement) {
        fiatValueElement.classList.remove('text-negative');
      }
    }
  }
}

// Handle max amount button click
function handleMaxAmount() {
  const assetSelect = document.getElementById('asset');
  const amountInput = document.getElementById('amount');
  
  if (!assetSelect || !amountInput) return;
  
  const selectedSymbol = assetSelect.value;
  const asset = cryptoAssets.find(a => a.symbol === selectedSymbol);
  
  if (asset) {
    amountInput.value = asset.balance;
    updateSendForm();
  }
}

// Handle send form submission
function handleSendFormSubmit(e) {
  e.preventDefault();
  
  const assetSelect = document.getElementById('asset');
  const amountInput = document.getElementById('amount');
  const addressInput = document.getElementById('address');
  
  if (!assetSelect || !amountInput || !addressInput) return;
  
  const selectedSymbol = assetSelect.value;
  const amount = parseFloat(amountInput.value);
  const address = addressInput.value.trim();
  
  // Simulate sending transaction
  showToast(`${amount} ${selectedSymbol} sent successfully`, 'success');
  
  // Reset form
  amountInput.value = '';
  addressInput.value = '';
  updateSendForm();
}

// Update UI for send page
function currentPageUpdateUI() {
  if (currentPage !== 'send') return;
  
  // Update asset options
  const assetSelect = document.getElementById('asset');
  if (assetSelect) {
    assetSelect.innerHTML = generateAssetOptions();
    
    // Restore selected value if possible
    if (selectedAsset) {
      assetSelect.value = selectedAsset.symbol;
    }
  }
  
  // Update form
  updateSendForm();
}
