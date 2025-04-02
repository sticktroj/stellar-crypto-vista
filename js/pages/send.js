
// Send page specific functionality
function loadSendPage(container) {
  console.log("Loading send page...");
  
  if (!cryptoAssets.length) {
    fetchCryptoData().then(() => loadSendPage(container));
    return;
  }
  
  container.innerHTML = `
    <div class="container mx-auto max-w-md">
      <h1 class="text-2xl font-bold mb-6">Send Crypto</h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <form id="send-form">
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 mb-2" for="asset-select">Select Asset</label>
            <div class="relative">
              <select id="asset-select" class="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                ${cryptoAssets.map(asset => `
                  <option value="${asset.symbol}" ${asset.symbol === (selectedAsset ? selectedAsset.symbol : '') ? 'selected' : ''}>
                    ${asset.name} (${asset.balance.toFixed(4)} ${asset.symbol})
                  </option>
                `).join('')}
              </select>
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 mb-2" for="recipient">Recipient Address</label>
            <input type="text" id="recipient" class="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter wallet address">
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-700 dark:text-gray-300 mb-2" for="amount">Amount</label>
            <div class="relative">
              <input type="number" id="amount" class="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="0.00" step="0.0001" min="0">
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button type="button" id="max-btn" class="text-primary text-sm font-medium">MAX</button>
              </div>
            </div>
            <div class="mt-1 flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400" id="amount-in-usd">$0.00</span>
              <span class="text-gray-500 dark:text-gray-400">
                Balance: <span id="current-balance">0.00</span>
              </span>
            </div>
          </div>
          
          <button type="submit" class="w-full py-3 bg-primary text-white rounded-md hover:opacity-90 transition-opacity">Send</button>
        </form>
      </div>
    </div>
  `;
  
  // Add event listeners
  setupSendPageEvents();
}

// Setup events for send page
function setupSendPageEvents() {
  const assetSelect = document.getElementById('asset-select');
  const amountInput = document.getElementById('amount');
  const amountInUsdElement = document.getElementById('amount-in-usd');
  const currentBalanceElement = document.getElementById('current-balance');
  const maxBtn = document.getElementById('max-btn');
  const sendForm = document.getElementById('send-form');
  
  // Update displayed asset info when asset is changed
  function updateAssetInfo() {
    const symbol = assetSelect.value;
    const asset = cryptoAssets.find(a => a.symbol === symbol);
    if (asset) {
      currentBalanceElement.textContent = `${asset.balance.toFixed(4)} ${symbol}`;
      
      // Update amount in USD
      const amount = parseFloat(amountInput.value) || 0;
      const valueInUsd = amount * asset.price;
      amountInUsdElement.textContent = formatCurrency(valueInUsd);
    }
  }
  
  // Set max amount
  if (maxBtn) {
    maxBtn.addEventListener('click', () => {
      const symbol = assetSelect.value;
      const asset = cryptoAssets.find(a => a.symbol === symbol);
      if (asset && amountInput) {
        amountInput.value = asset.balance.toFixed(4);
        updateAssetInfo();
      }
    });
  }
  
  // Update amount in USD when amount changes
  if (amountInput) {
    amountInput.addEventListener('input', updateAssetInfo);
  }
  
  // Update when asset selection changes
  if (assetSelect) {
    assetSelect.addEventListener('change', updateAssetInfo);
    // Initial update
    updateAssetInfo();
  }
  
  // Handle form submission
  if (sendForm) {
    sendForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const recipient = document.getElementById('recipient').value;
      const amount = parseFloat(amountInput.value);
      const symbol = assetSelect.value;
      const asset = cryptoAssets.find(a => a.symbol === symbol);
      
      if (!recipient) {
        showToast('Please enter a recipient address', 'error');
        return;
      }
      
      if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
      }
      
      if (asset && amount > asset.balance) {
        showToast('Insufficient balance', 'error');
        return;
      }
      
      // Simulate successful transaction
      showToast(`Successfully sent ${amount} ${symbol} to ${truncateText(recipient, 15)}`, 'success');
      
      // Reset form
      sendForm.reset();
      updateAssetInfo();
    });
  }
}
