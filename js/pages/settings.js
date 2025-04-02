
// Settings page specific functionality
function loadSettingsPage(container) {
  console.log("Loading settings page...");
  
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
