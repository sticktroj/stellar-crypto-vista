
// Asset detail page script

function initAssetDetailPage() {
  console.log("Initializing asset detail page...");
  
  // Get the asset symbol from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const assetSymbol = urlParams.get('symbol');
  
  if (!assetSymbol) {
    console.error("No asset symbol provided in URL");
    window.location.href = "index.html";
    return;
  }
  
  // Find the asset data
  const asset = cryptoAssets.find(a => a.symbol === assetSymbol);
  
  if (!asset) {
    console.error("Asset not found:", assetSymbol);
    window.location.href = "index.html";
    return;
  }
  
  // Render the asset details
  renderAssetDetails(asset);
  
  // Set up tab navigation
  setupTabNavigation();
  
  // Generate mock transaction history
  renderTransactionHistory(asset);
}

function renderAssetDetails(asset) {
  // Update page title
  document.title = `${asset.symbol} - Crypto Wallet`;
  
  // Set header information
  const headerEl = document.querySelector('.asset-detail-header');
  if (headerEl) {
    const iconClass = CONFIG.cryptoIcons[asset.symbol] || 'fa-solid fa-coins';
    
    headerEl.innerHTML = `
      <div class="back-button">
        <a href="index.html"><i class="fa-solid fa-arrow-left"></i></a>
      </div>
      <div class="asset-icon">
        <i class="${iconClass}"></i>
      </div>
      <h1>${asset.name} (${asset.symbol})</h1>
      <div class="asset-price">
        <span class="current-price">${formatCurrency(asset.price)}</span>
        <span class="price-change ${asset.priceChange24h >= 0 ? 'positive' : 'negative'}">
          ${formatPercentage(asset.priceChange24h)}
        </span>
      </div>
    `;
  }
  
  // Update balance information
  const balanceEl = document.querySelector('.asset-balance');
  if (balanceEl) {
    balanceEl.innerHTML = `
      <h2>Your Balance</h2>
      <div class="balance-amount">
        <span class="token-amount">${formatNumber(asset.balance)} ${asset.symbol}</span>
        <span class="fiat-value">${formatCurrency(asset.value)}</span>
      </div>
    `;
  }
  
  // Set up action buttons
  const actionsEl = document.querySelector('.asset-actions');
  if (actionsEl) {
    actionsEl.innerHTML = `
      <a href="send.html?symbol=${asset.symbol}" class="action-button">
        <i class="fa-solid fa-paper-plane"></i>
        <span>Send</span>
      </a>
      <a href="receive.html?symbol=${asset.symbol}" class="action-button">
        <i class="fa-solid fa-qrcode"></i>
        <span>Receive</span>
      </a>
      <a href="swap.html?from=${asset.symbol}" class="action-button">
        <i class="fa-solid fa-repeat"></i>
        <span>Swap</span>
      </a>
    `;
  }
}

function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Show corresponding content
      const tabId = button.getAttribute('data-tab');
      const tabContent = document.querySelector(`.tab-content[data-tab="${tabId}"]`);
      if (tabContent) {
        tabContent.classList.add('active');
      }
    });
  });
  
  // Activate first tab by default
  if (tabButtons.length > 0) {
    tabButtons[0].click();
  }
}

function renderTransactionHistory(asset) {
  const historyEl = document.querySelector('.transaction-history');
  if (!historyEl) return;
  
  // Generate mock transaction data
  const transactions = generateMockTransactions(asset.symbol, 10);
  
  if (transactions.length === 0) {
    historyEl.innerHTML = `<p class="no-transactions">No transactions found.</p>`;
    return;
  }
  
  let historyHTML = `<div class="transactions-list">`;
  
  transactions.forEach(tx => {
    const isReceive = tx.type === 'receive';
    historyHTML += `
      <div class="transaction-item">
        <div class="tx-icon ${isReceive ? 'receive' : 'send'}">
          <i class="fa-solid ${isReceive ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
        </div>
        <div class="tx-details">
          <div class="tx-title">${isReceive ? 'Received' : 'Sent'} ${asset.symbol}</div>
          <div class="tx-date">${tx.date}</div>
        </div>
        <div class="tx-amount ${isReceive ? 'positive' : 'negative'}">
          ${isReceive ? '+' : '-'}${formatNumber(tx.amount)} ${asset.symbol}
        </div>
      </div>
    `;
  });
  
  historyHTML += `</div>`;
  historyEl.innerHTML = historyHTML;
}

function generateMockTransactions(symbol, count) {
  const transactions = [];
  
  // Current date
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Random date within the last 30 days
    const txDate = new Date(now);
    txDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
    
    // Format date as "Mon DD, YYYY"
    const formattedDate = txDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    // Random amount between 0.001 and 1 for BTC, 0.01 and 10 for others
    let amount;
    if (symbol === 'BTC') {
      amount = (0.001 + Math.random() * 0.999).toFixed(6);
    } else {
      amount = (0.01 + Math.random() * 9.99).toFixed(4);
    }
    
    transactions.push({
      id: `tx-${i}`,
      type: Math.random() > 0.5 ? 'send' : 'receive',
      amount: parseFloat(amount),
      date: formattedDate,
      status: 'completed'
    });
  }
  
  // Sort by date (newest first)
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return transactions;
}

// Format functions (simplified versions from utils.js)
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 8,
    minimumFractionDigits: 2
  }).format(value);
}

function formatPercentage(value) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAssetDetailPage);
