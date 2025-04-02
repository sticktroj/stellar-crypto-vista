
// Receive page functionality

// Load receive page content
function loadReceivePage(container) {
  container.innerHTML = `
    <div class="container mx-auto max-w-md">
      <div class="mb-6 flex items-center">
        <a href="#dashboard" class="mr-2" id="back-to-dashboard">
          <i class="fas fa-chevron-left"></i>
        </a>
        <h1 class="text-2xl font-bold dark:text-white">Receive Crypto</h1>
      </div>
      
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-medium dark:text-white">Select Asset</label>
          <select id="receive-asset" class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            ${generateAssetOptions()}
          </select>
        </div>
        
        <div class="crypto-card p-8 flex flex-col items-center justify-center">
          <div class="mb-4" id="asset-icon-container">
            ${selectedAsset ? createCryptoIcon(selectedAsset.symbol) : ''}
          </div>
          
          <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-4" id="qr-code">
            <div style="width: 180px; height: 180px; display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-qrcode text-6xl text-gray-400"></i>
            </div>
          </div>
          
          <p class="text-sm font-medium mb-2 dark:text-white">Your <span id="asset-name">${selectedAsset ? selectedAsset.symbol : ''}</span> Address</p>
          <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md w-full mb-4 break-all text-sm dark:text-white" id="wallet-address">
            ${selectedAsset ? getMockAddress(selectedAsset.symbol) : ''}
          </div>
          
          <button id="copy-address" class="btn-outline w-full flex items-center justify-center">
            <i class="fas fa-copy mr-2"></i>
            Copy Address
          </button>
        </div>
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
  
  const assetSelect = document.getElementById('receive-asset');
  if (assetSelect) {
    assetSelect.addEventListener('change', updateReceiveForm);
    
    // Set initial value to selected asset if available
    if (selectedAsset) {
      assetSelect.value = selectedAsset.symbol;
    }
  }
  
  const copyButton = document.getElementById('copy-address');
  if (copyButton) {
    copyButton.addEventListener('click', handleCopyAddress);
  }
  
  // Initialize form
  updateReceiveForm();
}

// Update receive form based on selected asset
function updateReceiveForm() {
  const assetSelect = document.getElementById('receive-asset');
  const assetIconContainer = document.getElementById('asset-icon-container');
  const assetNameElement = document.getElementById('asset-name');
  const walletAddressElement = document.getElementById('wallet-address');
  
  if (!assetSelect) return;
  
  const selectedSymbol = assetSelect.value;
  const asset = cryptoAssets.find(a => a.symbol === selectedSymbol);
  
  if (asset) {
    // Update asset icon
    if (assetIconContainer) {
      assetIconContainer.innerHTML = createCryptoIcon(asset.symbol);
    }
    
    // Update asset name
    if (assetNameElement) {
      assetNameElement.textContent = asset.symbol;
    }
    
    // Update wallet address
    if (walletAddressElement) {
      walletAddressElement.textContent = getMockAddress(asset.symbol);
    }
  }
}

// Handle copy address button click
function handleCopyAddress() {
  const walletAddressElement = document.getElementById('wallet-address');
  
  if (walletAddressElement) {
    const address = walletAddressElement.textContent;
    
    // Copy to clipboard
    navigator.clipboard.writeText(address)
      .then(() => {
        showToast('Address copied to clipboard', 'success');
      })
      .catch(() => {
        // Fallback for browsers that don't support clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = address;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
          document.execCommand('copy');
          showToast('Address copied to clipboard', 'success');
        } catch (err) {
          showToast('Failed to copy address', 'error');
        }
        
        document.body.removeChild(textarea);
      });
  }
}

// Update UI for receive page
function currentPageUpdateUI() {
  if (currentPage !== 'receive') return;
  
  // Update asset options
  const assetSelect = document.getElementById('receive-asset');
  if (assetSelect) {
    assetSelect.innerHTML = generateAssetOptions();
    
    // Restore selected value if possible
    if (selectedAsset) {
      assetSelect.value = selectedAsset.symbol;
    }
  }
  
  // Update form
  updateReceiveForm();
}
