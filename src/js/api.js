/**
 * DevPulse v3.0 - GitHub API Module
 * Handles all GitHub REST API interactions without authentication
 */

window.DevPulseAPI = {
  
  // ================================
  // CONFIGURATION
  // ================================
  
  config: null,
  cache: new Map(),
  requestCount: 0,
  rateLimitRemaining: 60,
  rateLimitReset: null,

  /**
   * Initialize the API module
   */
  init() {
    this.config = window.DevPulseConfig;
    this.setupRequestInterceptor();
    console.log('🔗 DevPulse API initialized');
  },

  /**
   * Check if mock API responses are enabled
   */
  isMockMode() {
    return this.config && this.config.get('testing.mockApiResponses', false);
  },

  /**
   * Setup request interceptor for rate limiting and caching
   */
  setupRequestInterceptor() {
    // Monitor rate limit headers in responses
    this.originalFetch = window.fetch;
  },

  // ================================
  // CORE REQUEST METHODS
  // ================================
  
  /**
   * Make authenticated request to GitHub API
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} API response
   */
  async makeRequest(endpoint, options = {}) {
    const config = this.config;
    const apiUrl = config.get('github.apiUrl', 'https://api.github.com');
    const timeout = config.get('github.timeout', 30000);
    
    const url = endpoint.startsWith('http') ? endpoint : `${apiUrl}${endpoint}`;
    
    // Check cache first
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    if (this.shouldUseCache(cacheKey)) {
      return this.getFromCache(cacheKey);
    }

    // Check rate limits
    await this.checkRateLimit();

    const requestOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'DevPulse-Analytics/3.0',
        ...options.headers
      },
      ...options
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      requestOptions.signal = controller.signal;

      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      // Update rate limit info
      this.updateRateLimit(response);

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the response
      this.setCache(cacheKey, data);
      
      return data;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  },

  /**
   * Make request with retry logic
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} API response
   */
  async makeRequestWithRetry(endpoint, options = {}) {
    const config = this.config;
    const retryConfig = config.get('github.retry', { attempts: 3, delay: 1000, backoffFactor: 2 });
    
    let lastError;
    
    for (let attempt = 0; attempt < retryConfig.attempts; attempt++) {
      try {
        return await this.makeRequest(endpoint, options);
      } catch (error) {
        lastError = error;
        
        // Don't retry on 4xx errors (except 429 - rate limit)
        if (error.message.includes('GitHub API error: 4') && !error.message.includes('429')) {
          throw error;
        }
        
        // Wait before retry
        if (attempt < retryConfig.attempts - 1) {
          const delay = retryConfig.delay * Math.pow(retryConfig.backoffFactor, attempt);
          await this.sleep(delay);
        }
      }
    }
    
    throw lastError;
  },

  // ================================
  // USER DATA METHODS
  // ================================
  
  /**
   * Get user profile information
   * @param {string} username - GitHub username
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile(username) {
    // Return mock data if in test mode
    if (this.isMockMode()) {
      console.log('🧪 Returning mock user profile data for:', username);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      return {
        login: username,
        name: username === 'torvalds' ? 'Linus Torvalds' : username.charAt(0).toUpperCase() + username.slice(1),
        bio: username === 'torvalds' ? 'Creator of Linux and Git' : 'Software Developer',
        company: username === 'torvalds' ? 'Linux Foundation' : 'Tech Company',
        location: username === 'torvalds' ? 'Portland, OR' : 'San Francisco, CA',
        email: null,
        blog: username === 'torvalds' ? 'https://github.com/torvalds' : '',
        twitter: null,
        avatar_url: `https://avatars.githubusercontent.com/${username}?v=4`,
        followers: username === 'torvalds' ? 180000 : Math.floor(Math.random() * 1000) + 100,
        following: username === 'torvalds' ? 0 : Math.floor(Math.random() * 100) + 20,
        public_repos: username === 'torvalds' ? 8 : Math.floor(Math.random() * 50) + 10,
        public_gists: Math.floor(Math.random() * 20),
        created_at: '2005-04-07T15:17:19Z',
        updated_at: new Date().toISOString(),
        profile_url: `https://github.com/${username}`
      };
    }
    
    try {
      const user = await this.makeRequestWithRetry(`/users/${username}`);
      
      return {
        login: user.login,
        name: user.name || user.login,
        bio: user.bio,
        company: user.company,
        location: user.location,
        email: user.email,
        blog: user.blog,
        twitter: user.twitter_username,
        avatar_url: user.avatar_url,
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos,
        public_gists: user.public_gists,
        created_at: user.created_at,
        updated_at: user.updated_at,
        profile_url: user.html_url
      };
    } catch (error) {
      window.Utils.logError(error, 'getUserProfile', { username });
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  },

  /**
   * Get user repositories
   * @param {string} username - GitHub username
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Repository list
   */
  async getUserRepositories(username, options = {}) {
    // Return mock data if in test mode
    if (this.isMockMode()) {
      console.log('🧪 Returning mock repositories data for:', username);
      await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay
      
      const mockRepos = username === 'torvalds' ? [
        {
          id: 1,
          name: 'linux',
          full_name: 'torvalds/linux',
          description: 'Linux kernel source tree',
          html_url: 'https://github.com/torvalds/linux',
          homepage: 'https://www.kernel.org',
          language: 'C',
          stargazers_count: 180000,
          watchers_count: 180000,
          forks_count: 55000,
          open_issues_count: 1200,
          size: 890000,
          default_branch: 'master',
          topics: ['linux', 'kernel', 'operating-system'],
          visibility: 'public',
          private: false,
          fork: false,
          archived: false,
          disabled: false,
          pushed_at: new Date(Date.now() - 86400000).toISOString(),
          created_at: '2011-09-04T22:48:00Z',
          updated_at: new Date().toISOString(),
          license: { key: 'gpl-2.0', name: 'GNU General Public License v2.0', spdx_id: 'GPL-2.0' }
        },
        {
          id: 2,
          name: 'subsurface',
          full_name: 'torvalds/subsurface',
          description: 'Subsurface divelog',
          html_url: 'https://github.com/torvalds/subsurface',
          homepage: 'https://subsurface-divelog.org',
          language: 'C++',
          stargazers_count: 2500,
          watchers_count: 2500,
          forks_count: 800,
          open_issues_count: 45,
          size: 12000,
          default_branch: 'master',
          topics: ['diving', 'qt', 'cross-platform'],
          visibility: 'public',
          private: false,
          fork: false,
          archived: false,
          disabled: false,
          pushed_at: new Date(Date.now() - 172800000).toISOString(),
          created_at: '2011-08-30T07:12:49Z',
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          license: { key: 'gpl-2.0', name: 'GNU General Public License v2.0', spdx_id: 'GPL-2.0' }
        },
        {
          id: 3,
          name: 'test-tlb',
          full_name: 'torvalds/test-tlb',
          description: 'TLB testing code',
          html_url: 'https://github.com/torvalds/test-tlb',
          homepage: '',
          language: 'C',
          stargazers_count: 45,
          watchers_count: 45,
          forks_count: 12,
          open_issues_count: 2,
          size: 500,
          default_branch: 'master',
          topics: ['testing', 'kernel'],
          visibility: 'public',
          private: false,
          fork: false,
          archived: false,
          disabled: false,
          pushed_at: new Date(Date.now() - 432000000).toISOString(),
          created_at: '2016-07-15T15:32:12Z',
          updated_at: new Date(Date.now() - 432000000).toISOString(),
          license: null
        }
      ] : [
        {
          id: Math.floor(Math.random() * 1000000),
          name: 'awesome-project',
          full_name: `${username}/awesome-project`,
          description: 'An awesome project built with modern technologies',
          html_url: `https://github.com/${username}/awesome-project`,
          homepage: '',
          language: 'JavaScript',
          stargazers_count: Math.floor(Math.random() * 500) + 10,
          watchers_count: Math.floor(Math.random() * 100) + 5,
          forks_count: Math.floor(Math.random() * 50) + 2,
          open_issues_count: Math.floor(Math.random() * 20),
          size: Math.floor(Math.random() * 5000) + 100,
          default_branch: 'main',
          topics: ['javascript', 'web', 'frontend'],
          visibility: 'public',
          private: false,
          fork: false,
          archived: false,
          disabled: false,
          pushed_at: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
          updated_at: new Date().toISOString(),
          license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' }
        },
        {
          id: Math.floor(Math.random() * 1000000),
          name: 'react-dashboard',
          full_name: `${username}/react-dashboard`,
          description: 'Modern React dashboard with TypeScript',
          html_url: `https://github.com/${username}/react-dashboard`,
          homepage: '',
          language: 'TypeScript',
          stargazers_count: Math.floor(Math.random() * 200) + 5,
          watchers_count: Math.floor(Math.random() * 50) + 2,
          forks_count: Math.floor(Math.random() * 25) + 1,
          open_issues_count: Math.floor(Math.random() * 10),
          size: Math.floor(Math.random() * 3000) + 500,
          default_branch: 'main',
          topics: ['react', 'typescript', 'dashboard'],
          visibility: 'public',
          private: false,
          fork: false,
          archived: false,
          disabled: false,
          pushed_at: new Date(Date.now() - 172800000).toISOString(),
          created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' }
        },
        {
          id: Math.floor(Math.random() * 1000000),
          name: 'python-ml-toolkit',
          full_name: `${username}/python-ml-toolkit`,
          description: 'Machine learning toolkit for Python developers',
          html_url: `https://github.com/${username}/python-ml-toolkit`,
          homepage: '',
          language: 'Python',
          stargazers_count: Math.floor(Math.random() * 150) + 3,
          watchers_count: Math.floor(Math.random() * 30) + 1,
          forks_count: Math.floor(Math.random() * 15) + 1,
          open_issues_count: Math.floor(Math.random() * 8),
          size: Math.floor(Math.random() * 2000) + 200,
          default_branch: 'main',
          topics: ['python', 'machine-learning', 'data-science'],
          visibility: 'public',
          private: false,
          fork: false,
          archived: false,
          disabled: false,
          pushed_at: new Date(Date.now() - 259200000).toISOString(),
          created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString(),
          license: { key: 'apache-2.0', name: 'Apache License 2.0', spdx_id: 'Apache-2.0' }
        }
      ];
      
      return mockRepos;
    }
    
    try {
      const {
        sort = 'updated',
        direction = 'desc',
        per_page = 100,
        type = 'owner'
      } = options;

      const repos = await this.makeRequestWithRetry(
        `/users/${username}/repos?sort=${sort}&direction=${direction}&per_page=${per_page}&type=${type}`
      );

      return repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url, // Keep original property name
        url: repo.html_url, // Keep both for compatibility
        homepage: repo.homepage,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        watchers_count: repo.watchers_count,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count,
        size: repo.size,
        default_branch: repo.default_branch,
        topics: repo.topics || [],
        visibility: repo.visibility,
        private: repo.private,
        fork: repo.fork,
        archived: repo.archived,
        disabled: repo.disabled,
        pushed_at: repo.pushed_at,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        license: repo.license ? {
          key: repo.license.key,
          name: repo.license.name,
          spdx_id: repo.license.spdx_id
        } : null
      }));
    } catch (error) {
      window.Utils.logError(error, 'getUserRepositories', { username, options });
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
  },

  /**
   * Get user events (activity)
   * @param {string} username - GitHub username
   * @param {number} per_page - Items per page
   * @returns {Promise<Array>} Events list
   */
  async getUserEvents(username, per_page = 30) {
    // Return mock data if in test mode
    if (this.isMockMode()) {
      console.log('🧪 Returning mock events data for:', username);
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay
      
      const eventTypes = ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'WatchEvent'];
      const mockEvents = [];
      
      for (let i = 0; i < Math.min(per_page, 15); i++) {
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const repoName = username === 'torvalds' && i < 5 ? 'torvalds/linux' : `${username}/project-${i % 3 + 1}`;
        
        mockEvents.push({
          id: `${Date.now()}-${i}`,
          type: type,
          actor: {
            login: username,
            avatar_url: `https://avatars.githubusercontent.com/${username}?v=4`
          },
          repo: {
            name: repoName,
            url: `https://github.com/${repoName}`
          },
          payload: this.getMockEventPayload(type, repoName),
          created_at: new Date(Date.now() - (i * 3600000 + Math.random() * 3600000)).toISOString()
        });
      }
      
      return mockEvents;
    }
    
    try {
      const events = await this.makeRequestWithRetry(
        `/users/${username}/events/public?per_page=${per_page}`
      );

      return events.map(event => ({
        id: event.id,
        type: event.type,
        actor: {
          login: event.actor.login,
          avatar_url: event.actor.avatar_url
        },
        repo: {
          name: event.repo.name,
          url: `https://github.com/${event.repo.name}`
        },
        payload: this.parseEventPayload(event),
        created_at: event.created_at
      }));
    } catch (error) {
      window.Utils.logError(error, 'getUserEvents', { username, per_page });
      throw new Error(`Failed to fetch user events: ${error.message}`);
    }
  },

  // ================================
  // STATISTICS METHODS
  // ================================
  
  /**
   * Get repository languages for all user repos
   * @param {string} username - GitHub username
   * @returns {Promise<Object>} Language statistics
   */
  async getLanguageStats(username) {
    try {
      const repos = await this.getUserRepositories(username, { per_page: 100 });
      const languageStats = {};
      
      // Use Promise.allSettled to handle partial failures
      const languagePromises = repos
        .filter(repo => !repo.fork && repo.language) // Exclude forks and repos without language
        .slice(0, 20) // Limit to avoid rate limits
        .map(async repo => {
          try {
            const languages = await this.makeRequestWithRetry(`/repos/${repo.full_name}/languages`);
            return { repo: repo.name, languages };
          } catch (error) {
            console.warn(`Failed to fetch languages for ${repo.name}:`, error);
            return null;
          }
        });

      const results = await Promise.allSettled(languagePromises);
      
      // Aggregate language data
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          const { languages } = result.value;
          Object.entries(languages).forEach(([lang, bytes]) => {
            languageStats[lang] = (languageStats[lang] || 0) + bytes;
          });
        }
      });

      // Convert to percentages
      const totalBytes = Object.values(languageStats).reduce((sum, bytes) => sum + bytes, 0);
      const languagePercentages = {};
      
      Object.entries(languageStats).forEach(([lang, bytes]) => {
        languagePercentages[lang] = {
          bytes,
          percentage: ((bytes / totalBytes) * 100).toFixed(2)
        };
      });

      return languagePercentages;
    } catch (error) {
      window.Utils.logError(error, 'getLanguageStats', { username });
      throw new Error(`Failed to fetch language statistics: ${error.message}`);
    }
  },

  /**
   * Get contribution data (simplified version without private repos)
   * @param {string} username - GitHub username
   * @returns {Promise<Object>} Contribution statistics
   */
  async getContributionStats(username) {
    try {
      // Get recent activity to estimate contributions
      const events = await this.getUserEvents(username, 100);
      const repos = await this.getUserRepositories(username, { per_page: 50 });
      
      // Count different types of contributions
      const pushEvents = events.filter(e => e.type === 'PushEvent');
      const prEvents = events.filter(e => e.type === 'PullRequestEvent');
      const issueEvents = events.filter(e => e.type === 'IssuesEvent');
      const createEvents = events.filter(e => e.type === 'CreateEvent');

      // Calculate contributions by day (last 365 days)
      const contributionMap = new Map();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      // Process push events
      pushEvents.forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        const dateObj = new Date(date);
        
        if (dateObj >= oneYearAgo) {
          const commits = event.payload?.commits?.length || 1;
          contributionMap.set(date, (contributionMap.get(date) || 0) + commits);
        }
      });

      // Generate calendar data
      const calendar = this.generateContributionCalendar(contributionMap);

      return {
        totalContributions: Array.from(contributionMap.values()).reduce((sum, count) => sum + count, 0),
        totalRepositories: repos.length,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
        calendar,
        streakData: this.calculateStreakData(contributionMap),
        mostActiveDay: this.getMostActiveDay(contributionMap),
        averagePerDay: this.getAverageContributionsPerDay(contributionMap)
      };
    } catch (error) {
      window.Utils.logError(error, 'getContributionStats', { username });
      throw new Error(`Failed to fetch contribution statistics: ${error.message}`);
    }
  },

  // ================================
  // HELPER METHODS
  // ================================
  
  /**
   * Generate mock event payload for testing
   * @param {string} type - Event type
   * @param {string} repoName - Repository name
   * @returns {Object} Mock payload
   */
  getMockEventPayload(type, repoName) {
    const commitMessages = [
      'Fix critical bug in authentication system',
      'Add new feature for user dashboard',
      'Update documentation and README',
      'Refactor code for better performance',
      'Implement responsive design improvements',
      'Add comprehensive unit tests',
      'Fix memory leak in data processing',
      'Update dependencies to latest versions',
      'Optimize database queries',
      'Add dark mode support'
    ];
    
    const issuesTitles = [
      'Bug: Login form validation fails',
      'Feature: Add export functionality',
      'Enhancement: Improve UI accessibility',
      'Bug: Memory leak in background processes',
      'Documentation: Update API examples'
    ];
    
    const prTitles = [
      'Feature: Add advanced search filters',
      'Fix: Resolve authentication timeout issues',
      'Enhancement: Improve error handling',
      'Update: Modernize UI components',
      'Optimization: Reduce bundle size'
    ];
    
    switch (type) {
      case 'PushEvent':
        const commitCount = Math.floor(Math.random() * 5) + 1;
        return {
          commits: Array.from({ length: commitCount }, (_, i) => ({
            sha: Math.random().toString(36).substring(2, 42),
            message: commitMessages[Math.floor(Math.random() * commitMessages.length)]
          }))
        };
      case 'CreateEvent':
        return {
          ref_type: Math.random() > 0.5 ? 'branch' : 'tag',
          ref: Math.random() > 0.5 ? `feature/feature-${Math.floor(Math.random() * 100)}` : `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
        };
      case 'PullRequestEvent':
        return {
          action: Math.random() > 0.5 ? 'opened' : 'closed',
          pull_request: {
            title: prTitles[Math.floor(Math.random() * prTitles.length)],
            number: Math.floor(Math.random() * 1000) + 1,
            state: Math.random() > 0.3 ? 'open' : 'closed'
          }
        };
      case 'IssuesEvent':
        return {
          action: Math.random() > 0.5 ? 'opened' : 'closed',
          issue: {
            title: issuesTitles[Math.floor(Math.random() * issuesTitles.length)],
            number: Math.floor(Math.random() * 500) + 1,
            state: Math.random() > 0.4 ? 'open' : 'closed'
          }
        };
      case 'WatchEvent':
        return {
          action: 'started'
        };
      case 'ForkEvent':
        return {
          forkee: {
            full_name: `${Math.random().toString(36).substring(2, 8)}/${repoName.split('/')[1]}`
          }
        };
      default:
        return {};
    }
  },
  
  /**
   * Parse event payload based on event type
   * @param {Object} event - GitHub event object
   * @returns {Object} Parsed payload
   */
  parseEventPayload(event) {
    const { type, payload } = event;
    
    switch (type) {
      case 'PushEvent':
        return {
          commits: payload.commits?.length || 0,
          ref: payload.ref,
          head: payload.head
        };
      
      case 'PullRequestEvent':
        return {
          action: payload.action,
          number: payload.number,
          title: payload.pull_request?.title,
          merged: payload.pull_request?.merged
        };
      
      case 'IssuesEvent':
        return {
          action: payload.action,
          number: payload.issue?.number,
          title: payload.issue?.title
        };
      
      case 'CreateEvent':
        return {
          ref_type: payload.ref_type,
          ref: payload.ref,
          master_branch: payload.master_branch
        };
      
      case 'WatchEvent':
        return {
          action: payload.action
        };
      
      case 'ForkEvent':
        return {
          forkee: payload.forkee?.full_name
        };
      
      default:
        return payload || {};
    }
  },

  /**
   * Generate contribution calendar data
   * @param {Map} contributionMap - Contributions by date
   * @returns {Array} Calendar data
   */
  generateContributionCalendar(contributionMap) {
    const calendar = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    // Start from the Sunday of the week containing the start date
    const startDayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDayOfWeek);
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = contributionMap.get(dateStr) || 0;
      
      calendar.push({
        date: dateStr,
        count,
        level: this.getContributionLevel(count)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return calendar;
  },

  /**
   * Get contribution level (0-4) based on count
   * @param {number} count - Contribution count
   * @returns {number} Level (0-4)
   */
  getContributionLevel(count) {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 10) return 3;
    return 4;
  },

  /**
   * Calculate streak data
   * @param {Map} contributionMap - Contributions by date
   * @returns {Object} Streak information
   */
  calculateStreakData(contributionMap) {
    const dates = Array.from(contributionMap.keys()).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Check current streak (from today backwards)
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date();
    
    while (checkDate >= new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (contributionMap.get(dateStr) > 0) {
        currentStreak++;
      } else if (dateStr !== today) {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    // Find longest streak
    for (const date of dates) {
      if (contributionMap.get(date) > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    return {
      current: currentStreak,
      longest: longestStreak
    };
  },

  /**
   * Get most active day of week
   * @param {Map} contributionMap - Contributions by date
   * @returns {Object} Most active day info
   */
  getMostActiveDay(contributionMap) {
    const dayTotals = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
    };
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    contributionMap.forEach((count, dateStr) => {
      const dayOfWeek = new Date(dateStr).getDay();
      dayTotals[dayOfWeek] += count;
    });
    
    const mostActiveDay = Object.entries(dayTotals)
      .reduce((max, [day, total]) => total > max.total ? { day: parseInt(day), total } : max, { day: 0, total: 0 });
    
    return {
      name: dayNames[mostActiveDay.day],
      total: mostActiveDay.total
    };
  },

  /**
   * Get average contributions per day
   * @param {Map} contributionMap - Contributions by date
   * @returns {number} Average contributions
   */
  getAverageContributionsPerDay(contributionMap) {
    const totalDays = contributionMap.size || 1;
    const totalContributions = Array.from(contributionMap.values()).reduce((sum, count) => sum + count, 0);
    return (totalContributions / totalDays).toFixed(1);
  },

  // ================================
  // RATE LIMITING
  // ================================
  
  /**
   * Check rate limit before making request
   */
  async checkRateLimit() {
    const config = this.config;
    const warningThreshold = config.get('github.rateLimit.warningThreshold', 10);
    
    if (this.rateLimitRemaining <= warningThreshold) {
      const resetTime = this.rateLimitReset ? new Date(this.rateLimitReset * 1000) : new Date(Date.now() + 60 * 60 * 1000);
      const now = new Date();
      
      if (now < resetTime) {
        const waitTime = resetTime - now;
        console.warn(`Rate limit approaching. ${this.rateLimitRemaining} requests remaining. Reset at ${resetTime.toLocaleTimeString()}`);
        
        // Show user notification
        if (window.DevPulseUI?.showToast) {
          window.DevPulseUI.showToast(
            `API rate limit low: ${this.rateLimitRemaining} requests remaining`,
            'warning'
          );
        }
        
        if (this.rateLimitRemaining <= 0) {
          throw new Error(`Rate limit exceeded. Reset at ${resetTime.toLocaleTimeString()}`);
        }
      }
    }
  },

  /**
   * Update rate limit info from response headers
   * @param {Response} response - Fetch response
   */
  updateRateLimit(response) {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    
    if (remaining !== null) {
      this.rateLimitRemaining = parseInt(remaining, 10);
    }
    
    if (reset !== null) {
      this.rateLimitReset = parseInt(reset, 10);
    }
    
    this.requestCount++;
  },

  // ================================
  // CACHING
  // ================================
  
  /**
   * Check if cache should be used
   * @param {string} key - Cache key
   * @returns {boolean} Whether to use cache
   */
  shouldUseCache(key) {
    const config = this.config;
    const cacheEnabled = config.get('github.cache.enabled', true);
    const cacheDuration = config.get('github.cache.duration', 300000); // 5 minutes
    
    if (!cacheEnabled) return false;
    
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    const now = Date.now();
    return (now - cached.timestamp) < cacheDuration;
  },

  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @returns {*} Cached data
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  },

  /**
   * Set data in cache
   * @param {string} key - Cache key
   * @param {*} data - Data to cache
   */
  setCache(key, data) {
    const config = this.config;
    const maxSize = config.get('github.cache.maxSize', 100);
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('API cache cleared');
  },

  // ================================
  // UTILITY METHODS
  // ================================
  
  /**
   * Sleep for specified duration
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} Sleep promise
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Get rate limit status
   * @returns {Object} Rate limit info
   */
  getRateLimitStatus() {
    return {
      remaining: this.rateLimitRemaining,
      reset: this.rateLimitReset ? new Date(this.rateLimitReset * 1000) : null,
      requestCount: this.requestCount
    };
  },

  // ================================
  // LANGUAGE STATISTICS
  // ================================
  
  /**
   * Aggregate language statistics from repositories
   * @param {Array} repositories - Array of repository objects
   * @returns {Array} Language statistics array
   */
  aggregateLanguageStats(repositories) {
    try {
      const languageMap = new Map();
      
      // Aggregate languages from repositories
      repositories.forEach(repo => {
        if (repo.language && !repo.fork) {
          const currentSize = languageMap.get(repo.language) || 0;
          // Estimate language usage based on repository size
          languageMap.set(repo.language, currentSize + (repo.size || 1));
        }
      });
      
      // Convert to array and sort by size
      const languageArray = Array.from(languageMap.entries())
        .map(([name, size]) => ({ name, size }))
        .sort((a, b) => b.size - a.size)
        .slice(0, 10); // Limit to top 10 languages
      
      return languageArray;
    } catch (error) {
      window.Utils.logError(error, 'aggregateLanguageStats', { repositories });
      return [];
    }
  },

  /**
   * Generate contribution calendar data from events
   * @param {Array} events - Array of GitHub events
   * @returns {Array} Contribution calendar data
   */
  generateContributionCalendar(events) {
    try {
      const contributionMap = new Map();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      // Process events to create contribution map
      events.forEach(event => {
        if (event.type === 'PushEvent') {
          const date = new Date(event.created_at).toISOString().split('T')[0];
          const eventDate = new Date(date);
          
          if (eventDate >= oneYearAgo) {
            const commits = event.payload?.commits?.length || 1;
            contributionMap.set(date, (contributionMap.get(date) || 0) + commits);
          }
        }
      });

      // Generate calendar data for the last year
      const calendar = [];
      const today = new Date();
      const startDate = new Date(today);
      startDate.setFullYear(startDate.getFullYear() - 1);
      
      // Start from the Sunday of the week containing the start date
      const startDayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - startDayOfWeek);
      
      let currentDate = new Date(startDate);
      
      while (currentDate <= today) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = contributionMap.get(dateStr) || 0;
        
        calendar.push({
          date: dateStr,
          count,
          level: this.getContributionLevel(count)
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return calendar;
    } catch (error) {
      window.Utils.logError(error, 'generateContributionCalendar', { events });
      return [];
    }
  }
};

// Initialize API when module loads
if (typeof window !== 'undefined' && window.DevPulseConfig) {
  window.DevPulseAPI.init();
}

// Make API globally available
window.API = window.DevPulseAPI;
