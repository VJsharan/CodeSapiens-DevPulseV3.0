/**
 * DevPulse v3.0 - UI Module
 * Handles all user interface interactions, theme management, and component rendering
 */

window.DevPulseUI = {
  
  // ================================
  // INITIALIZATION
  // ================================
  
  config: null,
  currentTheme: 'auto',
  isFullscreen: false,
  activeToasts: [],

  /**
   * Initialize the UI module
   */
  init() {
    this.config = window.DevPulseConfig;
    
    // Ensure clean initial state
    document.body.classList.remove('dashboard-visible');
    
    this.setupTheme();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.setupScrollAnimations();
    console.log('🎨 DevPulse UI initialized');
  },

  // ================================
  // THEME MANAGEMENT
  // ================================
  
  /**
   * Setup theme system
   */
  setupTheme() {
    const config = this.config;
    this.currentTheme = config.get('ui.theme.default', 'auto');
    
    // Apply initial theme
    this.applyTheme(this.currentTheme);
    
    // Listen for system theme changes
    if (this.currentTheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener(() => this.applyTheme('auto'));
    }
  },

  /**
   * Apply theme to document
   * @param {string} theme - Theme name ('light', 'dark', 'auto')
   */
  applyTheme(theme) {
    const body = document.body;
    const config = this.config;
    
    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
    body.removeAttribute('data-theme');
    
    if (theme === 'auto') {
      body.classList.add('theme-auto');
      // Let CSS handle auto theme with prefers-color-scheme
    } else {
      body.classList.add(`theme-${theme}`);
      body.setAttribute('data-theme', theme);
    }
    
    this.currentTheme = theme;
    
    // Save theme preference
    window.Utils.setStorage('devpulse-theme', theme);
    
    // Update theme toggle button
    this.updateThemeToggleButton();
    
    // Announce theme change for screen readers
    this.announceToScreenReader(`Theme changed to ${theme === 'auto' ? 'automatic' : theme} mode`);
  },

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    // Prevent rapid multiple clicks
    if (this.themeToggling) {
      console.log('⚠️ Theme toggle already in progress, ignoring...');
      return;
    }
    
    this.themeToggling = true;
    console.log('🎨 toggleTheme called, current theme:', this.currentTheme);
    
    const themes = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    console.log('🎨 Switching from', this.currentTheme, 'to', nextTheme);
    
    this.applyTheme(nextTheme);
    this.updateThemeToggleButton();
    
    // Show feedback
    this.showToast(`Theme switched to ${nextTheme === 'auto' ? 'automatic' : nextTheme} mode`, 'info');
    
    // Reset debounce flag after a short delay
    setTimeout(() => {
      this.themeToggling = false;
    }, 500);
  },

  /**
   * Update theme toggle button appearance
   */
  updateThemeToggleButton() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const lightIcon = themeToggle.querySelector('.theme-icon-light');
    const darkIcon = themeToggle.querySelector('.theme-icon-dark');
    
    // Clear all animation classes first
    lightIcon?.classList.remove('theme-toggle-enter', 'theme-toggle-exit');
    darkIcon?.classList.remove('theme-toggle-enter', 'theme-toggle-exit');
    
    // Force reflow
    themeToggle.offsetHeight;
    
    if (this.currentTheme === 'dark' || 
        (this.currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      lightIcon?.classList.add('theme-toggle-exit');
      darkIcon?.classList.add('theme-toggle-enter');
    } else {
      lightIcon?.classList.add('theme-toggle-enter');
      darkIcon?.classList.add('theme-toggle-exit');
    }
    
    // Clean up animation classes
    setTimeout(() => {
      lightIcon?.classList.remove('theme-toggle-enter', 'theme-toggle-exit');
      darkIcon?.classList.remove('theme-toggle-enter', 'theme-toggle-exit');
    }, 300);
  },

  // ================================
  // EVENT LISTENERS
  // ================================
  
  /**
   * Setup event listeners for UI interactions
   */
  setupEventListeners() {
    console.log('🎯 Setting up UI event listeners...');
    
    // Prevent multiple event listener attachments
    if (this.listenersAttached) {
      console.log('⚠️ Event listeners already attached, skipping...');
      return;
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    console.log('Theme toggle element:', themeToggle);
    if (themeToggle) {
      // Remove any existing listeners
      const newThemeToggle = themeToggle.cloneNode(true);
      themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);
      
      newThemeToggle.addEventListener('click', (e) => {
        console.log('🎨 Theme toggle clicked!');
        e.preventDefault();
        e.stopPropagation();
        this.toggleTheme();
      });
      console.log('✅ Theme toggle event listener attached');
    } else {
      console.error('❌ Theme toggle button not found!');
    }

    // Fullscreen toggle
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    if (fullscreenToggle) {
      fullscreenToggle.addEventListener('click', () => this.toggleFullscreen());
    }

    // Search form
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => this.handleSearch(e));
    }

    // Username input
    const usernameInput = document.getElementById('username-input');
    if (usernameInput) {
      usernameInput.addEventListener('input', (e) => this.handleUsernameInput(e));
      usernameInput.addEventListener('keydown', (e) => this.handleUsernameKeydown(e));
    }

    // Clear input button
    const clearButton = document.getElementById('clear-input');
    if (clearButton) {
      clearButton.addEventListener('click', () => this.clearUsernameInput());
    }

    // Suggestion chips
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    suggestionChips.forEach(chip => {
      chip.addEventListener('click', (e) => this.handleSuggestionClick(e));
    });

    // Repository sort
    const repoSort = document.getElementById('repo-sort');
    if (repoSort) {
      repoSort.addEventListener('change', (e) => this.handleRepoSort(e));
    }

    // Error state buttons
    const retryButton = document.getElementById('retry-button');
    const backButton = document.getElementById('back-to-search');
    
    if (retryButton) {
      retryButton.addEventListener('click', () => this.handleRetry());
    }
    
    if (backButton) {
      backButton.addEventListener('click', () => this.showSearchSection());
    }

    // Fullscreen change detection
    document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    
    // Mark listeners as attached
    this.listenersAttached = true;
    console.log('✅ All UI event listeners attached');
  },

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt + T: Toggle theme
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        this.toggleTheme();
      }
      
      // Alt + S: Focus search
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const usernameInput = document.getElementById('username-input');
        if (usernameInput) {
          usernameInput.focus();
          usernameInput.select();
        }
      }
      
      // F11: Toggle fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        this.toggleFullscreen();
      }
      
      // Escape: Close modals, clear search, etc.
      if (e.key === 'Escape') {
        this.handleEscape();
      }
    });
    
    // Track keyboard navigation for accessibility
    document.addEventListener('keydown', () => {
      document.body.classList.add('user-is-tabbing');
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('user-is-tabbing');
    });
  },

  /**
   * Setup scroll-based animations
   */
  setupScrollAnimations() {
    if (this.config.get('ui.animations.enabled', true) && 
        this.config.get('features.accessibility.enableMotionReduction', true)) {
      
      window.Utils.observeIntersection('.animate-on-scroll', (element, isVisible) => {
        if (isVisible) {
          element.classList.add('in-view');
        }
      });
    }
  },

  // ================================
  // SEARCH FUNCTIONALITY
  // ================================
  
  /**
   * Handle search form submission
   * @param {Event} e - Form submit event
   */
  async handleSearch(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById('username-input');
    const username = usernameInput.value.trim();
    
    if (!username) {
      this.showToast('Please enter a GitHub username', 'warning');
      usernameInput.focus();
      return;
    }
    
    if (!window.Utils.validateGitHubUsername(username)) {
      this.showToast('Please enter a valid GitHub username', 'error');
      usernameInput.focus();
      return;
    }
    
    // Start loading and fetch data
    this.showLoadingState();
    
    try {
      await window.DevPulse.loadUserData(username);
    } catch (error) {
      this.showErrorState(error.message);
    }
  },

  /**
   * Handle username input changes
   * @param {Event} e - Input event
   */
  handleUsernameInput(e) {
    const input = e.target;
    const clearButton = document.getElementById('clear-input');
    
    if (input.value.length > 0) {
      clearButton.style.display = 'flex';
    } else {
      clearButton.style.display = 'none';
    }
    
    // Remove error state if user starts typing
    input.classList.remove('error');
  },

  /**
   * Handle username input keydown
   * @param {Event} e - Keydown event
   */
  handleUsernameKeydown(e) {
    // Enter key submits form
    if (e.key === 'Enter') {
      e.preventDefault();
      document.querySelector('.search-form').dispatchEvent(new Event('submit'));
    }
  },

  /**
   * Clear username input
   */
  clearUsernameInput() {
    const usernameInput = document.getElementById('username-input');
    const clearButton = document.getElementById('clear-input');
    
    usernameInput.value = '';
    clearButton.style.display = 'none';
    usernameInput.focus();
  },

  /**
   * Handle suggestion chip click
   * @param {Event} e - Click event
   */
  handleSuggestionClick(e) {
    const username = e.target.dataset.username;
    if (username) {
      const usernameInput = document.getElementById('username-input');
      usernameInput.value = username;
      
      // Trigger search
      document.querySelector('.search-form').dispatchEvent(new Event('submit'));
    }
  },

  // ================================
  // FULLSCREEN FUNCTIONALITY
  // ================================
  
  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        this.showToast(`Error enabling fullscreen: ${err.message}`, 'error');
      });
    } else {
      document.exitFullscreen().catch(err => {
        this.showToast(`Error exiting fullscreen: ${err.message}`, 'error');
      });
    }
  },

  /**
   * Handle fullscreen change
   */
  handleFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
    document.body.classList.toggle('fullscreen-active', this.isFullscreen);
    
    // Update fullscreen button
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    if (fullscreenToggle) {
      const enterIcon = fullscreenToggle.querySelector('.fullscreen-enter');
      const exitIcon = fullscreenToggle.querySelector('.fullscreen-exit');
      
      if (this.isFullscreen) {
        enterIcon?.style.setProperty('display', 'none');
        exitIcon?.style.setProperty('display', 'block');
      } else {
        enterIcon?.style.setProperty('display', 'block');
        exitIcon?.style.setProperty('display', 'none');
      }
    }
  },

  // ================================
  // STATE MANAGEMENT
  // ================================
  
  /**
   * Show loading state
   */
  showLoadingState() {
    this.hideAllStates();
    
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
      // Create or update loading overlay instead of replacing content
      let loadingOverlay = dashboard.querySelector('.dashboard-loading-overlay');
      
      if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'dashboard-loading-overlay';
        dashboard.appendChild(loadingOverlay);
      }
      
      // Set skeleton content in overlay
      loadingOverlay.innerHTML = this.generateSkeletonHTML();
      loadingOverlay.style.display = 'block';
      
      // Show dashboard container but hide original content
      dashboard.style.display = 'block';
      const dashboardSections = dashboard.querySelectorAll('.dashboard-section:not(.dashboard-loading-overlay .dashboard-section)');
      dashboardSections.forEach(section => {
        section.style.display = 'none';
      });
    }
    
    // Disable search button
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
      searchButton.disabled = true;
      searchButton.innerHTML = `
        <div class="loading-spinner"></div>
        <span>Loading...</span>
      `;
    }
  },

  /**
   * Show dashboard with data
   */
  showDashboard() {
    this.hideAllStates();
    
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
      // Hide loading overlay
      const loadingOverlay = dashboard.querySelector('.dashboard-loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
      }
      
      // Show original dashboard sections
      const dashboardSections = dashboard.querySelectorAll('.dashboard-section:not(.dashboard-loading-overlay .dashboard-section)');
      dashboardSections.forEach(section => {
        section.style.display = 'block';
      });
      
      dashboard.style.display = 'block';
      dashboard.classList.add('loaded');
      
      // Add body class to indicate dashboard is visible
      document.body.classList.add('dashboard-visible');
      
      // Trigger stagger animations
      setTimeout(() => {
        const animatedElements = dashboard.querySelectorAll('.animate-on-load');
        animatedElements.forEach((element, index) => {
          // Add a base delay plus stagger delay
          const existingDelay = parseFloat(element.style.animationDelay) || 0;
          const staggerDelay = index * 0.1; // 100ms stagger
          element.style.animationDelay = `${existingDelay + staggerDelay}s`;
          element.classList.add('animate-in');
        });
        
        // Add animate-in class to dashboard for overall animation
        dashboard.classList.add('animate-in');
      }, 100);
      
      // Scroll to dashboard
      dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Reset search button
    this.resetSearchButton();
  },

  /**
   * Show error state
   * @param {string} message - Error message
   */
  showErrorState(message) {
    this.hideAllStates();
    
    const errorState = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    
    if (errorState && errorMessage) {
      errorMessage.textContent = message;
      errorState.style.display = 'flex';
      errorState.classList.add('animate-fade-in');
    }
    
    // Reset search button
    this.resetSearchButton();
    
    // Show toast notification
    this.showToast(message, 'error');
  },

  /**
   * Show search section
   */
  showSearchSection() {
    this.hideAllStates();
    
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Focus username input
    const usernameInput = document.getElementById('username-input');
    if (usernameInput) {
      setTimeout(() => {
        usernameInput.focus();
        usernameInput.select();
      }, 300);
    }
  },

  /**
   * Hide all state sections
   */
  hideAllStates() {
    const dashboard = document.getElementById('dashboard');
    const errorState = document.getElementById('error-state');
    const emptyState = document.getElementById('empty-state');
    
    [dashboard, errorState, emptyState].forEach(element => {
      if (element) {
        element.style.display = 'none';
        element.classList.remove('loaded', 'animate-fade-in');
      }
    });
    
    // Remove dashboard visible class from body
    document.body.classList.remove('dashboard-visible');
  },

  /**
   * Reset search button to original state
   */
  resetSearchButton() {
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
      searchButton.disabled = false;
      searchButton.innerHTML = `
        <span class="button-text">Analyze</span>
        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      `;
    }
  },

  // ================================
  // TOAST NOTIFICATIONS
  // ================================
  
  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type ('info', 'success', 'warning', 'error')
   * @param {number} duration - Duration in milliseconds
   */
  showToast(message, type = 'info', duration = null) {
    const config = this.config;
    const toastDuration = duration || config.get('ui.feedback.notifications.duration', 5000);
    const maxVisible = config.get('ui.feedback.notifications.maxVisible', 3);
    const position = config.get('ui.feedback.notifications.position', 'top-right');
    
    // Remove oldest toast if at limit
    if (this.activeToasts.length >= maxVisible) {
      this.removeToast(this.activeToasts[0]);
    }
    
    // Create toast element
    const toast = this.createToastElement(message, type);
    const container = this.getToastContainer();
    
    // Add to container and track
    container.appendChild(toast);
    this.activeToasts.push(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Auto remove
    setTimeout(() => {
      this.removeToast(toast);
    }, toastDuration);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
      this.removeToast(toast);
    });
  },

  /**
   * Create toast element
   * @param {string} message - Toast message
   * @param {string} type - Toast type
   * @returns {HTMLElement} Toast element
   */
  createToastElement(message, type) {
    const toast = window.Utils.createElement('div', {
      className: `toast toast-${type}`,
      role: 'alert',
      'aria-live': 'polite'
    });
    
    const icons = {
      info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>`,
      success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9 11l3 3L22 4"/>
        <circle cx="12" cy="12" r="10"/>
      </svg>`,
      warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>`,
      error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>`
    };
    
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-message">${window.Utils.escapeHtml(message)}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    
    return toast;
  },

  /**
   * Get or create toast container
   * @returns {HTMLElement} Toast container
   */
  getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = window.Utils.createElement('div', {
        id: 'toast-container',
        className: 'toast-container',
        'aria-live': 'polite',
        'aria-atomic': 'true'
      });
      document.body.appendChild(container);
    }
    return container;
  },

  /**
   * Remove toast notification
   * @param {HTMLElement} toast - Toast element
   */
  removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    
    toast.classList.add('hide');
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      
      // Remove from active toasts
      const index = this.activeToasts.indexOf(toast);
      if (index > -1) {
        this.activeToasts.splice(index, 1);
      }
    }, 300);
  },

  // ================================
  // SKELETON LOADING
  // ================================
  
  /**
   * Generate skeleton HTML for loading state
   * @returns {string} Skeleton HTML
   */
  generateSkeletonHTML() {
    return `
      <!-- Profile Section Skeleton -->
      <section class="dashboard-section profile-section">
        <div class="profile-content">
          <div class="profile-avatar">
            <div class="skeleton skeleton-avatar"></div>
          </div>
          <div class="profile-info">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
          </div>
          <div class="profile-stats">
            <div class="profile-stat">
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
            <div class="profile-stat">
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
            <div class="profile-stat">
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section Skeleton -->
      <section class="dashboard-section stats-section">
        <div class="section-header">
          <div class="skeleton skeleton-title"></div>
        </div>
        <div class="stats-grid">
          ${Array(4).fill(0).map(() => `
            <div class="skeleton-card">
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Charts Section Skeleton -->
      <section class="dashboard-section charts-section">
        <div class="section-header">
          <div class="skeleton skeleton-title"></div>
        </div>
        <div class="charts-grid">
          ${Array(3).fill(0).map(() => `
            <div class="skeleton-card">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton" style="height: 200px; margin-top: 1rem;"></div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  // ================================
  // REPOSITORY SORTING
  // ================================
  
  /**
   * Handle repository sort change
   * @param {Event} e - Change event
   */
  handleRepoSort(e) {
    const sortBy = e.target.value;
    const repositoriesGrid = document.getElementById('repositories-grid');
    
    if (repositoriesGrid && window.DevPulse.currentUserData) {
      // Re-render repositories with new sort
      window.DevPulse.renderRepositories(window.DevPulse.currentUserData.repositories, sortBy);
    }
  },

  // ================================
  // ERROR HANDLING
  // ================================
  
  /**
   * Handle retry button click
   */
  handleRetry() {
    const usernameInput = document.getElementById('username-input');
    const username = usernameInput.value.trim();
    
    if (username) {
      // Trigger search again
      document.querySelector('.search-form').dispatchEvent(new Event('submit'));
    } else {
      this.showSearchSection();
    }
  },

  /**
   * Handle escape key
   */
  handleEscape() {
    // Close any open modals/dropdowns
    // Clear search if in error state
    const errorState = document.getElementById('error-state');
    if (errorState && errorState.style.display !== 'none') {
      this.showSearchSection();
    }
    
    // Remove focus from inputs
    document.activeElement?.blur();
  },

  // ================================
  // ACCESSIBILITY
  // ================================
  
  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   */
  announceToScreenReader(message) {
    const announcement = window.Utils.createElement('div', {
      'aria-live': 'polite',
      'aria-atomic': 'true',
      className: 'sr-only-animate'
    }, message);
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Trap focus in modals
    // Manage focus order
    // Handle skip links
  },

  // ================================
  // UTILITY METHODS
  // ================================
  
  /**
   * Get current theme (computed)
   * @returns {string} Current effective theme
   */
  getCurrentTheme() {
    if (this.currentTheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.currentTheme;
  },

  /**
   * Check if animations are enabled
   * @returns {boolean} Whether animations are enabled
   */
  areAnimationsEnabled() {
    const config = this.config;
    const animationsEnabled = config.get('ui.animations.enabled', true);
    const respectMotion = config.get('ui.animations.respectMotionPreference', true);
    
    if (!animationsEnabled) return false;
    if (respectMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    
    return true;
  }
};

// Initialize UI when module loads
if (typeof window !== 'undefined' && window.DevPulseConfig) {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.DevPulseUI.init());
  } else {
    window.DevPulseUI.init();
  }
}

// Make UI globally available
window.UI = window.DevPulseUI;
