
// Settings page functionality

// Load settings page content
function loadSettingsPage(container) {
  container.innerHTML = `
    <div class="container mx-auto max-w-md">
      <div class="mb-6 flex items-center">
        <a href="#dashboard" class="mr-2" id="back-to-dashboard">
          <i class="fas fa-chevron-left"></i>
        </a>
        <h1 class="text-2xl font-bold dark:text-white">Settings</h1>
      </div>
      
      <div class="space-y-6">
        <div class="crypto-card p-4">
          <h2 class="text-lg font-semibold mb-4 dark:text-white">Appearance</h2>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-moon dark:hidden text-gray-600"></i>
              <i class="fas fa-sun hidden dark:block text-yellow-300"></i>
              <label for="theme-toggle-settings" class="dark:text-white">Dark Mode</label>
            </div>
            <label class="switch">
              <input type="checkbox" id="theme-toggle-settings" ${document.documentElement.classList.contains('dark') ? 'checked' : ''}>
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        
        <div class="crypto-card p-4 space-y-4">
          <h2 class="text-lg font-semibold dark:text-white">Preferences</h2>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-bell text-gray-600 dark:text-gray-300"></i>
              <label for="notifications-toggle" class="dark:text-white">Notifications</label>
            </div>
            <label class="switch">
              <input type="checkbox" id="notifications-toggle" checked>
              <span class="slider round"></span>
            </label>
          </div>
          
          <hr class="border-gray-200 dark:border-gray-700">
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-fingerprint text-gray-600 dark:text-gray-300"></i>
              <label for="biometrics-toggle" class="dark:text-white">Biometric Authentication</label>
            </div>
            <label class="switch">
              <input type="checkbox" id="biometrics-toggle">
              <span class="slider round"></span>
            </label>
          </div>
          
          <hr class="border-gray-200 dark:border-gray-700">
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-lock text-gray-600 dark:text-gray-300"></i>
              <label for="autolock-toggle" class="dark:text-white">Auto-lock</label>
            </div>
            <label class="switch">
              <input type="checkbox" id="autolock-toggle" checked>
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        
        <div class="crypto-card p-4 space-y-4">
          <h2 class="text-lg font-semibold dark:text-white">Account</h2>
          
          <div class="grid grid-cols-2 gap-4">
            <button class="btn-outline flex items-center justify-center gap-2">
              <i class="fas fa-user"></i>
              <span class="dark:text-white">Profile</span>
            </button>
            
            <button class="btn-outline flex items-center justify-center gap-2">
              <i class="fas fa-question-circle"></i>
              <span class="dark:text-white">Support</span>
            </button>
          </div>
          
          <button id="reset-app" class="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700">
            Reset App
          </button>
        </div>
      </div>
    </div>
    
    <style>
      /* Custom toggle switch */
      .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
      }
      
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: #6C5DD3;
      }
      
      input:focus + .slider {
        box-shadow: 0 0 1px #6C5DD3;
      }
      
      input:checked + .slider:before {
        transform: translateX(26px);
      }
      
      .slider.round {
        border-radius: 24px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }
    </style>
  `;
  
  // Add event listeners
  const backButton = document.getElementById('back-to-dashboard');
  if (backButton) {
    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('dashboard');
    });
  }
  
  const themeToggle = document.getElementById('theme-toggle-settings');
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      toggleTheme();
    });
  }
  
  const resetButton = document.getElementById('reset-app');
  if (resetButton) {
    resetButton.addEventListener('click', handleResetApp);
  }
}

// Handle reset app button click
function handleResetApp() {
  showToast('App has been reset to default settings', 'success');
}

// Update UI for settings page
function currentPageUpdateUI() {
  if (currentPage !== 'settings') return;
  
  // Update theme toggle
  const themeToggle = document.getElementById('theme-toggle-settings');
  if (themeToggle) {
    themeToggle.checked = document.documentElement.classList.contains('dark');
  }
}
