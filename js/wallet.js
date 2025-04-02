
// Wallet functionality

let cryptoAssets = [];
let selectedAsset = null;
let isLoading = true;
let totalPortfolioValue = 0;

// Fetch crypto data from API
async function fetchCryptoData() {
  isLoading = true;
  updateUI();
  
  try {
    const symbols = CONFIG.supportedAssets.join(',');
    const url = `${CONFIG.apiBaseUrl}/pricemultifull?fsyms=${symbols}&tsyms=${CONFIG.defaultFiat}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch crypto data");
    }
    
    const data = await response.json();
    
    // Process data
    cryptoAssets = CONFIG.supportedAssets.map(symbol => {
      const cryptoData = data.RAW[symbol][CONFIG.defaultFiat];
      const balance = CONFIG.mockBalances[symbol] || 0;
      const price = cryptoData.PRICE;
      
      return {
        id: symbol.toLowerCase(),
        name: CONFIG.cryptoNames[symbol],
        symbol: symbol,
        iconClass: `crypto-icon-${symbol.toLowerCase()}`,
        price: price,
        priceChange24h: cryptoData.CHANGEPCT24HOUR,
        balance: balance,
        value: balance * price
      };
    });
    
    // Calculate total portfolio value
    totalPortfolioValue = cryptoAssets.reduce((sum, asset) => sum + asset.value, 0);
    
    // If no asset is selected, select the first one
    if (!selectedAsset && cryptoAssets.length > 0) {
      selectedAsset = cryptoAssets[0];
    }
    
    isLoading = false;
    updateUI();
    
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    showToast("Failed to load cryptocurrency data. Please try again later.", "error");
    isLoading = false;
    updateUI();
  }
}

// Set selected asset
function setSelectedAsset(assetSymbol) {
  const asset = cryptoAssets.find(a => a.symbol === assetSymbol);
  if (asset) {
    selectedAsset = asset;
    updateUI();
  }
}

// Get mock wallet address for an asset
function getMockAddress(symbol) {
  const mockAddresses = {
    BTC: "bc1q9h0nnxm5e36jgh79xnzse3xvzywlz9j5qj5ts5",
    ETH: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    BNB: "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2",
    SOL: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
    XRP: "rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh",
    ADA: "addr1qxck4hyalr5p4khxj5fpg7x9svdevgzh7spne5rn82unvkry3eluqmhl0xmp9xn6kqgkkfzexjmdlpxw9g8v6j9gv0lskrvc63",
    DOGE: "DFundmtrigzA6E25Swr2pRe4Eb79bGP8G1",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    TRX: "TYDL5SLmN993xAuXVbXNTdQTYS3WHy6pJx",
    TON: "UQC3LZuZp7TTIuDk9CZrHBbxyKKjj9XqWcl_QTq2hpWtmQKU",
  };
  
  return mockAddresses[symbol] || "";
}

// Initialize wallet
function initWallet() {
  fetchCryptoData();
  
  // Set up refresh interval
  setInterval(fetchCryptoData, CONFIG.refreshInterval);
}

// Call this function when the page content changes to update UI
function updateUI() {
  // This will be implemented by each page's script
  if (typeof currentPageUpdateUI === 'function') {
    currentPageUpdateUI();
  }
}
