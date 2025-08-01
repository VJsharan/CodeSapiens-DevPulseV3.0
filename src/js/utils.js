/**
 * DevPulse v3.0 - Utility Functions
 * Core utilities for data manipulation, formatting, and common operations
 */

window.DevPulseUtils = {
  
  // ================================
  // DATE & TIME UTILITIES
  // ================================
  
  /**
   * Format a date to relative time (e.g., "2 hours ago")
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted relative time
   */
  formatRelativeTime(date) {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  },

  /**
   * Format a date to a readable string
   * @param {string|Date} date - Date to format
   * @param {Object} options - Formatting options
   * @returns {string} Formatted date string
   */
  formatDate(date, options = {}) {
    const targetDate = new Date(date);
    const config = window.DevPulseConfig;
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return targetDate.toLocaleDateString(undefined, defaultOptions);
  },

  /**
   * Get date range for contribution calendar
   * @param {number} months - Number of months to go back
   * @returns {Object} Start and end dates
   */
  getDateRange(months = 12) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  },

  // ================================
  // NUMBER FORMATTING UTILITIES
  // ================================
  
  /**
   * Format a number with thousands separators
   * @param {number} num - Number to format
   * @param {Object} options - Formatting options
   * @returns {string} Formatted number
   */
  formatNumber(num, options = {}) {
    const config = window.DevPulseConfig;
    const {
      useThousandsSeparator = config?.get('display.formatting.numbers.useThousandsSeparator', true),
      thousandsSeparator = config?.get('display.formatting.numbers.thousandsSeparator', ','),
      decimalPlaces = config?.get('display.formatting.numbers.decimalPlaces', 1)
    } = options;
    
    if (typeof num !== 'number') return '0';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(decimalPlaces) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(decimalPlaces) + 'K';
    }
    
    if (useThousandsSeparator) {
      return num.toLocaleString();
    }
    
    return num.toString();
  },

  /**
   * Calculate percentage
   * @param {number} value - Current value
   * @param {number} total - Total value
   * @param {number} decimals - Decimal places
   * @returns {string} Formatted percentage
   */
  formatPercentage(value, total, decimals = 1) {
    if (total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(decimals)}%`;
  },

  /**
   * Animate number counter
   * @param {HTMLElement} element - Target element
   * @param {number} targetValue - Target number
   * @param {Object} options - Animation options
   */
  animateCounter(element, targetValue, options = {}) {
    const {
      duration = 1000,
      startValue = 0,
      easing = 'easeOutCubic'
    } = options;
    
    const startTime = Date.now();
    const difference = targetValue - startValue;
    
    const easingFunctions = {
      linear: t => t,
      easeOutCubic: t => 1 - Math.pow(1 - t, 3),
      easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    };
    
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunctions[easing](progress);
      const currentValue = startValue + (difference * easedProgress);
      
      element.textContent = this.formatNumber(Math.floor(currentValue));
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = this.formatNumber(targetValue);
      }
    };
    
    requestAnimationFrame(step);
  },

  // ================================
  // STRING UTILITIES
  // ================================
  
  /**
   * Truncate text with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @param {string} suffix - Suffix to add (default: '...')
   * @returns {string} Truncated text
   */
  truncateText(text, maxLength, suffix = '...') {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  },

  /**
   * Capitalize first letter
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Convert camelCase to Title Case
   * @param {string} str - String to convert
   * @returns {string} Title case string
   */
  camelToTitle(str) {
    if (!str) return '';
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  },

  /**
   * Escape HTML characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // ================================
  // URL UTILITIES
  // ================================
  
  /**
   * Validate GitHub username format
   * @param {string} username - Username to validate
   * @returns {boolean} Whether username is valid
   */
  validateGitHubUsername(username) {
    const config = window.DevPulseConfig;
    const validation = config?.get('validation.username', {});
    
    if (!username) return false;
    if (username.length < (validation.minLength || 1)) return false;
    if (username.length > (validation.maxLength || 39)) return false;
    
    const allowedPattern = validation.allowedCharacters || /^[a-zA-Z0-9\-]+$/;
    if (!allowedPattern.test(username)) return false;
    
    const reservedNames = validation.reservedNames || [];
    if (reservedNames.includes(username.toLowerCase())) return false;
    
    return true;
  },

  /**
   * Get GitHub avatar URL
   * @param {string} username - GitHub username
   * @param {number} size - Avatar size
   * @returns {string} Avatar URL
   */
  getGitHubAvatarUrl(username, size = 200) {
    return `https://github.com/${username}.png?size=${size}`;
  },

  /**
   * Get GitHub profile URL
   * @param {string} username - GitHub username
   * @returns {string} Profile URL
   */
  getGitHubProfileUrl(username) {
    return `https://github.com/${username}`;
  },

  /**
   * Get GitHub repository URL
   * @param {string} username - Repository owner
   * @param {string} repo - Repository name
   * @returns {string} Repository URL
   */
  getGitHubRepoUrl(username, repo) {
    return `https://github.com/${username}/${repo}`;
  },

  // ================================
  // ARRAY UTILITIES
  // ================================
  
  /**
   * Sort array by multiple criteria
   * @param {Array} array - Array to sort
   * @param {Array} criteria - Sort criteria
   * @returns {Array} Sorted array
   */
  multiSort(array, criteria) {
    return array.sort((a, b) => {
      for (const criterion of criteria) {
        const { key, direction = 'asc', type = 'string' } = criterion;
        
        let aVal = this.getNestedValue(a, key);
        let bVal = this.getNestedValue(b, key);
        
        if (type === 'number') {
          aVal = Number(aVal) || 0;
          bVal = Number(bVal) || 0;
        } else if (type === 'date') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }
        
        let comparison = 0;
        if (aVal > bVal) comparison = 1;
        if (aVal < bVal) comparison = -1;
        
        if (direction === 'desc') comparison *= -1;
        
        if (comparison !== 0) return comparison;
      }
      return 0;
    });
  },

  /**
   * Get nested object value by key path
   * @param {Object} obj - Object to search
   * @param {string} path - Dot-separated path
   * @returns {*} Value at path
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  },

  /**
   * Group array by key
   * @param {Array} array - Array to group
   * @param {string|Function} key - Key to group by
   * @returns {Object} Grouped object
   */
  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const groupKey = typeof key === 'function' ? key(item) : item[key];
      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(item);
      return groups;
    }, {});
  },

  /**
   * Remove duplicates from array
   * @param {Array} array - Array with duplicates
   * @param {string} key - Key to check for uniqueness
   * @returns {Array} Array without duplicates
   */
  unique(array, key = null) {
    if (!key) return [...new Set(array)];
    
    const seen = new Set();
    return array.filter(item => {
      const value = this.getNestedValue(item, key);
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  },

  // ================================
  // DOM UTILITIES
  // ================================
  
  /**
   * Create element with attributes and children
   * @param {string} tag - Element tag name
   * @param {Object} attributes - Element attributes
   * @param {Array|string} children - Child elements or text
   * @returns {HTMLElement} Created element
   */
  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.substring(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });
    
    // Add children
    if (typeof children === 'string') {
      element.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
          element.appendChild(child);
        }
      });
    }
    
    return element;
  },

  /**
   * Add multiple event listeners
   * @param {HTMLElement} element - Target element
   * @param {Object} events - Event handlers
   */
  addEventListeners(element, events) {
    Object.entries(events).forEach(([event, handler]) => {
      element.addEventListener(event, handler);
    });
  },

  /**
   * Toggle element visibility with animation
   * @param {HTMLElement} element - Element to toggle
   * @param {boolean} visible - Whether to show or hide
   * @param {string} animation - Animation class
   */
  toggleVisibility(element, visible, animation = 'animate-fade-in') {
    if (visible) {
      element.style.display = 'block';
      element.classList.add(animation);
      // Remove animation class after completion
      setTimeout(() => {
        element.classList.remove(animation);
      }, 600);
    } else {
      element.classList.add('animate-fade-out');
      setTimeout(() => {
        element.style.display = 'none';
        element.classList.remove('animate-fade-out');
      }, 300);
    }
  },

  // ================================
  // STORAGE UTILITIES
  // ================================
  
  /**
   * Set item in localStorage with error handling
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
      return false;
    }
  },

  /**
   * Get item from localStorage with error handling
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Stored value or default
   */
  getStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  removeStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  },

  // ================================
  // PERFORMANCE UTILITIES
  // ================================
  
  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @param {boolean} immediate - Execute immediately
   * @returns {Function} Debounced function
   */
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  /**
   * Throttle function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Intersection Observer for scroll animations
   * @param {string} selector - Element selector
   * @param {Function} callback - Callback function
   * @param {Object} options - Observer options
   */
  observeIntersection(selector, callback, options = {}) {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target, true);
        } else {
          callback(entry.target, false);
        }
      });
    }, defaultOptions);

    document.querySelectorAll(selector).forEach(element => {
      observer.observe(element);
    });

    return observer;
  },

  // ================================
  // COLOR UTILITIES
  // ================================
  
  /**
   * Get color for programming language
   * @param {string} language - Programming language name
   * @returns {string} Hex color code
   */
  getLanguageColor(language) {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      'C#': '#239120',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Vue: '#2c3e50',
      React: '#61dafb',
      Angular: '#dd0031',
      Shell: '#89e051',
      Dockerfile: '#384d54',
      Jupyter: '#DA5B0B',
      default: '#858585'
    };
    
    return colors[language] || colors.default;
  },

  /**
   * Get all language colors
   * @returns {Object} Object containing all language colors
   */
  getLanguageColors() {
    return {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      'C#': '#239120',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Vue: '#2c3e50',
      React: '#61dafb',
      Angular: '#dd0031',
      Shell: '#89e051',
      Dockerfile: '#384d54',
      Jupyter: '#DA5B0B',
      default: '#858585'
    };
  },

  /**
   * Convert hex color to RGB
   * @param {string} hex - Hex color code
   * @returns {Object} RGB values
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * Check if color is light or dark
   * @param {string} hex - Hex color code
   * @returns {string} 'light' or 'dark'
   */
  getColorBrightness(hex) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 'dark';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? 'light' : 'dark';
  },

  // ================================
  // ERROR HANDLING
  // ================================
  
  /**
   * Safe function execution with error handling
   * @param {Function} func - Function to execute
   * @param {*} fallback - Fallback value on error
   * @param {string} context - Error context for logging
   * @returns {*} Function result or fallback
   */
  safeExecute(func, fallback = null, context = 'Unknown') {
    try {
      return func();
    } catch (error) {
      console.error(`Error in ${context}:`, error);
      return fallback;
    }
  },

  /**
   * Log error with context
   * @param {Error|string} error - Error to log
   * @param {string} context - Error context
   * @param {Object} metadata - Additional metadata
   */
  logError(error, context = 'Unknown', metadata = {}) {
    const config = window.DevPulseConfig;
    const debugEnabled = config?.get('development.debug.enableConsoleLogging', false);
    
    if (debugEnabled) {
      console.group(`🚨 DevPulse Error - ${context}`);
      console.error('Error:', error);
      console.log('Context:', context);
      if (Object.keys(metadata).length > 0) {
        console.log('Metadata:', metadata);
      }
      console.log('Timestamp:', new Date().toISOString());
      console.groupEnd();
    }
  }
};

// Make utilities globally available
window.Utils = window.DevPulseUtils;
