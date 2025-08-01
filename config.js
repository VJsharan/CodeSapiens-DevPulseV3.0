/**
 * DevPulse v3.0 - Unified Configuration
 * Single source of truth for all application settings
 * 
 * This file contains all configuration options for the DevPulse application.
 * Modify these settings to customize the behavior, appearance, and features.
 */

window.DevPulseConfig = {
  // ====================================
  // APPLICATION METADATA
  // ====================================
  app: {
    name: 'DevPulse',
    version: '3.0.0',
    description: 'Premium GitHub Analytics Dashboard',
    tagline: 'Discover insights into any GitHub developer\'s journey',
    author: 'DevPulse Team',
    repository: 'https://github.com/CodeSapiens-in/git-in-kadhai-016',
    homepage: 'https://devpulse-analytics.netlify.app'
  },

  // ====================================
  // GITHUB API CONFIGURATION
  // ====================================
  github: {
    // GitHub REST API base URL
    apiUrl: 'https://api.github.com',
    
    // API request timeout (milliseconds)
    timeout: 30000,
    
    // Rate limiting (GitHub allows 60 requests/hour for unauthenticated requests)
    rateLimit: {
      maxRequests: 60,
      windowMinutes: 60,
      warningThreshold: 10 // Show warning when remaining requests < this number
    },
    
    // Request retry configuration
    retry: {
      attempts: 3,
      delay: 1000, // Initial delay in ms
      backoffFactor: 2 // Exponential backoff multiplier
    },
    
    // Default demo username for initial load (set to null to disable auto-load)
    demoUsername: null,
    
    // Cache configuration for API responses
    cache: {
      enabled: true,
      duration: 300000, // 5 minutes in milliseconds
      maxSize: 100 // Maximum number of cached responses
    }
  },

  // ====================================
  // USER INTERFACE CONFIGURATION
  // ====================================
  ui: {
    // Theme configuration
    theme: {
      // Default theme: 'light', 'dark', or 'auto'
      default: 'auto',
      
      // Available themes
      options: ['light', 'dark', 'auto'],
      
      // Theme transition duration (CSS transition)
      transitionDuration: '300ms',
      
      // Enable smooth theme transitions
      enableTransitions: true
    },

    // Color palette configuration
    colors: {
      // Primary brand colors
      primary: {
        light: '#667eea',
        dark: '#5a67d8'
      },
      
      // Accent colors for highlights and CTAs
      accent: {
        light: '#ed8936',
        dark: '#dd6b20'
      },
      
      // Success, warning, error colors
      status: {
        success: '#48bb78',
        warning: '#ed8936',
        error: '#f56565',
        info: '#4299e1'
      }
    },

    // Typography configuration
    typography: {
      // Font families
      fonts: {
        primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        mono: "'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace"
      },
      
      // Font loading
      loadGoogleFonts: true,
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'
    },

    // Animation and interaction settings
    animations: {
      // Enable animations globally
      enabled: true,
      
      // Respect user's motion preferences
      respectMotionPreference: true,
      
      // Animation durations
      durations: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms'
      },
      
      // Enable micro-interactions (hover effects, button animations)
      microInteractions: true,
      
      // Enable number counter animations
      animatedCounters: true
    },

    // Layout and spacing
    layout: {
      // Container max-width
      maxWidth: '1200px',
      
      // Breakpoints for responsive design
      breakpoints: {
        mobile: '640px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1280px'
      },
      
      // Spacing scale (used for margins, paddings)
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      }
    },

    // Component-specific settings
    components: {
      // Header/navigation
      header: {
        height: '4rem',
        sticky: true,
        showVersion: true
      },
      
      // Cards and containers
      cards: {
        borderRadius: '12px',
        elevation: 'medium', // 'low', 'medium', 'high'
        enableHoverEffects: true
      },
      
      // Buttons
      buttons: {
        borderRadius: '8px',
        enableRippleEffect: true,
        hoverLiftEffect: true
      },
      
      // Charts and visualizations
      charts: {
        borderRadius: '8px',
        enableAnimations: true,
        colorScheme: 'gradient' // 'solid', 'gradient'
      }
    },

    // Loading and feedback
    feedback: {
      // Loading states
      loading: {
        enableSkeletons: true,
        skeletonAnimation: 'pulse', // 'pulse', 'wave'
        showProgressBars: true
      },
      
      // Toast notifications
      notifications: {
        position: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
        duration: 5000, // milliseconds
        maxVisible: 3,
        enableSounds: false,
        animation: 'slide' // 'slide', 'fade', 'bounce'
      },
      
      // Empty states
      emptyStates: {
        enableIllustrations: true,
        showSuggestions: true
      }
    }
  },

  // ====================================
  // FEATURE FLAGS
  // ====================================
  features: {
    // Core analytics features
    analytics: {
      contributionCalendar: true,
      repositoryGrid: true,
      languageChart: true,
      activityTimeline: true,
      streakTracking: true,
      summaryStats: true
    },
    
    // Data visualization options
    visualizations: {
      enableChartAnimations: true,
      enableInteractiveCharts: true,
      enableDataExport: false, // Future feature
      enableChartCustomization: false // Future feature
    },
    
    // User interface features
    interface: {
      enableThemeToggle: true,
      enableFullscreen: true,
      enablePrintMode: false,
      enableShareButtons: false,
      enableBookmarks: false
    },
    
    // Performance and optimization
    performance: {
      enableLazyLoading: true,
      enableImageOptimization: true,
      enableServiceWorker: false, // PWA feature
      enableOfflineMode: false
    },
    
    // Accessibility features
    accessibility: {
      enableKeyboardNavigation: true,
      enableScreenReaderSupport: true,
      enableHighContrastMode: true,
      enableFocusIndicators: true,
      enableMotionReduction: true
    },
    
    // Development and debugging
    development: {
      enableDebugMode: false, // Set to true for development
      enablePerformanceMetrics: false,
      enableErrorBoundaries: true,
      logApiRequests: false
    }
  },

  // ====================================
  // DATA DISPLAY CONFIGURATION
  // ====================================
  display: {
    // Dashboard sections and their order
    sections: {
      order: ['stats', 'charts', 'repositories', 'activity'],
      
      // Individual section settings
      stats: {
        enabled: true,
        title: 'Overview',
        columns: 4, // Number of stat cards
        animateOnLoad: true
      },
      
      charts: {
        enabled: true,
        title: 'Analytics',
        layout: 'grid', // 'grid', 'stack'
        showExportOptions: false
      },
      
      repositories: {
        enabled: true,
        title: 'Repositories',
        itemsPerPage: 9,
        sortBy: 'updated', // 'updated', 'stars', 'name'
        showPrivateRepos: false
      },
      
      activity: {
        enabled: true,
        title: 'Recent Activity',
        itemsToShow: 10,
        showTimeAgo: true
      }
    },

    // Data formatting options
    formatting: {
      // Number formatting
      numbers: {
        useThousandsSeparator: true,
        thousandsSeparator: ',',
        decimalPlaces: 1
      },
      
      // Date formatting
      dates: {
        format: 'relative', // 'relative', 'absolute'
        includeTime: false,
        timezone: 'local'
      },
      
      // Text truncation
      text: {
        maxRepoDescriptionLength: 120,
        maxCommitMessageLength: 80,
        useEllipsis: true
      }
    },

    // Chart-specific configuration
    charts: {
      contributionCalendar: {
        showWeekdays: true,
        showMonths: true,
        colorIntensity: 'medium', // 'low', 'medium', 'high'
        enableTooltips: true
      },
      
      languageChart: {
        type: 'doughnut', // 'doughnut', 'pie', 'bar'
        showPercentages: true,
        maxLanguages: 8,
        enableLegend: true
      },
      
      activityChart: {
        type: 'line', // 'line', 'bar'
        timeRange: '3months', // '1month', '3months', '6months', '1year'
        enableZoom: false
      }
    }
  },

  // ====================================
  // PERFORMANCE CONFIGURATION
  // ====================================
  performance: {
    // Image optimization
    images: {
      enableLazyLoading: true,
      enableWebP: true,
      compressionQuality: 85,
      placeholderType: 'blur' // 'blur', 'skeleton', 'none'
    },
    
    // Network optimization
    network: {
      enableRequestBatching: true,
      enableResponseCompression: true,
      enableRequestDeduplication: true
    },
    
    // Memory management
    memory: {
      enableGarbageCollection: true,
      maxCacheSize: '50MB',
      clearCacheOnNavigation: false
    }
  },

  // ====================================
  // ACCESSIBILITY CONFIGURATION
  // ====================================
  accessibility: {
    // Screen reader support
    screenReader: {
      enableAriaLabels: true,
      enableLiveRegions: true,
      announceChanges: true
    },
    
    // Keyboard navigation
    keyboard: {
      enableFocusTrapping: true,
      enableSkipLinks: true,
      customKeyBindings: {
        toggleTheme: 'Alt+T',
        focusSearch: 'Alt+S',
        toggleFullscreen: 'F11'
      }
    },
    
    // Visual accessibility
    visual: {
      enableHighContrast: false,
      enableLargeText: false,
      enableReducedMotion: false, // Automatically detected from user preference
      minimumFontSize: '14px'
    }
  },

  // ====================================
  // DEVELOPMENT CONFIGURATION
  // ====================================
  development: {
    // Debug settings
    debug: {
      enableConsoleLogging: false,
      logLevel: 'info', // 'debug', 'info', 'warn', 'error'
      enablePerformanceMetrics: false,
      enableErrorTracking: true
    },
    
    // Testing and quality assurance
    testing: {
      enableTestMode: true,
      mockApiResponses: true,
      enableA11yTesting: false,
      autoLoadDemo: false // Disable auto-loading demo data on startup
    }
  },

  // ====================================
  // VALIDATION RULES
  // ====================================
  validation: {
    username: {
      minLength: 1,
      maxLength: 39, // GitHub username max length
      allowedCharacters: /^[a-zA-Z0-9\-]+$/,
      reservedNames: ['admin', 'api', 'www', 'mail', 'support']
    }
  },

  // ====================================
  // CONFIGURATION UTILITIES
  // ====================================
  
  /**
   * Get a configuration value using dot notation
   * @param {string} path - Configuration path (e.g., 'ui.theme.default')
   * @param {*} defaultValue - Default value if path doesn't exist
   * @returns {*} Configuration value
   */
  get(path, defaultValue = null) {
    const keys = path.split('.');
    let value = this;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  },

  /**
   * Set a configuration value using dot notation
   * @param {string} path - Configuration path
   * @param {*} value - Value to set
   */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = this;
    
    for (const key of keys) {
      if (!(key in target) || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }
    
    target[lastKey] = value;
  },

  /**
   * Check if a feature is enabled
   * @param {string} featurePath - Feature path (e.g., 'analytics.contributionCalendar')
   * @returns {boolean} Whether the feature is enabled
   */
  isFeatureEnabled(featurePath) {
    return this.get(`features.${featurePath}`, false) === true;
  },

  /**
   * Get current theme based on user preference and auto-detection
   * @returns {string} Current theme ('light' or 'dark')
   */
  getCurrentTheme() {
    const defaultTheme = this.get('ui.theme.default', 'auto');
    
    if (defaultTheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return defaultTheme;
  },

  /**
   * Validate the configuration for common issues
   * @returns {Array} Array of validation warnings/errors
   */
  validate() {
    const issues = [];
    
    // Check required fields
    if (!this.app.name) issues.push('app.name is required');
    if (!this.github.apiUrl) issues.push('github.apiUrl is required');
    
    // Check rate limits
    if (this.github.rateLimit.maxRequests > 5000) {
      issues.push('github.rateLimit.maxRequests should not exceed 5000 for unauthenticated requests');
    }
    
    // Check theme configuration
    const defaultTheme = this.get('ui.theme.default');
    if (!this.ui.theme.options.includes(defaultTheme)) {
      issues.push(`ui.theme.default '${defaultTheme}' is not in allowed options`);
    }
    
    return issues;
  },

  /**
   * Initialize configuration and perform validation
   */
  init() {
    const issues = this.validate();
    
    if (issues.length > 0) {
      console.warn('DevPulse Configuration Issues:', issues);
    }
    
    // Set up theme detection if auto mode is enabled
    if (this.get('ui.theme.default') === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener(() => {
        if (typeof window.DevPulse?.ui?.updateTheme === 'function') {
          window.DevPulse.ui.updateTheme();
        }
      });
    }
    
    console.log(`✅ ${this.app.name} v${this.app.version} configuration loaded`);
    return this;
  }
};

// Initialize configuration when script loads
window.DevPulseConfig.init();

// Legacy compatibility
window.CONFIG = window.DevPulseConfig;
