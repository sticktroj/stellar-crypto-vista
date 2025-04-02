
// Receive page specific functionality
function loadReceivePage(container) {
  console.log("Loading receive page...");
  
  if (!cryptoAssets.length) {
    fetchCryptoData().then(() => loadReceivePage(container));
    return;
  }
  
  // Get default asset or first in list
  const currentAsset = selectedAsset || cryptoAssets[0];
  
  container.innerHTML = `
    <div class="container mx-auto max-w-md">
      <h1 class="text-2xl font-bold mb-6">Receive Crypto</h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 mb-2" for="asset-select">Select Asset</label>
          <div class="relative">
            <select id="receive-asset-select" class="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              ${cryptoAssets.map(asset => `
                <option value="${asset.symbol}" ${asset.symbol === currentAsset.symbol ? 'selected' : ''}>
                  ${asset.name} (${asset.symbol})
                </option>
              `).join('')}
            </select>
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <i class="fas fa-chevron-down text-gray-400"></i>
            </div>
          </div>
        </div>
        
        <div class="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div id="qr-code-container" class="flex justify-center mb-4">
            <!-- QR code will be generated here -->
            <div style="width: 200px; height: 200px; background-color: white; display: flex; align-items: center; justify-content: center;">
              <div style="width: 80%; height: 80%; background-color: #f0f0f0;"></div>
            </div>
          </div>
          
          <div class="mb-2">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Your ${currentAsset.name} Address:</p>
            <div class="relative">
              <input id="wallet-address" type="text" class="w-full p-3 pr-10 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray-300" value="${getMockAddress(currentAsset.symbol)}" readonly>
              <button id="copy-address-btn" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          <p>Send only ${currentAsset.symbol} to this address.</p>
          <p>Sending any other asset may result in permanent loss.</p>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  setupReceivePageEvents();
}

// Setup events for receive page
function setupReceivePageEvents() {
  const assetSelect = document.getElementById('receive-asset-select');
  const copyAddressBtn = document.getElementById('copy-address-btn');
  const walletAddress = document.getElementById('wallet-address');
  
  // Update when asset selection changes
  if (assetSelect) {
    assetSelect.addEventListener('change', () => {
      const symbol = assetSelect.value;
      const address = getMockAddress(symbol);
      
      if (walletAddress) {
        walletAddress.value = address;
      }
      
      const asset = cryptoAssets.find(a => a.symbol === symbol);
      if (asset) {
        const warningText = document.querySelector('.text-center p:first-child');
        if (warningText) {
          warningText.textContent = `Send only ${asset.symbol} to this address.`;
        }
      }
    });
  }
  
  // Copy address to clipboard
  if (copyAddressBtn && walletAddress) {
    copyAddressBtn.addEventListener('click', () => {
      copyToClipboard(walletAddress.value);
      showToast('Address copied to clipboard', 'success');
    });
  }
}
