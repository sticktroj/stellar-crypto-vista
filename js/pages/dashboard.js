
// Dashboard page specific functionality
function loadDashboardPage(container) {
  console.log("Loading dashboard page...");
  
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
        <div class="chart-container relative" style="height: 300px;">
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
    
    const priceChangeClass = asset.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500';
    const priceChangeIcon = asset.priceChange24h >= 0 ? 'fa-caret-up' : 'fa-caret-down';
    
    assetCard.innerHTML = `
      <div class="flex items-center">
        <div class="crypto-icon mr-4">
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
      setSelectedAsset(asset);
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
