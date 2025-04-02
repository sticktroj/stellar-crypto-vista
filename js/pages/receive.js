
// Receive page functionality

// Mock wallet addresses (this would come from a real wallet API in a production app)
const mockAddresses = {
  BTC: "bc1q9h0nnxm5e36jgh79xnzse3xvzywlz9j5qj5ts5",
  ETH: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  BNB: "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2",
  SOL: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
  XRP: "rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh",
  ADA: "addr1qxck4hyalr5p4khxj5fpg7x9svdevgzh7spne5rn82unvkry3eluqmhl0xmp9xn6kqgkkfzexjmdlpxw9g8v6j9gv0lskrvc63",
  DOGE: "DFundmtrigzA6E25Swr2pRe4Eb79bGP8G1",
  USDT: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  TRX: "TQrB7CEQqThMr1Xp7HsqkXZqSGnrQwKBsk",
  TON: "UQBwzLYNR5NG5CRpHgLwUzVZBECmtKH4rGdzayuX5TwdWgnz"
};

// Initialize receive page
function initReceivePage() {
  console.log('Initializing receive page...');
  
  // Get parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const assetSymbol = urlParams.get('symbol') || 'BTC';
  
  // Set the initial selected asset
  const selectAsset = document.getElementById('asset-select');
  if (selectAsset) {
    selectAsset.value = assetSymbol;
    updateReceiveAddress(assetSymbol);
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
      updateReceiveAddress(e.target.value);
    });
  }
  
  // Copy address button
  const copyButton = document.getElementById('copy-address');
  if (copyButton) {
    copyButton.addEventListener('click', copyAddressToClipboard);
  }
}

// Update receive address when asset selection changes
function updateReceiveAddress(symbol) {
  // Get elements
  const addressElement = document.getElementById('wallet-address');
  const assetIconElement = document.getElementById('asset-icon');
  const assetNameElement = document.getElementById('asset-name');
  
  if (!addressElement || !assetIconElement || !assetNameElement) return;
  
  // Find the asset in the global assets array
  const asset = cryptoAssets.find(a => a.symbol === symbol);
  if (!asset) return;
  
  // Get the address for this asset
  const address = mockAddresses[symbol] || 'No address available for this asset';
  
  // Update the UI
  addressElement.textContent = address;
  assetNameElement.textContent = `${asset.name} (${asset.symbol})`;
  
  // Update icon
  const iconClass = CONFIG.cryptoIcons[symbol] || 'fa-solid fa-coins';
  assetIconElement.innerHTML = `<i class="${iconClass}"></i>`;
  
  // Generate QR code (in a real app, this would be a proper QR code)
  updateQrCode(address);
}

// Update QR code
function updateQrCode(address) {
  const qrElement = document.getElementById('qr-code');
  if (!qrElement) return;
  
  // In a real app, generate an actual QR code here
  // For now, just display a placeholder
  qrElement.innerHTML = `
    <div class="qr-placeholder">
      <div class="placeholder-text">${address.substring(0, 8)}...${address.substring(address.length - 8)}</div>
    </div>
  `;
}

// Copy address to clipboard
function copyAddressToClipboard() {
  const addressElement = document.getElementById('wallet-address');
  if (!addressElement) return;
  
  const address = addressElement.textContent;
  
  // Create a temporary input element
  const tempInput = document.createElement('input');
  tempInput.value = address;
  document.body.appendChild(tempInput);
  
  // Select and copy the text
  tempInput.select();
  document.execCommand('copy');
  
  // Remove the temporary input
  document.body.removeChild(tempInput);
  
  // Show success message
  showToast('Address copied to clipboard', 'success');
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initReceivePage);
