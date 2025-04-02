
// Navigation functionality

// Define app routes
const routes = [
  { path: 'dashboard', label: 'Dashboard', icon: 'fa-house' },
  { path: 'send', label: 'Send', icon: 'fa-paper-plane' },
  { path: 'receive', label: 'Receive', icon: 'fa-download' },
  { path: 'swap', label: 'Swap', icon: 'fa-right-left' },
  { path: 'settings', label: 'Settings', icon: 'fa-gear' }
];

let currentPage = 'dashboard';

// Initialize navigation
function initNavigation() {
  console.log("Initializing navigation...");
  createNavItems();
  navigateTo(getInitialPage());
  
  // Handle back/forward browser navigation
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
      navigateTo(event.state.page, false);
    }
  });
}

// Get initial page from URL or default to dashboard
function getInitialPage() {
  const hash = window.location.hash.substring(1);
  return hash && routes.some(route => route.path === hash) ? hash : 'dashboard';
}

// Create navigation items
function createNavItems() {
  // Desktop nav
  const desktopNavItems = document.getElementById('nav-items');
  
  // Mobile nav
  const mobileNav = document.getElementById('mobile-nav');
  
  if (desktopNavItems && mobileNav) {
    routes.forEach(route => {
      // Desktop item
      const desktopItem = document.createElement('a');
      desktopItem.href = `#${route.path}`;
      desktopItem.className = 'flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200';
      desktopItem.dataset.path = route.path;
      desktopItem.innerHTML = `
        <i class="fas ${route.icon}"></i>
        <span>${route.label}</span>
      `;
      desktopItem.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(route.path);
      });
      desktopNavItems.appendChild(desktopItem);
      
      // Mobile item
      const mobileItem = document.createElement('a');
      mobileItem.href = `#${route.path}`;
      mobileItem.className = 'flex flex-col items-center p-2 rounded-md transition-colors text-gray-500 dark:text-gray-400';
      mobileItem.dataset.path = route.path;
      mobileItem.innerHTML = `
        <i class="fas ${route.icon} text-lg"></i>
        <span class="text-xs mt-1">${route.label}</span>
      `;
      mobileItem.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(route.path);
      });
      mobileNav.appendChild(mobileItem);
    });
  }
}

// Update active nav item
function updateActiveNavItem() {
  const navItems = document.querySelectorAll('[data-path]');
  navItems.forEach(item => {
    if (item.dataset.path === currentPage) {
      item.classList.add('bg-primary', 'text-white');
      item.classList.remove('hover:bg-gray-100', 'dark:hover:bg-gray-700', 'text-gray-700', 'dark:text-gray-200', 'text-gray-500', 'dark:text-gray-400');
    } else {
      item.classList.remove('bg-primary', 'text-white');
      if (item.parentElement.id === 'nav-items') {
        item.classList.add('hover:bg-gray-100', 'dark:hover:bg-gray-700', 'text-gray-700', 'dark:text-gray-200');
      } else {
        item.classList.add('text-gray-500', 'dark:text-gray-400');
      }
    }
  });
}

// Navigate to page
function navigateTo(page, pushState = true) {
  if (!routes.some(route => route.path === page)) {
    page = 'dashboard';
  }
  
  currentPage = page;
  
  // Update URL
  if (pushState) {
    window.history.pushState({ page }, '', `#${page}`);
  }
  
  // Update active nav item
  updateActiveNavItem();
  
  // Load page content
  loadPageContent(page);
}

// Load page content
function loadPageContent(page) {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // Clear current content
  mainContent.innerHTML = '';
  
  // Show loading state
  mainContent.innerHTML = '<div class="flex justify-center items-center h-full"><i class="fas fa-circle-notch fa-spin text-4xl text-gray-400"></i></div>';
  
  // Load page content based on the page
  switch (page) {
    case 'dashboard':
      loadDashboardPage(mainContent);
      break;
    case 'send':
      loadSendPage(mainContent);
      break;
    case 'receive':
      loadReceivePage(mainContent);
      break;
    case 'swap':
      loadSwapPage(mainContent);
      break;
    case 'settings':
      loadSettingsPage(mainContent);
      break;
    default:
      mainContent.innerHTML = '<div class="text-center"><h1 class="text-2xl">Page Not Found</h1></div>';
  }
}

// Load Dashboard Page
function loadDashboardPage(container) {
  // Create dashboard page content
  container.innerHTML = `
    <div class="container mx-auto max-w-4xl">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold">Portfolio</h1>
        <button id="refresh-btn" class="px-4 py-2 border rounded-md flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <i class="fas fa-sync-alt"></i>
          <span>Refresh</span>
        </button>
      </div>
      
      <div class="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div class="chart-container relative">
          <canvas id="portfolio-chart"></canvas>
          <div class="portfolio-value absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p class="text-gray-500 dark:text-gray-400 text-sm">Total Balance</p>
            <h2 class="text-2xl font-bold" id="total-portfolio-value">$0.00</h2>
          </div>
        </div>
      </div>
      
      <h2 class="text-xl font-bold mb-4">Your Assets</h2>
      <div id="assets-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Assets will be loaded here -->
        <div class="skeleton h-24 rounded-lg"></div>
        <div class="skeleton h-24 rounded-lg"></div>
        <div class="skeleton h-24 rounded-lg"></div>
        <div class="skeleton h-24 rounded-lg"></div>
      </div>
    </div>
  `;
  
  // Add event listeners
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Refreshing...';
      
      try {
        await fetchCryptoData();
        showToast('Portfolio data updated successfully', 'success');
      } catch (error) {
        console.error('Error refreshing data:', error);
        showToast('Failed to refresh data. Please try again.', 'error');
      } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
      }
    });
  }
  
  // Initialize data
  fetchCryptoData().then(() => {
    renderDashboard();
  });
}

// Render dashboard with data
function renderDashboard() {
  renderPortfolioChart();
  renderAssetsList();
  updateTotalPortfolioValue();
}

// Function to render the portfolio chart
function renderPortfolioChart() {
  const ctx = document.getElementById('portfolio-chart');
  if (!ctx || !cryptoAssets.length) return;
  
  // Extract data for chart
  const labels = cryptoAssets.map(asset => asset.symbol);
  const data = cryptoAssets.map(asset => asset.value);
  const backgroundColors = [
    '#6C5DD3', '#7A6AEE', '#FF754C', '#FFA94C', '#2EB8E6',
    '#48DA89', '#FFEC45', '#EC45FF', '#7645FF', '#F3BA2F'
  ];
  
  // Create chart
  const chartConfig = {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColors,
        borderWidth: 0
      }]
    },
    options: {
      cutout: '70%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  };
  
  // Check if Chart is already initialized
  if (window.portfolioChart) {
    window.portfolioChart.destroy();
  }
  
  // Create new chart
  window.portfolioChart = new Chart(ctx, chartConfig);
}

// Function to render the assets list
function renderAssetsList() {
  const container = document.getElementById('assets-container');
  if (!container || !cryptoAssets.length) return;
  
  container.innerHTML = '';
  
  cryptoAssets.forEach(asset => {
    const assetCard = document.createElement('div');
    assetCard.className = 'crypto-card flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow';
    assetCard.dataset.id = asset.id;
    
    const priceChangeClass = asset.priceChange24h >= 0 ? 'text-positive' : 'text-negative';
    const priceChangeIcon = asset.priceChange24h >= 0 ? 'fa-caret-up' : 'fa-caret-down';
    
    assetCard.innerHTML = `
      <div class="flex items-center">
        <div class="crypto-icon crypto-icon-${asset.id} mr-4">
          <i class="${CONFIG.cryptoIcons[asset.symbol]}"></i>
        </div>
        <div>
          <h3 class="font-medium">${asset.name}</h3>
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>${asset.symbol}</span>
            <span class="mx-2">•</span>
            <span class="${priceChangeClass}">
              <i class="fas ${priceChangeIcon}"></i>
              ${Math.abs(asset.priceChange24h).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      <div class="text-right">
        <div class="font-medium">${asset.balance.toFixed(4)} ${asset.symbol}</div>
        <div class="text-gray-500 dark:text-gray-400">${formatCurrency(asset.value)}</div>
      </div>
    `;
    
    assetCard.addEventListener('click', () => {
      setSelectedAsset(asset.symbol);
    });
    
    container.appendChild(assetCard);
  });
}

// Update total portfolio value display
function updateTotalPortfolioValue() {
  const valueElement = document.getElementById('total-portfolio-value');
  if (valueElement) {
    valueElement.textContent = formatCurrency(totalPortfolioValue);
  }
}

// Load Send Page
function loadSendPage(container) {
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

// Load Receive Page
function loadReceivePage(container) {
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
  
  // Generate QR code
  createQRCodePlaceholder('qr-code-container', getMockAddress(currentAsset.symbol));
  
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
      
      createQRCodePlaceholder('qr-code-container', address);
      
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

// Load Swap Page
function loadSwapPage(container) {
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

// Load Settings Page
function loadSettingsPage(container) {
  container.innerHTML = `
    <div class="container mx-auto max-w-2xl">
      <h1 class="text-2xl font-bold mb-6">Settings</h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">Appearance</h2>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">Theme</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
          </div>
          
          <div class="flex gap-2">
            <button id="theme-light-btn" class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm ${document.documentElement.classList.contains('dark') ? '' : 'bg-primary text-white'}">
              Light
            </button>
            <button id="theme-dark-btn" class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm ${document.documentElement.classList.contains('dark') ? 'bg-primary text-white' : ''}">
              Dark
            </button>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">Currency</h2>
        
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-2" for="fiat-currency">Default Currency</label>
          <div class="relative">
            <select id="fiat-currency" class="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="USD" selected>USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CNY">CNY - Chinese Yuan</option>
            </select>
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <i class="fas fa-chevron-down text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">Security</h2>
        
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-medium">Auto-lock</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Lock wallet after period of inactivity</p>
          </div>
          
          <div class="relative">
            <select id="auto-lock" class="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="5">5 minutes</option>
              <option value="15" selected>15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">Price Alerts</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Receive alerts for significant price changes</p>
          </div>
          
          <div>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" id="price-alerts" class="sr-only peer" checked>
              <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">About</h2>
        
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <p class="mb-1">Stellar Crypto Vista</p>
          <p class="mb-1">Version 1.0.0</p>
          <p>© 2025 Stellar Crypto</p>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  const themeLightBtn = document.getElementById('theme-light-btn');
  const themeDarkBtn = document.getElementById('theme-dark-btn');
  
  if (themeLightBtn) {
    themeLightBtn.addEventListener('click', () => {
      applyTheme('light');
      themeLightBtn.classList.add('bg-primary', 'text-white');
      themeDarkBtn.classList.remove('bg-primary', 'text-white');
    });
  }
  
  if (themeDarkBtn) {
    themeDarkBtn.addEventListener('click', () => {
      applyTheme('dark');
      themeDarkBtn.classList.add('bg-primary', 'text-white');
      themeLightBtn.classList.remove('bg-primary', 'text-white');
    });
  }
  
  // Add event listeners for other settings
  const fiatCurrency = document.getElementById('fiat-currency');
  if (fiatCurrency) {
    fiatCurrency.addEventListener('change', () => {
      CONFIG.defaultFiat = fiatCurrency.value;
      showToast(`Default currency changed to ${fiatCurrency.value}`, 'success');
    });
  }
  
  const autoLock = document.getElementById('auto-lock');
  if (autoLock) {
    autoLock.addEventListener('change', () => {
      showToast(`Auto-lock setting updated to ${autoLock.options[autoLock.selectedIndex].text}`, 'success');
    });
  }
  
  const priceAlerts = document.getElementById('price-alerts');
  if (priceAlerts) {
    priceAlerts.addEventListener('change', () => {
      showToast(`Price alerts ${priceAlerts.checked ? 'enabled' : 'disabled'}`, 'success');
    });
  }
}

// Let's create a basic js/pages directory structure with empty files for each page
<lov-write file_path="js/pages/dashboard.js">
// Dashboard page specific functionality
function loadDashboardPage(container) {
  loadPageContent('dashboard');
}
