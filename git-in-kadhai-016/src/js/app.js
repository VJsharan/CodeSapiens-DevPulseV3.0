/**
 * DevPulse v3.0 - Main Application Controller
 * Orchestrates all modules and handles application lifecycle
 */

window.DevPulse = {
  
  // ================================
  // APPLICATION STATE
  // ================================
  
  config: null,
  isInitialized: false,
  currentUserData: null,
  currentUsername: null,
  loadingState: false,
  loadingScreen: null,
  
  // ================================
  // LOADING SCREEN MANAGEMENT
  // ================================
  
  /**
   * Initialize and show loading screen
   */
  showLoadingScreen() {
    this.loadingScreen = document.getElementById('loading-screen');
    if (this.loadingScreen) {
      this.loadingScreen.style.display = 'flex';
      this.loadingScreen.classList.remove('fade-out');
      this.updateLoadingMessage('Initializing DevPulse...');
      this.updateLoadingProgress(0);
      
      // Create particle effects
      this.createParticles();
    }
  },

  /**
   * Update loading message
   * @param {string} message - Loading message
   */
  updateLoadingMessage(message) {
    const messageEl = document.getElementById('loading-message');
    if (messageEl) {
      messageEl.textContent = message;
    }
  },

  /**
   * Update loading progress
   * @param {number} progress - Progress percentage (0-100)
   */
  updateLoadingProgress(progress) {
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    
    if (progressBar) {
      progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    }
    
    if (progressPercentage) {
      progressPercentage.textContent = `${Math.round(progress)}%`;
    }
  },

  /**
   * Create particle animation
   */
  createParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    // Create particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random animation delay
      particle.style.animationDelay = `${Math.random() * 3}s`;
      particle.style.animationDuration = `${3 + Math.random() * 2}s`;
      
      container.appendChild(particle);
    }
  },

  /**
   * Hide loading screen
   */
  hideLoadingScreen() {
    if (this.loadingScreen) {
      this.updateLoadingProgress(100);
      
      // Stop anime tip rotation
      this.stopAnimeTipRotation();
      
      setTimeout(() => {
        this.loadingScreen.classList.add('fade-out');
        
        // Show main app
        const app = document.getElementById('app');
        if (app) {
          app.style.display = 'block';
          setTimeout(() => {
            app.style.opacity = '1';
          }, 50);
        }
        
        // Remove loading screen after transition
        setTimeout(() => {
          if (this.loadingScreen) {
            this.loadingScreen.style.display = 'none';
          }
        }, 500);
      }, 500);
    }
  },

  // ================================
  // INITIALIZATION
  // ================================
  
  /**
   * Initialize the application
   */
  async init() {
    // Prevent multiple initializations
    if (this.isInitialized || this.loadingState) {
      console.log('⚠️ DevPulse already initialized or initializing...');
      return;
    }
    
    try {
      console.log('🚀 DevPulse v3.0 initializing...');
      
      // Set loading state to prevent multiple inits
      this.loadingState = true;
      
      // Show loading screen
      this.showLoadingScreen();
      
      // Start anime tip rotation
      this.startAnimeTipRotation();
      
      // Simulate loading steps for better UX
      this.updateLoadingMessage('🌸 Awakening data spirits... (◕‿◕)');
      this.updateLoadingProgress(10);
      await this.sleep(300);
      
      // Wait for dependencies
      this.updateLoadingMessage('🔮 Summoning magical APIs... ✨');
      this.updateLoadingProgress(25);
      await this.waitForDependencies();
      
      // Initialize configuration
      this.updateLoadingMessage('⚡ Charging power levels... Over 9000! ⚡');
      this.updateLoadingProgress(40);
      this.config = window.DevPulseConfig;
      await this.sleep(200);
      
      // Initialize all modules
      this.updateLoadingMessage('🚀 Launching friendship rocket to GitHub! 🚀');
      this.updateLoadingProgress(60);
      await this.initializeModules();
      
      // Setup application
      this.updateLoadingMessage('🐱 Nya~ Setting up the adventure map! 🗺️');
      this.updateLoadingProgress(80);
      await this.setupApplication();
      await this.sleep(200);
      
      // Final setup
      this.updateLoadingMessage('✨ Final boss battle preparation... Almost ready! ✨');
      this.updateLoadingProgress(90);
      await this.sleep(300);
      
      // Mark as initialized
      this.isInitialized = true;
      this.loadingState = false; // Reset loading state
      
      console.log('✅ DevPulse v3.0 ready!');
      
      // Hide loading screen and show app
      this.updateLoadingMessage('🎉 Adventure begins! Let\'s explore GitHub together! (＾◡＾)');
      this.updateLoadingProgress(100);
      await this.sleep(500);
      
      this.hideLoadingScreen();
      
      // Show welcome message after loading screen disappears
      setTimeout(() => {
        this.showWelcomeMessage();
      }, 1000);
      
    } catch (error) {
      console.error('❌ DevPulse initialization failed:', error);
      this.updateLoadingMessage('Initialization failed');
      this.handleInitializationError(error);
    }
  },

  /**
   * Sleep utility for smooth loading
   * @param {number} ms - Milliseconds to sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Wait for required dependencies to load
   */
  async waitForDependencies() {
    const maxWait = 10000; // 10 seconds
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
      if (this.checkDependencies()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error('Required dependencies failed to load');
  },

  /**
   * Check if all dependencies are available
   * @returns {boolean} Whether all dependencies are loaded
   */
  checkDependencies() {
    return !!(
      window.DevPulseConfig &&
      window.Utils &&
      window.DevPulseAPI &&
      window.DevPulseUI &&
      window.DevPulseCharts
    );
  },

  /**
   * Initialize all application modules
   */
  async initializeModules() {
    // Modules should already be initialized, but ensure they're ready
    if (window.DevPulseConfig && !window.DevPulseConfig.isInitialized) {
      window.DevPulseConfig.init();
    }
    
    if (window.DevPulseUI && !window.DevPulseUI.isInitialized) {
      window.DevPulseUI.init();
    }
    
    if (window.DevPulseCharts && !window.DevPulseCharts.isInitialized) {
      window.DevPulseCharts.init();
    }
  },

  /**
   * Setup application-specific functionality
   */
  setupApplication() {
    // Load user preferences
    this.loadUserPreferences();
    
    // Setup error handling
    this.setupErrorHandling();
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring();
    
    // Setup analytics (if enabled)
    this.setupAnalytics();
    
    // Initialize analytics toggle
    this.initAnalyticsToggle();
    
    // Initialize 3D visualization
    this.init3DVisualization();
    
    // Initialize search history
    this.initSearchHistory();
    
    // Initialize repository comparison
    this.initRepoComparison();
    
    // Restore previous session
    this.restorePreviousSession();
  },

  // ================================
  // USER DATA LOADING
  // ================================
  
  /**
   * Load user data for given username
   * @param {string} username - GitHub username
   */
  async loadUserData(username) {
    if (!username || typeof username !== 'string') {
      throw new Error('Invalid username provided');
    }

    username = username.trim();
    
    if (!window.Utils.validateGitHubUsername(username)) {
      throw new Error('Invalid GitHub username format');
    }

    this.loadingState = true;
    this.currentUsername = username;
    
    // Add to search history
    this.addToSearchHistory(username);
    
    try {
      console.log(`📊 Loading data for ${username}...`);
      
      // Show loading state
      window.DevPulseUI.showLoadingState();
      
      // Clear previous data
      this.currentUserData = null;
      
      // Load all data in parallel for better performance
      const [profile, repositories, events] = await Promise.all([
        window.DevPulseAPI.getUserProfile(username),
        window.DevPulseAPI.getUserRepositories(username, { 
          per_page: 100, 
          sort: 'updated',
          direction: 'desc'
        }),
        window.DevPulseAPI.getUserEvents(username).catch((error) => {
          console.warn('⚠️ Failed to load events:', error);
          return []; // Return empty array if events fail
        })
      ]);
      
      console.log('📊 Loaded data summary:');
      console.log('- Profile:', profile?.login || 'N/A');
      console.log('- Repositories:', repositories?.length || 0);
      console.log('- Events:', events?.length || 0);
      console.log('- Sample event:', events?.[0] || 'No events');
      
      // Aggregate language statistics
      const languageStats = window.DevPulseAPI.aggregateLanguageStats(repositories);
      
      // Generate contribution data
      const contributionData = window.DevPulseAPI.generateContributionCalendar(events);
      
      // Compile all user data
      this.currentUserData = {
        profile,
        repositories,
        events,
        languageStats,
        contributionData,
        loadedAt: new Date().toISOString()
      };
      
      // Render the dashboard
      await this.renderDashboard();
      
      // Save to session
      this.saveUserSession();
      
      // Show success
      window.DevPulseUI.showToast(`Successfully loaded data for ${username}`, 'success');
      
      console.log(`✅ Data loaded for ${username}`);
      
    } catch (error) {
      console.error(`❌ Failed to load data for ${username}:`, error);
      
      // Handle specific error types
      if (error.message.includes('User not found')) {
        throw new Error(`GitHub user "${username}" not found. Please check the username and try again.`);
      } else if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error(`Failed to load user data: ${error.message}`);
      }
      
    } finally {
      this.loadingState = false;
    }
  },

  // ================================
  // DASHBOARD RENDERING
  // ================================
  
  /**
   * Render the complete dashboard
   */
  async renderDashboard() {
    if (!this.currentUserData) {
      throw new Error('No user data available to render');
    }

    const { profile, repositories, events, languageStats, contributionData } = this.currentUserData;
    
    try {
      console.log('🎨 Rendering dashboard...');
      console.log('Data available:', { 
        profile: !!profile, 
        repositories: repositories?.length, 
        events: events?.length,
        languageStats: !!languageStats,
        contributionData: !!contributionData
      });
      
      // Render profile section
      try {
        console.log('📝 Starting profile render...');
        this.renderProfile(profile);
        console.log('✅ Profile rendered successfully');
      } catch (error) {
        console.error('❌ Profile rendering failed:', error);
      }
      
      // Render statistics cards
      try {
        console.log('📊 Starting statistics render...');
        this.renderStatistics(profile, repositories);
        console.log('✅ Statistics rendered successfully');
      } catch (error) {
        console.error('❌ Statistics rendering failed:', error);
      }
      
      // Render repositories
      try {
        console.log('📁 Starting repositories render...');
        this.renderRepositories(repositories);
        console.log('✅ Repositories section rendered successfully');
      } catch (error) {
        console.error('❌ Repositories rendering failed:', error);
      }
      
      // Render charts
      try {
        console.log('📈 Starting charts render...');
        await this.renderCharts(languageStats, events, repositories, contributionData);
        console.log('✅ Charts rendered successfully');
      } catch (error) {
        console.error('❌ Charts rendering failed:', error);
      }
      
      // Render activity timeline
      try {
        console.log('🕒 Starting activity timeline render...');
        this.renderActivityTimeline(events);
        console.log('✅ Activity timeline rendered successfully');
      } catch (error) {
        console.error('❌ Activity timeline rendering failed:', error);
      }

      // Update activity statistics
      try {
        console.log('📊 Updating activity statistics...');
        this.updateActivityStats(events, repositories);
        console.log('✅ Activity statistics updated successfully');
      } catch (error) {
        console.error('❌ Activity statistics update failed:', error);
      }
      
      // Show dashboard
      console.log('🎬 Showing dashboard...');
      window.DevPulseUI.showDashboard();
      
      // Setup enhanced activity features
      setTimeout(() => {
        try {
          console.log('🎛️ Setting up enhanced activity features...');
          this.setupActivityFilters();
          this.setupActivitySearch();
          this.setupActivityExport();
          this.setupKeyboardShortcuts();
          console.log('✅ Enhanced activity features setup complete');
        } catch (error) {
          console.error('❌ Activity features setup failed:', error);
        }
      }, 500);

      // Generate and display AI insights
      setTimeout(async () => {
        try {
          console.log('🤖 Generating AI-powered insights...');
          const insights = await window.DevPulseAI.generateInsights(this.currentUserData);
          window.DevPulseAIUI.renderAIInsights(insights, this.currentUsername);
          console.log('✅ AI insights rendered successfully');
        } catch (error) {
          console.error('❌ AI insights generation failed:', error);
        }
      }, 1000);
      
      // Force visibility of dashboard sections
      const dashboardSections = document.querySelectorAll('.dashboard-section');
      dashboardSections.forEach(section => {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
      });
      
      console.log('Dashboard sections found:', dashboardSections.length);
      
      // Setup interactions
      this.setupDashboardInteractions();
      
      console.log('✅ Dashboard rendered successfully');
      
    } catch (error) {
      console.error('❌ Dashboard rendering failed:', error);
      throw new Error(`Failed to render dashboard: ${error.message}`);
    }
  },

  /**
   * Render user profile section
   * @param {Object} profile - User profile data
   */
  renderProfile(profile) {
    console.log('🎭 Rendering profile section...');
    const profileSection = document.querySelector('.profile-section .profile-content');
    console.log('Profile section element:', profileSection);
    if (!profileSection) {
      console.error('❌ Profile section not found!');
      return;
    }

    const joinDate = new Date(profile.created_at);
    const memberSince = window.Utils.formatRelativeTime(joinDate);
    
    profileSection.innerHTML = `
      <div class="profile-avatar">
        <img src="${profile.avatar_url}" alt="${profile.name || profile.login}" class="avatar-image">
        <div class="avatar-ring"></div>
      </div>
      <div class="profile-info">
        <h1 class="profile-name">${profile.name || profile.login}</h1>
        <p class="profile-username">@${profile.login}</p>
        ${profile.bio ? `<p class="profile-bio">${window.Utils.escapeHtml(profile.bio)}</p>` : ''}
        <div class="profile-details">
          ${profile.location ? `
            <div class="profile-detail">
              <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>${window.Utils.escapeHtml(profile.location)}</span>
            </div>
          ` : ''}
          ${profile.company ? `
            <div class="profile-detail">
              <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                <rect x="2" y="8" width="20" height="12" rx="2"/>
              </svg>
              <span>${window.Utils.escapeHtml(profile.company)}</span>
            </div>
          ` : ''}
          <div class="profile-detail">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M8 2v4"/>
              <path d="M16 2v4"/>
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M3 10h18"/>
            </svg>
            <span>Joined ${memberSince}</span>
          </div>
        </div>
        ${profile.blog ? `
          <a href="${profile.blog.startsWith('http') ? profile.blog : 'https://' + profile.blog}" 
             target="_blank" rel="noopener noreferrer" class="profile-link">
            <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            Visit Website
          </a>
        ` : ''}
      </div>
      <div class="profile-stats">
        <div class="profile-stat">
          <span class="stat-value" data-animate-number="${profile.followers}">${window.Utils.formatNumber(profile.followers)}</span>
          <span class="stat-label">Followers</span>
        </div>
        <div class="profile-stat">
          <span class="stat-value" data-animate-number="${profile.following}">${window.Utils.formatNumber(profile.following)}</span>
          <span class="stat-label">Following</span>
        </div>
        <div class="profile-stat">
          <span class="stat-value" data-animate-number="${profile.public_repos}">${window.Utils.formatNumber(profile.public_repos)}</span>
          <span class="stat-label">Repositories</span>
        </div>
      </div>
    `;

    console.log('✅ Profile section rendered successfully');
    // Animate numbers
    this.animateStatNumbers();
  },

  /**
   * Render statistics cards
   * @param {Object} profile - User profile
   * @param {Array} repositories - User repositories
   */
  renderStatistics(profile, repositories) {
    console.log('📊 Rendering statistics section...');
    const statsGrid = document.getElementById('stats-grid');
    console.log('Stats grid element:', statsGrid);
    console.log('Repositories data:', repositories);
    
    if (!statsGrid) {
      console.error('❌ Stats grid not found!');
      return;
    }

    // Calculate statistics
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
    const publicRepos = repositories.filter(repo => !repo.fork).length;
    const forkedRepos = repositories.filter(repo => repo.fork).length;

    console.log('Calculated stats:', { totalStars, totalForks, publicRepos, forkedRepos });

    const stats = [
      {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>`,
        label: 'Total Stars',
        value: window.Utils.formatNumber(totalStars),
        change: this.calculateStarsGrowth(repositories),
        changeType: 'positive'
      },
      {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6"/>
          <path d="M12 17v6"/>
          <path d="M4.22 4.22l4.24 4.24"/>
          <path d="M15.54 15.54l4.24 4.24"/>
          <path d="M1 12h6"/>
          <path d="M17 12h6"/>
          <path d="M4.22 19.78l4.24-4.24"/>
          <path d="M15.54 8.46l4.24-4.24"/>
        </svg>`,
        label: 'Total Forks',
        value: window.Utils.formatNumber(totalForks),
        change: this.calculateForksGrowth(repositories),
        changeType: 'positive'
      },
      {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>`,
        label: 'Public Repos',
        value: window.Utils.formatNumber(publicRepos),
        change: `${forkedRepos} forked`,
        changeType: 'neutral'
      },
      {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>`,
        label: 'Followers',
        value: window.Utils.formatNumber(profile.followers),
        change: `${window.Utils.formatNumber(profile.following)} following`,
        changeType: 'neutral'
      }
    ];

    statsGrid.innerHTML = stats.map((stat, index) => `
      <div class="stats-card animate-on-scroll" data-delay="${index * 100}">
        <div class="stats-icon ${stat.changeType}">
          ${stat.icon}
        </div>
        <div class="stats-content">
          <div class="stats-value" data-animate-number="${stat.value.replace(/[^0-9]/g, '')}">${stat.value}</div>
          <div class="stats-label">${stat.label}</div>
          <div class="stats-change ${stat.changeType}">${stat.change}</div>
        </div>
      </div>
    `).join('');
    
    console.log('✅ Statistics section rendered successfully');
  },

  /**
   * Render repositories grid
   * @param {Array} repositories - Repository data
   * @param {string} sortBy - Sort criteria
   */
  renderRepositories(repositories, sortBy = 'stars') {
    console.log('📁 Rendering repositories section...');
    const repositoriesGrid = document.getElementById('repositories-grid');
    console.log('Repositories grid element:', repositoriesGrid);
    console.log('Repositories count:', repositories ? repositories.length : 0);
    
    if (!repositoriesGrid || !repositories) {
      console.error('❌ Repositories grid not found or no repositories data!');
      return;
    }

    // Sort repositories
    const sortedRepos = this.sortRepositories(repositories, sortBy);
    const displayRepos = sortedRepos.slice(0, this.config.get('ui.maxRepositories', 12));

    console.log('Displaying repositories:', displayRepos.length);

    repositoriesGrid.innerHTML = displayRepos.map((repo, index) => `
      <div class="repository-card animate-on-scroll" data-delay="${index * 50}">
        <div class="repo-header">
          <h3 class="repo-name">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
              ${repo.name}
            </a>
            ${repo.fork ? '<span class="repo-fork-badge">Fork</span>' : ''}
          </h3>
          ${repo.description ? `<p class="repo-description">${window.Utils.escapeHtml(repo.description)}</p>` : ''}
        </div>
        <div class="repo-stats">
          <div class="repo-stat">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>${window.Utils.formatNumber(repo.stargazers_count)}</span>
          </div>
          <div class="repo-stat">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6"/>
              <path d="M12 17v6"/>
              <path d="M4.22 4.22l4.24 4.24"/>
              <path d="M15.54 15.54l4.24 4.24"/>
              <path d="M1 12h6"/>
              <path d="M17 12h6"/>
              <path d="M4.22 19.78l4.24-4.24"/>
              <path d="M15.54 8.46l4.24-4.24"/>
            </svg>
            <span>${window.Utils.formatNumber(repo.forks_count)}</span>
          </div>
          ${repo.language ? `
            <div class="repo-language">
              <span class="language-color" style="background-color: ${window.Utils.getLanguageColors()[repo.language] || '#666'}"></span>
              <span class="language-name">${repo.language}</span>
            </div>
          ` : ''}
        </div>
        <div class="repo-footer">
          <span class="repo-updated">Updated ${window.Utils.formatRelativeTime(new Date(repo.updated_at))}</span>
          <button class="repo-compare-btn" title="Select for comparison">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 11H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"/>
              <path d="M17 7h-2a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
    `).join('');
    
    console.log('✅ Repositories section rendered successfully');
  },

  /**
   * Render all charts
   * @param {Array} languageStats - Language statistics
   * @param {Array} events - User events
   * @param {Array} repositories - Repositories
   * @param {Array} contributionData - Contribution data
   */
  async renderCharts(languageStats, events, repositories, contributionData) {
    if (!window.DevPulseCharts.isChartJsAvailable()) {
      console.warn('Chart.js not available, skipping chart rendering');
      return;
    }

    try {
      // Language statistics chart
      if (languageStats && languageStats.length > 0) {
        window.DevPulseCharts.createLanguageChart('language-chart', languageStats);
      }

      // Activity timeline chart
      if (events && events.length > 0) {
        window.DevPulseCharts.createActivityChart('activity-chart', events);
      }

      // Repository statistics chart
      if (repositories && repositories.length > 0) {
        window.DevPulseCharts.createRepositoryChart('repository-chart', repositories);
      }

      // Contribution calendar
      if (contributionData && contributionData.length > 0) {
        window.DevPulseCharts.createContributionCalendar('contribution-calendar', contributionData);
      }

    } catch (error) {
      console.error('Chart rendering error:', error);
    }
  },

  /**
   * Render activity timeline
   * @param {Array} events - User events
   */
  renderActivityTimeline(events) {
    console.log('🕒 Rendering activity timeline...');
    const timelineContainer = document.getElementById('activity-timeline');
    console.log('Timeline container:', timelineContainer);
    console.log('Events data:', events);
    console.log('Events length:', events?.length);
    
    if (!timelineContainer) {
      console.error('❌ Activity timeline container not found!');
      return;
    }
    
    // Ensure container is visible
    timelineContainer.style.display = 'block';
    timelineContainer.style.visibility = 'visible';
    timelineContainer.style.opacity = '1';
    
    if (!events || events.length === 0) {
      console.log('📭 No events available for timeline - showing empty state');
      timelineContainer.innerHTML = `
        <div class="timeline-header">
          <h3>Recent Activity</h3>
          <div class="timeline-stats">
            <span class="stat-badge">0 events</span>
          </div>
        </div>
        <div class="timeline-content">
          <div class="timeline-empty">
            <div class="empty-state">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 12l2 2 4-4"/>
                </svg>
              </div>
              <h4>No Recent Activity</h4>
              <p>This user's recent public activity will appear here.</p>
              <p class="hint">Activity includes commits, pull requests, issues, and repository events.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Get recent events (last 10)
    const recentEvents = events.slice(0, 10);
    console.log('Displaying events:', recentEvents.length);
    console.log('Sample event:', recentEvents[0]);

    timelineContainer.innerHTML = `
      <div class="timeline-header">
        <h3>Recent Activity (${recentEvents.length} events)</h3>
      </div>
      <div class="timeline-content">
        ${recentEvents.map((event, index) => {
          try {
            return `
              <div class="timeline-item animate-on-scroll" data-event-type="${event.type.toLowerCase()}" data-created-at="${event.created_at}" data-delay="${index * 100}">
                <div class="timeline-icon ${this.getEventTypeClass(event.type)}">
                  ${this.getEventIcon(event.type)}
                </div>
                <div class="timeline-info">
                  <div class="timeline-title">${this.getEventTitle(event)}</div>
                  <div class="timeline-description">${this.getEventDescription(event)}</div>
                  <div class="timeline-time">${window.Utils.formatRelativeTime(new Date(event.created_at))}</div>
                </div>
              </div>
            `;
          } catch (error) {
            console.error('Error rendering event:', event, error);
            return `
              <div class="timeline-item">
                <div class="timeline-icon">⚠️</div>
                <div class="timeline-info">
                  <div class="timeline-title">Event (${event.type || 'Unknown'})</div>
                  <div class="timeline-description">Activity in ${event.repo?.name || 'repository'}</div>
                  <div class="timeline-time">${window.Utils.formatRelativeTime(new Date(event.created_at))}</div>
                </div>
              </div>
            `;
          }
        }).join('')}
      </div>
    `;
    
    console.log('✅ Activity timeline rendered successfully with', recentEvents.length, 'events');
  },

  /**
   * Update activity statistics counters
   * @param {Array} events - User events 
   * @param {Array} repositories - User repositories
   */
  updateActivityStats(events = [], repositories = []) {
    console.log('📊 Calculating activity statistics...');
    
    // Calculate stats from events
    const stats = {
      commits: 0,
      pullRequests: 0,
      issues: 0,
      repositories: repositories.length || 0
    };

    // Count different types of events
    events.forEach(event => {
      switch (event.type) {
        case 'PushEvent':
          stats.commits += event.payload?.commits?.length || 1;
          break;
        case 'PullRequestEvent':
          stats.pullRequests++;
          break;
        case 'IssuesEvent':
          stats.issues++;
          break;
        case 'CreateEvent':
          if (event.payload?.ref_type === 'repository') {
            // Don't double count repos, already counted above
          }
          break;
      }
    });

    // Update DOM elements with animation
    this.animateStatUpdate('commits-count', stats.commits);
    this.animateStatUpdate('prs-count', stats.pullRequests);
    this.animateStatUpdate('issues-count', stats.issues);
    this.animateStatUpdate('repos-count', stats.repositories);

    console.log('📊 Activity stats calculated:', stats);
  },

  /**
   * Test function for debugging activity timeline
   * Can be called from browser console: window.DevPulseApp.testActivity('username')
   */
  async testActivity(username = 'octocat') {
    console.log(`🧪 Testing activity for ${username}...`);
    
    try {
      const events = await window.DevPulseAPI.getUserEvents(username);
      console.log('📦 Raw events data:', events);
      console.log('📊 Events count:', events?.length || 0);
      
      if (events && events.length > 0) {
        console.log('📝 Sample event structure:', events[0]);
        console.log('🎯 Event types found:', [...new Set(events.map(e => e.type))]);
      }
      
      // Test rendering
      this.renderActivityTimeline(events);
      this.updateActivityStats(events, []);
      
      return events;
    } catch (error) {
      console.error('❌ Test failed:', error);
      return null;
    }
  },
  animateStatUpdate(elementId, finalValue) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`❌ Element not found: ${elementId}`);
      return;
    }

    const startValue = 0;
    const duration = 1000; // 1 second
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Eased animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (finalValue - startValue) * easeOut);
      
      element.textContent = currentValue.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = finalValue.toLocaleString();
      }
    };

    requestAnimationFrame(animate);
  },

  /**
   * Setup enhanced activity timeline filters with advanced features
   */
  setupActivityFilters() {
    const filters = document.querySelectorAll('.activity-filter');
    const periodSelect = document.getElementById('activity-period');
    this.currentFilter = 'all';
    this.currentPeriod = 30;
    this.allEvents = []; // Store all events for filtering
    
    // Store original events data
    if (this.currentUserData?.events) {
      this.allEvents = [...this.currentUserData.events];
    }
    
    // Handle filter clicks with enhanced functionality
    filters.forEach(filter => {
      filter.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active filter
        filters.forEach(f => {
          f.classList.remove('active');
          f.setAttribute('aria-pressed', 'false');
        });
        filter.classList.add('active');
        filter.setAttribute('aria-pressed', 'true');
        
        // Store current filter
        const filterType = filter.dataset.filter;
        this.currentFilter = filterType;
        
        // Apply filter with animation
        this.filterActivityTimelineEnhanced(filterType);
        
        // Update statistics for filtered view
        this.updateFilteredStatistics(filterType);
        
        // Add visual feedback
        this.showFilterFeedback(filterType);
      });
    });
    
    // Handle period changes with enhanced functionality
    if (periodSelect) {
      periodSelect.addEventListener('change', (e) => {
        const days = parseInt(e.target.value);
        this.currentPeriod = days;
        this.filterActivityByPeriodEnhanced(days);
        this.updateFilteredStatistics(this.currentFilter, days);
      });
    }
    
    // Add double-click to reset filters
    filters.forEach(filter => {
      filter.addEventListener('dblclick', () => {
        this.resetAllFilters();
      });
    });
  },

  /**
   * Enhanced activity timeline filtering with animations and statistics
   * @param {string} filterType - Filter type (all, commits, repos, issues, prs)
   */
  filterActivityTimelineEnhanced(filterType) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineContainer = document.querySelector('.timeline-list');
    let visibleCount = 0;
    let filteredEvents = [];
    
    // Add loading state
    if (timelineContainer) {
      timelineContainer.style.opacity = '0.6';
      timelineContainer.style.pointerEvents = 'none';
    }
    
    setTimeout(() => {
      timelineItems.forEach((item, index) => {
        const eventType = item.dataset.eventType;
        let shouldShow = true;
        
        if (filterType !== 'all') {
          switch (filterType) {
            case 'commits':
              shouldShow = eventType === 'pushevent';
              break;
            case 'repos':
              shouldShow = eventType === 'createevent';
              break;
            case 'issues':
              shouldShow = eventType === 'issuesevent';
              break;
            case 'prs':
              shouldShow = eventType === 'pullrequestevent';
              break;
          }
        }
        
        if (shouldShow) {
          item.style.display = 'flex';
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          
          // Animate in with stagger
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.style.transition = 'all 0.3s ease-out';
          }, index * 50);
          
          visibleCount++;
          
          // Track filtered events for statistics
          const eventData = this.getEventDataFromItem(item);
          if (eventData) filteredEvents.push(eventData);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(-20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
      
      // Update header with count and filter info
      this.updateTimelineHeader(visibleCount, filterType);
      
      // Restore container state
      if (timelineContainer) {
        timelineContainer.style.opacity = '1';
        timelineContainer.style.pointerEvents = 'auto';
      }
      
      // Store filtered events for statistics
      this.currentFilteredEvents = filteredEvents;
      
    }, 100);
  },

  /**
   * Enhanced period filtering with date-based logic
   * @param {number} days - Number of days to show
   */
  filterActivityByPeriodEnhanced(days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    let visibleCount = 0;
    
    timelineItems.forEach((item, index) => {
      const createdAt = item.dataset.createdAt;
      if (!createdAt) {
        // If no date data, show all items
        item.style.display = 'flex';
        visibleCount++;
        return;
      }
      
      const eventDate = new Date(createdAt);
      const shouldShow = eventDate >= cutoffDate;
      
      if (shouldShow) {
        // Also check current filter
        const eventType = item.dataset.eventType;
        let matchesFilter = true;
        
        if (this.currentFilter !== 'all') {
          switch (this.currentFilter) {
            case 'commits':
              matchesFilter = eventType === 'pushevent';
              break;
            case 'repos':
              matchesFilter = eventType === 'createevent';
              break;
            case 'issues':
              matchesFilter = eventType === 'issuesevent';
              break;
            case 'prs':
              matchesFilter = eventType === 'pullrequestevent';
              break;
          }
        }
        
        if (matchesFilter) {
          item.style.display = 'flex';
          item.style.opacity = '1';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      } else {
        item.style.display = 'none';
        item.style.opacity = '0';
      }
    });
    
    this.updateTimelineHeader(visibleCount, this.currentFilter, days);
  },

  /**
   * Update timeline header with filter information
   * @param {number} visibleCount - Number of visible items
   * @param {string} filterType - Current filter type
   * @param {number} days - Period in days (optional)
   */
  updateTimelineHeader(visibleCount, filterType, days = null) {
    const headerElement = document.querySelector('.timeline-header h3');
    if (!headerElement) return;
    
    let filterText = filterType === 'all' ? 'All Activity' : 
                    filterType === 'commits' ? 'Commits' :
                    filterType === 'repos' ? 'Repository Events' :
                    filterType === 'issues' ? 'Issues' :
                    filterType === 'prs' ? 'Pull Requests' : 'Activity';
    
    let periodText = days ? ` (Last ${days} days)` : '';
    
    headerElement.innerHTML = `
      ${filterText}${periodText} 
      <span class="activity-count">${visibleCount} events</span>
    `;
  },

  /**
   * Update statistics based on filtered view
   * @param {string} filterType - Current filter type
   * @param {number} days - Period in days (optional)
   */
  updateFilteredStatistics(filterType, days = null) {
    if (!this.allEvents || this.allEvents.length === 0) return;
    
    let filteredEvents = [...this.allEvents];
    
    // Apply period filter
    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.created_at) >= cutoffDate
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filteredEvents = filteredEvents.filter(event => {
        switch (filterType) {
          case 'commits':
            return event.type === 'PushEvent';
          case 'repos':
            return event.type === 'CreateEvent';
          case 'issues':
            return event.type === 'IssuesEvent';
          case 'prs':
            return event.type === 'PullRequestEvent';
          default:
            return true;
        }
      });
    }
    
    // Calculate filtered statistics
    const stats = {
      commits: 0,
      pullRequests: 0,
      issues: 0,
      repositories: this.currentUserData?.repositories?.length || 0
    };

    filteredEvents.forEach(event => {
      switch (event.type) {
        case 'PushEvent':
          stats.commits += event.payload?.commits?.length || 1;
          break;
        case 'PullRequestEvent':
          stats.pullRequests++;
          break;
        case 'IssuesEvent':
          stats.issues++;
          break;
      }
    });
    
    // Update the statistics with animation
    this.animateStatUpdate('commits-count', stats.commits);
    this.animateStatUpdate('prs-count', stats.pullRequests);
    this.animateStatUpdate('issues-count', stats.issues);
    this.animateStatUpdate('repos-count', stats.repositories);
    
    // Show filter summary
    this.showFilterSummary(filteredEvents.length, filterType, days);
  },

  /**
   * Show visual feedback for filter application
   * @param {string} filterType - Applied filter type
   */
  showFilterFeedback(filterType) {
    const filterName = filterType === 'all' ? 'All Events' : 
                      filterType === 'commits' ? 'Commits' :
                      filterType === 'repos' ? 'Repositories' :
                      filterType === 'issues' ? 'Issues' :
                      filterType === 'prs' ? 'Pull Requests' : 'Events';
    
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.className = 'filter-feedback';
    feedback.textContent = `Showing: ${filterName}`;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-primary);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(feedback);
    
    // Animate in
    setTimeout(() => {
      feedback.style.opacity = '1';
      feedback.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      feedback.style.opacity = '0';
      feedback.style.transform = 'translateX(100px)';
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.parentNode.removeChild(feedback);
        }
      }, 300);
    }, 2000);
  },

  /**
   * Show filter summary information
   * @param {number} count - Number of filtered events
   * @param {string} filterType - Filter type
   * @param {number} days - Period in days
   */
  showFilterSummary(count, filterType, days) {
    const summaryElement = document.querySelector('.filter-summary');
    if (!summaryElement) {
      // Create summary element if it doesn't exist
      const summary = document.createElement('div');
      summary.className = 'filter-summary';
      summary.style.cssText = `
        padding: 8px 12px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        font-size: 12px;
        color: var(--color-text-secondary);
        margin-top: 8px;
      `;
      
      const timelineHeader = document.querySelector('.timeline-header');
      if (timelineHeader) {
        timelineHeader.appendChild(summary);
      }
    }
    
    const summary = document.querySelector('.filter-summary');
    if (summary) {
      let text = `${count} events`;
      if (filterType !== 'all') {
        text += ` filtered by ${filterType}`;
      }
      if (days) {
        text += ` in last ${days} days`;
      }
      summary.textContent = text;
    }
  },

  /**
   * Reset all filters to default state
   */
  resetAllFilters() {
    // Reset filter buttons
    const filters = document.querySelectorAll('.activity-filter');
    filters.forEach(f => {
      f.classList.remove('active');
      f.setAttribute('aria-pressed', 'false');
    });
    
    // Set 'all' filter as active
    const allFilter = document.querySelector('[data-filter="all"]');
    if (allFilter) {
      allFilter.classList.add('active');
      allFilter.setAttribute('aria-pressed', 'true');
    }
    
    // Reset period select
    const periodSelect = document.getElementById('activity-period');
    if (periodSelect) {
      periodSelect.value = '30';
    }
    
    // Reset internal state
    this.currentFilter = 'all';
    this.currentPeriod = 30;
    
    // Show all events
    this.filterActivityTimelineEnhanced('all');
    this.updateFilteredStatistics('all', 30);
    
    // Show reset feedback
    this.showFilterFeedback('all');
  },

  /**
   * Get event data from timeline item
   * @param {Element} item - Timeline item element
   * @returns {Object|null} Event data
   */
  getEventDataFromItem(item) {
    const eventType = item.dataset.eventType;
    const createdAt = item.dataset.createdAt;
    
    if (!eventType || !createdAt) return null;
    
    return {
      type: eventType,
      created_at: createdAt
    };
  },

  /**
   * Setup activity search functionality
   */
  setupActivitySearch() {
    // Create search input if it doesn't exist
    const activityControls = document.querySelector('.activity-controls');
    if (!activityControls) return;
    
    // Check if search already exists
    if (document.getElementById('activity-search')) return;
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'activity-search-container';
    searchContainer.innerHTML = `
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input 
          type="text" 
          id="activity-search" 
          placeholder="Search activity..."
          class="activity-search-input"
          autocomplete="off"
        />
        <button id="clear-search" class="clear-search-btn" style="display: none;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `;
    
    activityControls.appendChild(searchContainer);
    
    const searchInput = document.getElementById('activity-search');
    const clearBtn = document.getElementById('clear-search');
    let searchTimeout;
    
    // Handle search input
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      
      // Show/hide clear button
      clearBtn.style.display = query ? 'flex' : 'none';
      
      // Debounce search
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.searchActivityTimeline(query);
      }, 300);
    });
    
    // Handle clear button
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      this.searchActivityTimeline('');
    });
    
    // Handle Enter key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        this.searchActivityTimeline(query);
      }
    });
  },

  /**
   * Setup activity export functionality
   */
  setupActivityExport() {
    const activitySection = document.querySelector('.activity-section');
    if (!activitySection) return;
    
    // Add export button to activity header
    const sectionHeader = activitySection.querySelector('.section-header');
    if (!sectionHeader) return;
    
    const exportBtn = document.createElement('button');
    exportBtn.className = 'export-activity-btn';
    exportBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Export
    `;
    exportBtn.title = 'Export activity data';
    
    sectionHeader.appendChild(exportBtn);
    
    exportBtn.addEventListener('click', () => {
      this.exportActivityData();
    });
  },

  /**
   * Setup keyboard shortcuts for activity filters
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Only activate shortcuts when not typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Alt + number keys for quick filter switching
      if (e.altKey && !e.shiftKey && !e.ctrlKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.activateFilter('all');
            break;
          case '2':
            e.preventDefault();
            this.activateFilter('commits');
            break;
          case '3':
            e.preventDefault();
            this.activateFilter('repos');
            break;
          case '4':
            e.preventDefault();
            this.activateFilter('issues');
            break;
          case '5':
            e.preventDefault();
            this.activateFilter('prs');
            break;
          case 'r':
          case 'R':
            e.preventDefault();
            this.resetAllFilters();
            break;
          case 'e':
          case 'E':
            e.preventDefault();
            this.exportActivityData();
            break;
          case 's':
          case 'S':
            e.preventDefault();
            const searchInput = document.getElementById('activity-search');
            if (searchInput) {
              searchInput.focus();
            }
            break;
        }
      }
    });
  },

  // ================================
  // UTILITY METHODS
  // ================================
  
  /**
   * Sort repositories by given criteria
   * @param {Array} repositories - Repository array
   * @param {string} sortBy - Sort criteria
   * @returns {Array} Sorted repositories
   */
  sortRepositories(repositories, sortBy) {
    const sortFunctions = {
      stars: (a, b) => b.stargazers_count - a.stargazers_count,
      forks: (a, b) => b.forks_count - a.forks_count,
      updated: (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
      name: (a, b) => a.name.localeCompare(b.name),
      size: (a, b) => b.size - a.size
    };

    return [...repositories].sort(sortFunctions[sortBy] || sortFunctions.stars);
  },

  /**
   * Animate statistic numbers
   */
  animateStatNumbers() {
    const elements = document.querySelectorAll('[data-animate-number]');
    elements.forEach(element => {
      const finalValue = parseInt(element.dataset.animateNumber) || 0;
      window.Utils.animateCounter(element, finalValue, 1500);
    });
  },

  /**
   * Calculate stars growth rate
   * @param {Array} repositories - Repository data
   * @returns {string} Growth description
   */
  calculateStarsGrowth(repositories) {
    // Simple implementation - could be enhanced with historical data
    const recentRepos = repositories.filter(repo => {
      const daysSinceUpdate = (Date.now() - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24);
      return daysSinceUpdate <= 30;
    });
    
    if (recentRepos.length > 0) {
      return `+${recentRepos.length} active repos`;
    }
    return 'No recent activity';
  },

  /**
   * Calculate forks growth rate
   * @param {Array} repositories - Repository data
   * @returns {string} Growth description
   */
  calculateForksGrowth(repositories) {
    const forkedRepos = repositories.filter(repo => repo.fork);
    return `${forkedRepos.length} forked repos`;
  },

  /**
   * Get event type CSS class
   * @param {string} eventType - GitHub event type
   * @returns {string} CSS class
   */
  getEventTypeClass(eventType) {
    const typeClasses = {
      'PushEvent': 'event-push',
      'IssuesEvent': 'event-issue',
      'PullRequestEvent': 'event-pr',
      'CreateEvent': 'event-create',
      'WatchEvent': 'event-watch',
      'ForkEvent': 'event-fork'
    };
    return typeClasses[eventType] || 'event-default';
  },

  /**
   * Get event icon
   * @param {string} eventType - GitHub event type
   * @returns {string} SVG icon
   */
  getEventIcon(eventType) {
    const icons = {
      'PushEvent': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>`,
      'IssuesEvent': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>`,
      'PullRequestEvent': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="18" cy="18" r="3"/>
        <circle cx="6" cy="6" r="3"/>
        <path d="M18 6V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1"/>
        <path d="M18 19v-1a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1"/>
        <line x1="8" y1="6" x2="8" y2="18"/>
      </svg>`
    };
    return icons[eventType] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10"/>
    </svg>`;
  },

  /**
   * Get event title
   * @param {Object} event - GitHub event
   * @returns {string} Event title
   */
  getEventTitle(event) {
    const titles = {
      'PushEvent': `Pushed to ${event.repo.name}`,
      'IssuesEvent': `${event.payload.action} issue in ${event.repo.name}`,
      'PullRequestEvent': `${event.payload.action} pull request in ${event.repo.name}`,
      'CreateEvent': `Created ${event.payload.ref_type} in ${event.repo.name}`,
      'WatchEvent': `Starred ${event.repo.name}`,
      'ForkEvent': `Forked ${event.repo.name}`
    };
    return titles[event.type] || `Activity in ${event.repo.name}`;
  },

  /**
   * Get event description
   * @param {Object} event - GitHub event
   * @returns {string} Event description
   */
  getEventDescription(event) {
    try {
      switch (event.type) {
        case 'PushEvent':
          const commitCount = event.payload?.commits?.length || 0;
          const commits = event.payload?.commits || [];
          if (commits.length > 0 && commits[0]?.message) {
            return `${commitCount} commit${commitCount !== 1 ? 's' : ''}: ${commits[0].message.substring(0, 60)}${commits[0].message.length > 60 ? '...' : ''}`;
          }
          return `${commitCount} commit${commitCount !== 1 ? 's' : ''} pushed`;
          
        case 'IssuesEvent':
          const issueTitle = event.payload?.issue?.title;
          const issueAction = event.payload?.action || 'updated';
          const issueNumber = event.payload?.issue?.number;
          if (issueTitle) {
            return `${issueAction} issue #${issueNumber}: ${issueTitle.substring(0, 50)}${issueTitle.length > 50 ? '...' : ''}`;
          }
          return `${issueAction} issue #${issueNumber || 'unknown'}`;
          
        case 'PullRequestEvent':
          const prTitle = event.payload?.pull_request?.title;
          const prAction = event.payload?.action || 'updated';
          const prNumber = event.payload?.pull_request?.number;
          if (prTitle) {
            return `${prAction} pull request #${prNumber}: ${prTitle.substring(0, 50)}${prTitle.length > 50 ? '...' : ''}`;
          }
          return `${prAction} pull request #${prNumber || 'unknown'}`;
          
        case 'CreateEvent':
          const refType = event.payload?.ref_type || 'repository';
          const ref = event.payload?.ref;
          if (ref) {
            return `Created ${refType} "${ref}"`;
          }
          return `Created ${refType}`;
          
        case 'WatchEvent':
          return 'Starred the repository';
          
        case 'ForkEvent':
          const forkName = event.payload?.forkee?.full_name;
          if (forkName) {
            return `Forked to ${forkName}`;
          }
          return 'Forked the repository';
          
        default:
          return `${event.type.replace('Event', '')} activity`;
      }
    } catch (error) {
      console.warn('Error generating event description:', error);
      return 'Repository activity';
    }
  },

  // ================================
  // SESSION MANAGEMENT
  // ================================
  
  /**
   * Save current user session
   */
  saveUserSession() {
    if (this.currentUsername && this.currentUserData) {
      const sessionData = {
        username: this.currentUsername,
        timestamp: Date.now(),
        data: this.currentUserData
      };
      
      window.Utils.setStorage('devpulse-session', JSON.stringify(sessionData));
    }
  },

  /**
   * Load user preferences
   */
  loadUserPreferences() {
    const theme = window.Utils.getStorage('devpulse-theme');
    if (theme && window.DevPulseUI) {
      window.DevPulseUI.applyTheme(theme);
    }
  },

  /**
   * Restore previous session
   */
  restorePreviousSession() {
    if (!this.config.get('features.restoreSession', true)) return;

    try {
      const sessionData = window.Utils.getStorage('devpulse-session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        const maxAge = this.config.get('session.maxAge', 30 * 60 * 1000); // 30 minutes
        
        if (Date.now() - session.timestamp < maxAge) {
          const usernameInput = document.getElementById('username-input');
          if (usernameInput) {
            usernameInput.value = session.username;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to restore session:', error);
    }
  },

  // ================================
  // ERROR HANDLING
  // ================================
  
  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.handleGlobalError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleGlobalError(event.reason);
    });
  },

  /**
   * Handle global application errors
   * @param {Error} error - Error object
   */
  handleGlobalError(error) {
    if (this.config.get('debug.logErrors', true)) {
      console.error('DevPulse Error:', error);
    }

    // Don't show toast for every error to avoid spam
    if (!this.loadingState) {
      window.DevPulseUI?.showToast('An unexpected error occurred', 'error');
    }
  },

  /**
   * Handle initialization errors
   * @param {Error} error - Initialization error
   */
  handleInitializationError(error) {
    document.body.innerHTML = `
      <div class="error-container">
        <div class="error-content">
          <h1>DevPulse Failed to Initialize</h1>
          <p>There was a problem starting the application.</p>
          <details>
            <summary>Error Details</summary>
            <pre>${error.message}</pre>
          </details>
          <button onclick="location.reload()" class="retry-button">
            Reload Application
          </button>
        </div>
      </div>
    `;
  },

  // ================================
  // PERFORMANCE MONITORING
  // ================================
  
  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    if (!this.config.get('features.performanceMonitoring', true)) return;

    // Monitor page load performance
    if (typeof performance !== 'undefined' && performance.timing) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = performance.timing;
          const loadTime = timing.loadEventEnd - timing.navigationStart;
          console.log(`📊 Page load time: ${loadTime}ms`);
        }, 0);
      });
    }
  },

  /**
   * Setup analytics
   */
  setupAnalytics() {
    // Placeholder for analytics integration
    if (this.config.get('features.analytics.enabled', false)) {
      console.log('📈 Analytics tracking enabled');
    }
  },

  /**
   * Initialize analytics section expandable functionality
   */
  initAnalyticsToggle() {
    const toggle = document.getElementById('analytics-toggle');
    const chartsGrid = document.getElementById('charts-grid');
    
    if (toggle && chartsGrid) {
      // Set initial state
      chartsGrid.classList.add('charts-collapsed');
      
      toggle.addEventListener('click', () => {
        const isExpanded = chartsGrid.classList.contains('charts-expanded');
        
        if (isExpanded) {
          // Collapse
          chartsGrid.classList.remove('charts-expanded');
          chartsGrid.classList.add('charts-collapsed');
          toggle.classList.remove('expanded');
          toggle.querySelector('.toggle-text').textContent = 'Show More';
          toggle.setAttribute('aria-label', 'Expand Analytics Section');
        } else {
          // Expand
          chartsGrid.classList.remove('charts-collapsed');
          chartsGrid.classList.add('charts-expanded');
          toggle.classList.add('expanded');
          toggle.querySelector('.toggle-text').textContent = 'Show Less';
          toggle.setAttribute('aria-label', 'Collapse Analytics Section');
        }
      });
      
      console.log('✅ Analytics toggle initialized');
    } else {
      console.warn('⚠️ Analytics toggle elements not found');
    }
  },

  /**
   * Initialize 3D visualization functionality
   */
  init3DVisualization() {
    const viz3DButton = document.getElementById('open-3d-viz');
    
    if (viz3DButton) {
      viz3DButton.addEventListener('click', () => {
        this.open3DVisualization();
      });
      
      console.log('✅ 3D Visualization button initialized');
    } else {
      console.warn('⚠️ 3D Visualization button not found');
    }
  },

  /**
   * Open 3D visualization in new window/tab
   */
  open3DVisualization() {
    try {
      // Check if we have user data to pass
      if (!this.currentUserData) {
        window.DevPulseUI?.showToast(
          'Please search for a GitHub user first to view their 3D analytics',
          'warning',
          4000
        );
        return;
      }

      // Create a stylish popup window
      const windowFeatures = [
        'width=1400',
        'height=900',
        'left=' + Math.round((screen.width - 1400) / 2),
        'top=' + Math.round((screen.height - 900) / 2),
        'menubar=no',
        'toolbar=no',
        'location=no',
        'status=no',
        'scrollbars=no',
        'resizable=yes'
      ].join(',');

      // Open 3D visualization window
      const vizWindow = window.open('3d-visualizations.html', '3d-viz', windowFeatures);
      
      if (vizWindow) {
        // Focus the new window
        vizWindow.focus();
        
        // Show success message
        window.DevPulseUI?.showToast(
          '🌌 3D Visualization opened! Explore immersive GitHub analytics.',
          'success',
          3000
        );
        
        console.log('✅ 3D Visualization window opened successfully');
      } else {
        // Fallback - open in same tab
        window.location.href = '3d-visualizations.html';
      }
      
    } catch (error) {
      console.error('❌ Failed to open 3D visualization:', error);
      window.DevPulseUI?.showToast(
        'Failed to open 3D visualization. Please try again.',
        'error',
        4000
      );
    }
  },

  /**
   * Initialize search history functionality
   */
  initSearchHistory() {
    const searchHistory = JSON.parse(window.Utils.getStorage('devpulse-search-history') || '[]');
    const usernameInput = document.getElementById('username-input');
    
    if (usernameInput && searchHistory.length > 0) {
      const datalist = document.createElement('datalist');
      datalist.id = 'search-history';
      
      searchHistory.slice(0, 10).forEach(username => {
        const option = document.createElement('option');
        option.value = username;
        datalist.appendChild(option);
      });
      
      usernameInput.setAttribute('list', 'search-history');
      document.body.appendChild(datalist);
    }
  },

  /**
   * Add username to search history
   */
  addToSearchHistory(username) {
    if (!username) return;
    
    let history = JSON.parse(window.Utils.getStorage('devpulse-search-history') || '[]');
    
    // Remove if already exists
    history = history.filter(item => item !== username);
    
    // Add to beginning
    history.unshift(username);
    
    // Keep only last 10
    history = history.slice(0, 10);
    
    window.Utils.setStorage('devpulse-search-history', JSON.stringify(history));
    this.initSearchHistory(); // Refresh datalist
  },

  /**
   * Initialize repository comparison feature
   */
  initRepoComparison() {
    let selectedRepos = [];
    
    document.addEventListener('click', (e) => {
      // Handle AI Demo Button
      if (e.target.id === 'ai-demo-button') {
        this.handleAIDemoClick();
        return;
      }
      
      // Handle suggestion chips
      if (e.target.closest('.suggestion-chip')) {
        const username = e.target.dataset.username;
        if (username) {
          const usernameInput = document.getElementById('username-input');
          if (usernameInput) {
            usernameInput.value = username;
            this.loadUserData(username);
          }
        }
        return;
      }
      
      if (e.target.closest('.repo-compare-btn')) {
        const repoCard = e.target.closest('.repository-card');
        const repoName = repoCard.querySelector('.repo-name a').textContent;
        
        if (selectedRepos.includes(repoName)) {
          selectedRepos = selectedRepos.filter(name => name !== repoName);
          repoCard.classList.remove('selected-for-comparison');
        } else if (selectedRepos.length < 3) {
          selectedRepos.push(repoName);
          repoCard.classList.add('selected-for-comparison');
        } else {
          window.DevPulseUI?.showToast('You can compare up to 3 repositories at once', 'warning');
        }
        
        this.updateComparisonUI(selectedRepos);
      }
    });
  },

  /**
   * Update comparison UI
   */
  updateComparisonUI(selectedRepos) {
    let compareBtn = document.getElementById('compare-repos-btn');
    
    if (selectedRepos.length > 1) {
      if (!compareBtn) {
        compareBtn = document.createElement('button');
        compareBtn.id = 'compare-repos-btn';
        compareBtn.className = 'compare-repos-btn';
        compareBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 11H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"/>
            <path d="M17 7h-2a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
          </svg>
          Compare Selected (${selectedRepos.length})
        `;
        
        const reposSection = document.getElementById('repositories');
        if (reposSection) {
          reposSection.appendChild(compareBtn);
        }
      } else {
        compareBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 11H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"/>
            <path d="M17 7h-2a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
          </svg>
          Compare Selected (${selectedRepos.length})
        `;
      }
    } else if (compareBtn) {
      compareBtn.remove();
    }
  },

  /**
   * Handle AI Demo Button Click
   */
  async handleAIDemoClick() {
    console.log('🤖 AI Demo button clicked');
    
    // Show loading state
    const button = document.getElementById('ai-demo-button');
    if (button) {
      button.innerHTML = '🔄 Generating AI Insights...';
      button.disabled = true;
    }
    
    // Create mock user data for demo
    const mockUserData = {
      login: 'demo-user',
      name: 'Demo Developer',
      public_repos: 42,
      followers: 156,
      following: 89,
      created_at: '2019-03-15T10:30:00Z',
      bio: 'Full-stack developer passionate about AI and web technologies',
      location: 'San Francisco, CA',
      repositories: [
        { name: 'web-app', language: 'JavaScript', stargazers_count: 23, fork: false, description: 'Modern web application with React' },
        { name: 'ai-chatbot', language: 'Python', stargazers_count: 45, fork: false, description: 'AI-powered chatbot using machine learning' },
        { name: 'mobile-app', language: 'TypeScript', stargazers_count: 12, fork: false, description: 'Cross-platform mobile application' },
        { name: 'data-analysis', language: 'Python', stargazers_count: 67, fork: false, description: 'Data analysis toolkit for researchers' },
        { name: 'game-engine', language: 'C++', stargazers_count: 89, fork: false, description: 'Lightweight 2D game engine' },
        { name: 'api-server', language: 'Node.js', stargazers_count: 34, fork: false, description: 'RESTful API server with authentication' }
      ],
      events: [
        { type: 'PushEvent', created_at: '2024-01-15T14:30:00Z', repo: { name: 'demo-user/web-app' } },
        { type: 'IssuesEvent', created_at: '2024-01-14T10:15:00Z', repo: { name: 'demo-user/ai-chatbot' } },
        { type: 'PullRequestEvent', created_at: '2024-01-13T16:45:00Z', repo: { name: 'demo-user/mobile-app' } },
        { type: 'CreateEvent', created_at: '2024-01-12T09:20:00Z', repo: { name: 'demo-user/data-analysis' } },
        { type: 'PushEvent', created_at: '2024-01-11T20:30:00Z', repo: { name: 'demo-user/game-engine' } },
        { type: 'IssueCommentEvent', created_at: '2024-01-10T13:15:00Z', repo: { name: 'demo-user/api-server' } },
        { type: 'PullRequestReviewEvent', created_at: '2024-01-09T11:45:00Z', repo: { name: 'demo-user/web-app' } },
        { type: 'PushEvent', created_at: '2024-01-08T15:20:00Z', repo: { name: 'demo-user/ai-chatbot' } },
        { type: 'ForkEvent', created_at: '2024-01-07T08:30:00Z', repo: { name: 'demo-user/mobile-app' } },
        { type: 'WatchEvent', created_at: '2024-01-06T17:10:00Z', repo: { name: 'demo-user/data-analysis' } }
      ]
    };
    
    // Show dashboard first
    const heroSection = document.getElementById('hero-section');
    const dashboard = document.getElementById('dashboard');
    
    if (heroSection) heroSection.style.display = 'none';
    if (dashboard) {
      dashboard.style.display = 'block';
      dashboard.style.opacity = '1';
    }
    
    try {
      // Generate AI insights
      if (window.DevPulseAI && window.DevPulseAIUI) {
        const insights = await window.DevPulseAI.generateInsights(mockUserData);
        window.DevPulseAIUI.renderAIInsights(insights, 'demo-user');
        
        // Show success message
        if (window.DevPulseUI && window.DevPulseUI.showToast) {
          window.DevPulseUI.showToast('🤖 AI Insights generated successfully!', 'success');
        }
        
        // Scroll to AI insights section
        setTimeout(() => {
          const aiSection = document.getElementById('ai-insights');
          if (aiSection) {
            aiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
        
      } else {
        throw new Error('AI modules not loaded');
      }
      
    } catch (error) {
      console.error('❌ AI Demo failed:', error);
      if (window.DevPulseUI && window.DevPulseUI.showToast) {
        window.DevPulseUI.showToast('Failed to generate AI insights. Please try again.', 'error');
      }
    }
    
    // Reset button
    if (button) {
      button.innerHTML = '🤖 Demo AI Insights';
      button.disabled = false;
    }
  },

  /**
   * Setup dashboard interactions
   */
  setupDashboardInteractions() {
    // Add any additional dashboard-specific interactions here
    // This method can be extended as needed
  },

  /**
   * Show welcome message
   */
  showWelcomeMessage() {
    if (this.config.get('ui.showWelcomeMessage', true)) {
      window.DevPulseUI?.showToast(
        'Welcome to DevPulse v3.0! Enter a GitHub username to get started.',
        'info',
        4000
      );
    }
  },

  /**
   * Start anime-style tip rotation
   */
  startAnimeTipRotation() {
    const animeTips = [
      '🐱 Nya~ Collecting GitHub data with the power of friendship!',
      '⚡ Power level over 9000! Loading epic repositories...',
      '🌸 Sakura petals carry your data to the cloud~ (◕‿◕)',
      '🚀 Launching friendship rocket to the GitHub galaxy!',
      '🔮 Crystal ball shows... amazing code incoming! ✨',
      '🦄 Unicorns are compiling your analytics magic!',
      '🍜 Ramen-powered servers working hard for you!',
      '🎌 The spirit of coding guides this loading journey~',
      '💫 Shooting stars bring GitHub treasures!',
      '🐾 Cat paws are typing your data story...',
      '🌟 Believe in the heart of the code! ♥',
      '🎮 Loading level: GitHub Analytics Adventure!',
      '🏮 Lanterns light the path to your repositories...',
      '🌙 Moon magic powers the data transformation!',
      '🍃 Wind whispers secrets of your commits...'
    ];

    const tipElement = document.getElementById('loading-tip');
    if (!tipElement) return;

    let currentTipIndex = 0;
    
    // Update tip every 2 seconds
    this.tipInterval = setInterval(() => {
      if (tipElement) {
        const tip = animeTips[currentTipIndex];
        tipElement.innerHTML = `
          <span class="tip-character">🐱</span>
          <span class="tip-text">${tip}</span>
          <span class="tip-character">🐱</span>
        `;
        currentTipIndex = (currentTipIndex + 1) % animeTips.length;
      }
    }, 2000);

    // Set initial tip
    if (tipElement) {
      const initialTip = animeTips[0];
      tipElement.innerHTML = `
        <span class="tip-character">🐱</span>
        <span class="tip-text">${initialTip}</span>
        <span class="tip-character">🐱</span>
      `;
    }
  },

  /**
   * Stop anime tip rotation
   */
  stopAnimeTipRotation() {
    if (this.tipInterval) {
      clearInterval(this.tipInterval);
      this.tipInterval = null;
    }
  }
};

// ================================
// AUTO-INITIALIZATION
// ================================

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.DevPulse.init().catch(console.error);
    });
  } else {
    // DOM already loaded
    window.DevPulse.init().catch(console.error);
  }
}

// Make DevPulse globally available
window.App = window.DevPulse;
