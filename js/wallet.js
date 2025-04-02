
// Wallet functionality

// Global variables for crypto data
let cryptoAssets = [];
let totalPortfolioValue = 0;
let selectedAsset = null;

// Initialize wallet data
function initWallet() {
  console.log("Initializing wallet...");
  // Fetch crypto data on app start
  fetchCryptoData();
  
  // Refresh data periodically
  setInterval(fetchCryptoData, CONFIG.refreshInterval);
}

// Set selected asset
function setSelectedAsset(asset) {
  selectedAsset = asset;
  console.log('Selected asset:', asset);
  
  // Navigate to the asset detail page
  window.location.href = `asset-detail.html?symbol=${asset.symbol}`;
}

// Mock function to fetch crypto data
// In a real app, this would be an API call
async function fetchCryptoData() {
  console.log("Fetching crypto data...");
  
  try {
    // Create mock data for now
    const assets = CONFIG.supportedAssets.map((symbol, index) => {
      const balance = CONFIG.mockBalances[symbol] || Math.random() * 100;
      
      // Generate a price between $0.01 and $100,000
      let price;
      if (symbol === 'BTC') {
        price = 40000 + (Math.random() * 5000);
      } else if (symbol === 'ETH') {
        price = 2500 + (Math.random() * 500);
      } else if (symbol === 'BNB') {
        price = 300 + (Math.random() * 50);
      } else if (symbol === 'SOL') {
        price = 100 + (Math.random() * 30);
      } else if (symbol === 'XRP') {
        price = 0.5 + (Math.random() * 0.2);
      } else if (symbol === 'ADA') {
        price = 0.3 + (Math.random() * 0.1);
      } else if (symbol === 'DOGE') {
        price = 0.08 + (Math.random() * 0.02);
      } else if (symbol === 'USDT') {
        price = 1.0 + (Math.random() * 0.01 - 0.005); // Stablecoin around $1
      } else if (symbol === 'TRX') {
        price = 0.1 + (Math.random() * 0.02);
      } else if (symbol === 'TON') {
        price = 5.0 + (Math.random() * 1.0);
      } else {
        price = Math.random() * 1000;
      }
      
      // Calculate total value
      const value = balance * price;
      
      // Generate a price change between -10% and +10%
      const priceChange24h = Math.random() * 20 - 10;
      
      return {
        id: index + 1,
        symbol,
        name: CONFIG.cryptoNames[symbol] || symbol,
        price,
        balance,
        value,
        priceChange24h
      };
    });
    
    // Sort by value (highest to lowest)
    assets.sort((a, b) => b.value - a.value);
    
    // Set global data
    cryptoAssets = assets;
    totalPortfolioValue = assets.reduce((total, asset) => total + asset.value, 0);
    
    // If no asset is selected, select the first one
    if (!selectedAsset && cryptoAssets.length) {
      selectedAsset = cryptoAssets[0];
    }
    
    // Update UI if we're on the dashboard page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
      renderAssetsList();
      updatePortfolioValue();
    }
    
    return assets;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    showToast('Failed to fetch crypto data. Please try again.', 'error');
    throw error;
  }
}

// Render assets list (only on dashboard)
function renderAssetsList() {
  const assetsListEl = document.getElementById('assets-list');
  if (!assetsListEl) return;
  
  let assetsHTML = '';
  
  cryptoAssets.forEach(asset => {
    const iconClass = CONFIG.cryptoIcons[asset.symbol] || 'fa-solid fa-coins';
    const priceChangeClass = asset.priceChange24h >= 0 ? 'positive' : 'negative';
    
    assetsHTML += `
      <div class="crypto-card" data-symbol="${asset.symbol}">
        <div class="crypto-card-header">
          <div class="crypto-icon">
            <i class="${iconClass}"></i>
          </div>
          <div class="crypto-info">
            <h3>${asset.symbol}</h3>
            <p>${asset.name}</p>
          </div>
          <div class="crypto-balance">
            <div class="balance-amount">${formatNumber(asset.balance)}</div>
            <div class="balance-value">${formatCurrency(asset.value)}</div>
          </div>
        </div>
        <div class="crypto-card-footer">
          <div class="crypto-price">
            <div class="price-label">Price</div>
            <div class="price-value">${formatCurrency(asset.price)}</div>
          </div>
          <div class="crypto-change ${priceChangeClass}">
            ${formatPercentage(asset.priceChange24h)}
          </div>
        </div>
      </div>
    `;
  });
  
  assetsListEl.innerHTML = assetsHTML;
  
  // Add click event listeners to each card
  document.querySelectorAll('.crypto-card').forEach(card => {
    card.addEventListener('click', function() {
      const symbol = this.getAttribute('data-symbol');
      const asset = cryptoAssets.find(a => a.symbol === symbol);
      
      if (asset) {
        setSelectedAsset(asset);
      }
    });
  });
}

// Update portfolio value display
function updatePortfolioValue() {
  const portfolioValueEl = document.getElementById('portfolio-value');
  if (portfolioValueEl) {
    portfolioValueEl.textContent = formatCurrency(totalPortfolioValue);
  }
}

// Format currency for display
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

// Format number for display
function formatNumber(value) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 8,
    minimumFractionDigits: 2
  }).format(value);
}

// Format percentage for display
function formatPercentage(value) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
