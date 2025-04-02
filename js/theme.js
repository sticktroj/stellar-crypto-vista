
// Theme management functionality

// Check if user prefers dark mode
function getInitialTheme() {
  // Check local storage
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
  
  // Save to local storage
  localStorage.setItem('theme', theme);
  
  // Update theme toggle button
  updateThemeToggleButton();
}

// Update theme toggle button appearance
function updateThemeToggleButton() {
  const isDark = document.documentElement.classList.contains('dark');
  const moonIcon = document.querySelector('#theme-toggle .fa-moon');
  const sunIcon = document.querySelector('#theme-toggle .fa-sun');
  
  if (moonIcon && sunIcon) {
    if (isDark) {
      moonIcon.classList.add('hidden');
      sunIcon.classList.remove('hidden');
    } else {
      moonIcon.classList.remove('hidden');
      sunIcon.classList.add('hidden');
    }
  }
}

// Toggle theme
function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
  // Apply initial theme
  applyTheme(getInitialTheme());
  
  // Set up theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
});
