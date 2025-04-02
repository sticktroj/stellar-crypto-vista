
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
  
  // Load page content (in a real app, this would be an AJAX request to a PHP file)
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
