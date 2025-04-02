
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
    
    return assets;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    showToast('Failed to fetch crypto data. Please try again.', 'error');
    throw error;
  }
}
