
// Theme functionality

// Get initial theme from local storage or system preference
function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    return savedTheme;
  }
  
  // Check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme to document
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Save theme preference
  localStorage.setItem('theme', theme);
  
  // Update theme toggle button
  updateThemeToggleButton();
}

// Toggle between light and dark theme
function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
}

// Update theme toggle button appearance
function updateThemeToggleButton() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;
  
  // Add click event listener if not already added
  if (!themeToggleBtn.hasAttribute('data-initialized')) {
    themeToggleBtn.addEventListener('click', toggleTheme);
    themeToggleBtn.setAttribute('data-initialized', 'true');
  }
}
