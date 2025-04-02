
// Dashboard page functionality

let portfolioChart = null;

// Load dashboard page content
function loadDashboardPage(container) {
  container.innerHTML = `
    <div class="container mx-auto max-w-4xl">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold dark:text-white">Portfolio</h1>
        <button id="refresh-data" class="btn-outline flex items-center">
          <i class="fas fa-sync-alt mr-2"></i>
          Refresh
        </button>
      </div>
      
      <div class="mb-8 relative" style="height: 300px;">
        <canvas id="portfolio-chart"></canvas>
        <div class="portfolio-value">
          <h2 class="text-sm text-muted-foreground">PORTFOLIO VALUE</h2>
          <p class="font-bold text-2xl" id="total-balance">${isLoading ? createSkeleton('120px', '30px') : formatCurrency(totalPortfolioValue)}</p>
        </div>
      </div>
      
      <h2 class="text-xl font-bold mb-4 dark:text-white">Your Assets</h2>
      <div id="asset-list" class="space-y-4">
        ${isLoading ? generateAssetSkeletons() : generateAssetList()}
      </div>
    </div>
  `;
  
  // Add event listeners
  const refreshButton = document.getElementById('refresh-data');
  if (refreshButton) {
    refreshButton.addEventListener('click', handleRefreshData);
  }
  
  // Initialize chart after DOM is updated
  setTimeout(() => {
    initPortfolioChart();
    
    // Add click handlers to asset cards
    addAssetCardHandlers();
  }, 0);
}

// Generate skeleton loaders for assets
function generateAssetSkeletons() {
  let skeletons = '';
  for (let i = 0; i < 4; i++) {
    skeletons += `
      <div class="crypto-card p-4">
        <div class="flex items-center gap-3">
          ${createSkeleton('40px', '40px', 'rounded-xl')}
          <div>
            ${createSkeleton('80px', '20px')}
            ${createSkeleton('100px', '16px', 'mt-1')}
          </div>
        </div>
      </div>
    `;
  }
  return skeletons;
}

// Generate asset list HTML
function generateAssetList() {
  if (!cryptoAssets.length) return '<p>No assets found</p>';
  
  return cryptoAssets.map(asset => {
    const isSelected = selectedAsset && selectedAsset.symbol === asset.symbol;
    return `
      <div class="crypto-card p-4 cursor-pointer ${isSelected ? 'asset-selected' : ''}" data-asset="${asset.symbol}">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            ${createCryptoIcon(asset.symbol)}
            <div>
              <h3 class="font-bold dark:text-white">${asset.symbol}</h3>
              <p class="text-sm text-muted-foreground">${asset.name}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold dark:text-white">${formatNumber(asset.balance)}</p>
            <p class="text-sm text-muted-foreground">${formatCurrency(asset.value)}</p>
          </div>
        </div>
        
        <div class="flex items-center justify-between mt-4">
          <div>
            <p class="text-sm text-muted-foreground">Price</p>
            <p class="font-medium dark:text-white">${formatCurrency(asset.price)}</p>
          </div>
          <div class="${asset.priceChange24h >= 0 ? "text-positive" : "text-negative"}">
            ${formatPercentage(asset.priceChange24h)}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Initialize portfolio chart
function initPortfolioChart() {
  const chartCanvas = document.getElementById('portfolio-chart');
  if (!chartCanvas || isLoading || !cryptoAssets.length) return;
  
  // Destroy existing chart if it exists
  if (portfolioChart) {
    portfolioChart.destroy();
  }
  
  // Prepare data for chart
  const labels = cryptoAssets.map(asset => asset.symbol);
  const data = cryptoAssets.map(asset => asset.value);
  const backgroundColor = [
    '#6C5DD3', '#F7931A', '#627EEA', '#3C5DFD', '#26A17B', 
    '#2775CA', '#E84142', '#0095D9', '#8247E5', '#E6007A'
  ];
  
  // Create chart
  portfolioChart = new Chart(chartCanvas, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        borderColor: document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: {
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const percentage = (value / totalPortfolioValue * 100).toFixed(2);
              return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Add click handlers to asset cards
function addAssetCardHandlers() {
  const assetCards = document.querySelectorAll('[data-asset]');
  assetCards.forEach(card => {
    card.addEventListener('click', () => {
      const symbol = card.dataset.asset;
      setSelectedAsset(symbol);
    });
  });
}

// Handle refresh data button click
function handleRefreshData() {
  const button = document.getElementById('refresh-data');
  if (button) {
    // Add spinning animation to button
    const icon = button.querySelector('i');
    if (icon) {
      icon.classList.add('fa-spin');
    }
    button.disabled = true;
    
    // Refresh data
    fetchCryptoData().then(() => {
      // Remove spinning animation
      if (icon) {
        icon.classList.remove('fa-spin');
      }
      button.disabled = false;
      
      // Show success message
      showToast('Portfolio data updated', 'success');
    }).catch(error => {
      // Remove spinning animation
      if (icon) {
        icon.classList.remove('fa-spin');
      }
      button.disabled = false;
      
      // Show error message
      showToast('Failed to update portfolio data', 'error');
    });
  }
}

// Update UI for dashboard page
function currentPageUpdateUI() {
  if (currentPage !== 'dashboard') return;
  
  // Update total balance
  const totalBalanceElement = document.getElementById('total-balance');
  if (totalBalanceElement) {
    totalBalanceElement.textContent = formatCurrency(totalPortfolioValue);
  }
  
  // Update asset list
  const assetListElement = document.getElementById('asset-list');
  if (assetListElement) {
    assetListElement.innerHTML = isLoading ? generateAssetSkeletons() : generateAssetList();
    
    // Re-add click handlers
    addAssetCardHandlers();
  }
  
  // Update chart
  initPortfolioChart();
}
