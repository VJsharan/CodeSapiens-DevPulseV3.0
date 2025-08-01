/**
 * DevPulse AI-Powered Insights Module
 * Provides intelligent analysis of developer patterns and personalized recommendations
 */

window.DevPulseAI = {
  
  // ================================
  // AI ANALYSIS ENGINE
  // ================================
  
  /**
   * Analyze developer patterns and generate insights
   * @param {Object} userData - User data from GitHub API
   * @returns {Object} AI-generated insights
   */
  async generateInsights(userData) {
    console.log('🤖 Generating AI insights for user:', userData.login);
    
    const insights = {
      personalityProfile: this.analyzePersonalityProfile(userData),
      workPatterns: this.analyzeWorkPatterns(userData),
      codingStyle: this.analyzeCodingStyle(userData),
      collaborationStyle: this.analyzeCollaborationStyle(userData),
      recommendations: this.generateRecommendations(userData),
      predictions: this.generatePredictions(userData),
      riskAnalysis: this.analyzeRisks(userData)
    };
    
    console.log('✅ AI insights generated:', insights);
    return insights;
  },

  /**
   * Analyze developer personality based on GitHub activity
   * @param {Object} userData - User data
   * @returns {Object} Personality profile
   */
  analyzePersonalityProfile(userData) {
    const events = userData.events || [];
    const repos = userData.repositories || [];
    
    // Calculate personality metrics
    const metrics = {
      innovation: this.calculateInnovationScore(repos),
      collaboration: this.calculateCollaborationScore(events),
      consistency: this.calculateConsistencyScore(events),
      exploration: this.calculateExplorationScore(repos),
      leadership: this.calculateLeadershipScore(repos, events)
    };
    
    return {
      type: this.determinePersonalityType(metrics),
      scores: metrics,
      description: this.generatePersonalityDescription(metrics),
      strengths: this.identifyStrengths(metrics),
      growthAreas: this.identifyGrowthAreas(metrics)
    };
  },

  /**
   * Analyze work patterns and habits
   * @param {Object} userData - User data
   * @returns {Object} Work pattern analysis
   */
  analyzeWorkPatterns(userData) {
    const events = userData.events || [];
    
    // Analyze temporal patterns
    const hourlyDistribution = this.analyzeTimeDistribution(events);
    const weeklyPattern = this.analyzeWeeklyPattern(events);
    const projectJuggling = this.analyzeProjectJuggling(events);
    
    return {
      peakHours: this.identifyPeakHours(hourlyDistribution),
      workingStyle: this.determineWorkingStyle(hourlyDistribution, weeklyPattern),
      sessionLength: this.estimateSessionLength(events),
      multitasking: projectJuggling,
      consistency: this.calculateWorkConsistency(weeklyPattern),
      burnoutRisk: this.assessBurnoutRisk(events, weeklyPattern)
    };
  },

  /**
   * Analyze coding style and preferences
   * @param {Object} userData - User data
   * @returns {Object} Coding style analysis
   */
  analyzeCodingStyle(userData) {
    const repos = userData.repositories || [];
    const events = userData.events || [];
    
    return {
      languagePreferences: this.analyzeLanguagePreferences(repos),
      projectTypes: this.categorizeProjectTypes(repos),
      commitStyle: this.analyzeCommitStyle(events),
      testingApproach: this.analyzeTestingApproach(repos),
      architectureStyle: this.analyzeArchitectureStyle(repos)
    };
  },

  /**
   * Analyze collaboration patterns
   * @param {Object} userData - User data
   * @returns {Object} Collaboration analysis
   */
  analyzeCollaborationStyle(userData) {
    const events = userData.events || [];
    const repos = userData.repositories || [];
    
    return {
      teamPlayer: this.assessTeamPlayerScore(events),
      mentorshipStyle: this.analyzeMentorshipStyle(events),
      communicationStyle: this.analyzeCommunicationStyle(events),
      leadership: this.assessLeadershipTendencies(repos, events),
      networkSize: this.estimateNetworkSize(events)
    };
  },

  /**
   * Generate personalized recommendations
   * @param {Object} userData - User data
   * @returns {Array} Recommendations
   */
  generateRecommendations(userData) {
    const insights = this.analyzeBasicPatterns(userData);
    const recommendations = [];

    // Technology recommendations
    recommendations.push(...this.generateTechRecommendations(insights));
    
    // Learning path recommendations
    recommendations.push(...this.generateLearningRecommendations(insights));
    
    // Productivity recommendations
    recommendations.push(...this.generateProductivityRecommendations(insights));
    
    // Career recommendations
    recommendations.push(...this.generateCareerRecommendations(insights));

    return recommendations.slice(0, 8); // Top 8 recommendations
  },

  /**
   * Generate predictions about future activities
   * @param {Object} userData - User data
   * @returns {Object} Predictions
   */
  generatePredictions(userData) {
    const events = userData.events || [];
    const repos = userData.repositories || [];
    
    return {
      nextTechnology: this.predictNextTechnology(repos),
      activityTrend: this.predictActivityTrend(events),
      collaborationGrowth: this.predictCollaborationGrowth(events),
      skillDevelopment: this.predictSkillDevelopment(repos, events)
    };
  },

  // ================================
  // CALCULATION METHODS
  // ================================

  calculateInnovationScore(repos) {
    if (!repos.length) return Math.random() * 3 + 4; // 4-7 range for no data
    
    const uniqueLanguages = new Set(repos.map(r => r.language).filter(Boolean)).size;
    const originalRepos = repos.filter(r => !r.fork).length;
    const totalRepos = repos.length;
    const forkRatio = 1 - (originalRepos / totalRepos);
    
    // Check for experimental/innovative keywords in descriptions
    const innovativeKeywords = ['experiment', 'prototype', 'poc', 'demo', 'innovative', 'cutting-edge', 'ai', 'ml', 'blockchain'];
    const experimentalRepos = repos.filter(r => {
      const desc = (r.description || '').toLowerCase();
      return innovativeKeywords.some(keyword => desc.includes(keyword));
    }).length;
    
    // Check for recent repos (innovation often means trying new things)
    const recentRepos = repos.filter(r => {
      const createdDate = new Date(r.created_at || r.updated_at);
      const monthsAgo = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return monthsAgo <= 6; // Last 6 months
    }).length;
    
    // Scoring algorithm
    let score = 0;
    score += Math.min(4, uniqueLanguages * 0.8); // Language diversity (max 4 points)
    score += Math.min(3, (originalRepos / Math.max(totalRepos, 1)) * 4); // Originality (max 3 points)
    score += Math.min(2, experimentalRepos * 0.5); // Experimental projects (max 2 points)
    score += Math.min(1, (recentRepos / Math.max(totalRepos, 1)) * 2); // Recent activity (max 1 point)
    
    return Math.min(10, Math.max(1, score));
  },

  calculateCollaborationScore(events) {
    if (!events.length) return Math.random() * 3 + 3; // 3-6 range for no data
    
    const collaborativeEvents = events.filter(e => 
      e.type === 'PullRequestEvent' || 
      e.type === 'IssuesEvent' || 
      e.type === 'PullRequestReviewEvent' ||
      e.type === 'IssueCommentEvent'
    ).length;
    
    const publicEvents = events.filter(e => e.public !== false).length;
    const orgEvents = events.filter(e => e.org).length;
    const watchEvents = events.filter(e => e.type === 'WatchEvent').length;
    const forkEvents = events.filter(e => e.type === 'ForkEvent').length;
    
    let score = 0;
    score += Math.min(4, (collaborativeEvents / Math.max(events.length, 1)) * 10); // Direct collaboration (max 4)
    score += Math.min(2, (orgEvents / Math.max(events.length, 1)) * 8); // Organization activity (max 2)
    score += Math.min(2, (watchEvents / Math.max(events.length, 1)) * 20); // Community engagement (max 2)
    score += Math.min(2, (forkEvents / Math.max(events.length, 1)) * 15); // Fork activity (max 2)
    
    return Math.min(10, Math.max(1, score));
  },

  calculateConsistencyScore(events) {
    if (events.length < 5) return Math.random() * 4 + 3; // 3-7 range for insufficient data
    
    // Group events by day
    const dailyActivity = this.groupEventsByDay(events);
    const days = Object.keys(dailyActivity);
    
    if (days.length < 7) return Math.random() * 3 + 4; // 4-7 range for < week data
    
    // Calculate daily activity counts
    const activityCounts = Object.values(dailyActivity).map(day => day.length);
    const mean = activityCounts.reduce((a, b) => a + b, 0) / activityCounts.length;
    
    // Calculate coefficient of variation (std dev / mean)
    const variance = activityCounts.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / activityCounts.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = mean > 0 ? stdDev / mean : 1;
    
    // Check for regular patterns (weekdays vs weekends)
    const weekdayActivity = [];
    const weekendActivity = [];
    
    Object.entries(dailyActivity).forEach(([date, dayEvents]) => {
      const dayOfWeek = new Date(date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendActivity.push(dayEvents.length);
      } else {
        weekdayActivity.push(dayEvents.length);
      }
    });
    
    const weekdayMean = weekdayActivity.length ? weekdayActivity.reduce((a, b) => a + b) / weekdayActivity.length : 0;
    const weekendMean = weekendActivity.length ? weekendActivity.reduce((a, b) => a + b) / weekendActivity.length : 0;
    const workLifeBalance = Math.abs(weekdayMean - weekendMean) / Math.max(weekdayMean, weekendMean, 1);
    
    // Score calculation (lower variation = higher consistency)
    let score = 10 - (coefficientOfVariation * 5); // Base score from variation
    score += Math.min(2, (1 - workLifeBalance) * 2); // Work-life balance bonus
    
    return Math.min(10, Math.max(1, score));
  },

  calculateExplorationScore(repos) {
    if (!repos.length) return Math.random() * 3 + 4; // 4-7 range for no data
    
    const languages = repos.map(r => r.language).filter(Boolean);
    const uniqueLanguages = new Set(languages);
    
    // Language categories for diversity scoring
    const languageCategories = {
      'frontend': ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'React'],
      'backend': ['Java', 'Python', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Node.js'],
      'mobile': ['Swift', 'Kotlin', 'Dart', 'Objective-C'],
      'systems': ['C', 'C++', 'Rust', 'Assembly'],
      'data': ['Python', 'R', 'Julia', 'MATLAB', 'Scala'],
      'functional': ['Haskell', 'Clojure', 'F#', 'Erlang', 'Elixir']
    };
    
    const categoriesUsed = new Set();
    uniqueLanguages.forEach(lang => {
      Object.entries(languageCategories).forEach(([category, langs]) => {
        if (langs.includes(lang)) {
          categoriesUsed.add(category);
        }
      });
    });
    
    // Check for trending/emerging technologies
    const emergingTech = ['Rust', 'Go', 'TypeScript', 'Dart', 'Julia', 'Zig', 'WebAssembly'];
    const emergingCount = [...uniqueLanguages].filter(lang => emergingTech.includes(lang)).length;
    
    // Project diversity (different types of projects)
    const projectTypes = new Set();
    repos.forEach(repo => {
      const name = (repo.name || '').toLowerCase();
      const desc = (repo.description || '').toLowerCase();
      
      if (name.includes('web') || desc.includes('website')) projectTypes.add('web');
      if (name.includes('mobile') || desc.includes('android') || desc.includes('ios')) projectTypes.add('mobile');
      if (name.includes('api') || desc.includes('api')) projectTypes.add('api');
      if (name.includes('cli') || desc.includes('command')) projectTypes.add('cli');
      if (desc.includes('library') || desc.includes('framework')) projectTypes.add('library');
      if (desc.includes('game')) projectTypes.add('game');
      if (desc.includes('ml') || desc.includes('ai')) projectTypes.add('ai');
    });
    
    let score = 0;
    score += Math.min(3, uniqueLanguages.size * 0.5); // Language diversity (max 3)
    score += Math.min(3, categoriesUsed.size * 0.8); // Category diversity (max 3)
    score += Math.min(2, emergingCount * 0.8); // Emerging tech adoption (max 2)
    score += Math.min(2, projectTypes.size * 0.4); // Project type diversity (max 2)
    
    return Math.min(10, Math.max(1, score));
  },

  calculateLeadershipScore(repos, events) {
    if (!repos.length && !events.length) return Math.random() * 3 + 2; // 2-5 range for no data
    
    const ownedRepos = repos.filter(r => !r.fork).length;
    const totalRepos = repos.length || 1;
    const ownershipRatio = ownedRepos / totalRepos;
    
    // Repository quality indicators
    const starredRepos = repos.filter(r => (r.stargazers_count || 0) > 5).length;
    const forkedRepos = repos.filter(r => (r.forks_count || 0) > 2).length;
    const documentedRepos = repos.filter(r => r.description && r.description.length > 20).length;
    
    // Leadership activities in events
    const createEvents = events.filter(e => e.type === 'CreateEvent').length;
    const releaseEvents = events.filter(e => e.type === 'ReleaseEvent').length;
    const organizationEvents = events.filter(e => e.org).length;
    const mentorshipEvents = events.filter(e => 
      e.type === 'IssueCommentEvent' || 
      e.type === 'PullRequestReviewEvent'
    ).length;
    
    // Repository impact
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    
    let score = 0;
    score += Math.min(2, ownershipRatio * 3); // Project ownership (max 2)
    score += Math.min(2, (starredRepos / Math.max(totalRepos, 1)) * 4); // Quality repos (max 2)
    score += Math.min(2, Math.log10(Math.max(totalStars, 1)) * 0.8); // Community impact (max 2)
    score += Math.min(2, (organizationEvents / Math.max(events.length, 1)) * 10); // Org leadership (max 2)
    score += Math.min(2, (mentorshipEvents / Math.max(events.length, 1)) * 8); // Mentorship (max 2)
    
    return Math.min(10, Math.max(1, score));
  },

  // ================================
  // PATTERN ANALYSIS METHODS
  // ================================

  analyzeTimeDistribution(events) {
    const hourlyActivity = new Array(24).fill(0);
    
    events.forEach(event => {
      const hour = new Date(event.created_at).getHours();
      hourlyActivity[hour]++;
    });
    
    return hourlyActivity;
  },

  analyzeWeeklyPattern(events) {
    const weeklyActivity = new Array(7).fill(0);
    
    events.forEach(event => {
      const day = new Date(event.created_at).getDay();
      weeklyActivity[day]++;
    });
    
    return weeklyActivity;
  },

  identifyPeakHours(hourlyDistribution) {
    const maxActivity = Math.max(...hourlyDistribution);
    const peakHours = hourlyDistribution
      .map((activity, hour) => ({ hour, activity }))
      .filter(h => h.activity >= maxActivity * 0.8)
      .map(h => h.hour);
    
    return peakHours;
  },

  determineWorkingStyle(hourlyDist, weeklyDist) {
    const totalActivity = hourlyDist.reduce((a, b) => a + b, 0);
    if (totalActivity === 0) return 'Getting Started 🌱';
    
    // Find peak hours
    const maxActivity = Math.max(...hourlyDist);
    const peakHours = hourlyDist
      .map((activity, hour) => ({ hour, activity }))
      .filter(h => h.activity >= maxActivity * 0.7)
      .map(h => h.hour);
    
    // Analyze time patterns
    const morningActivity = hourlyDist.slice(6, 12).reduce((a, b) => a + b, 0); // 6 AM - 12 PM
    const afternoonActivity = hourlyDist.slice(12, 18).reduce((a, b) => a + b, 0); // 12 PM - 6 PM
    const eveningActivity = hourlyDist.slice(18, 23).reduce((a, b) => a + b, 0); // 6 PM - 11 PM
    const nightActivity = [...hourlyDist.slice(23), ...hourlyDist.slice(0, 6)].reduce((a, b) => a + b, 0); // 11 PM - 6 AM
    
    // Weekend vs weekday analysis
    const weekendActivity = (weeklyDist[0] || 0) + (weeklyDist[6] || 0); // Sunday + Saturday
    const weekdayActivity = weeklyDist.slice(1, 6).reduce((a, b) => a + b, 0); // Mon-Fri
    const weekendRatio = weekendActivity / Math.max(weekendActivity + weekdayActivity, 1);
    
    // Consistency analysis
    const weekdayVariance = this.calculateVariance(weeklyDist.slice(1, 6));
    const isConsistent = weekdayVariance < 2;
    
    // Determine working style
    if (nightActivity > totalActivity * 0.4) {
      return isConsistent ? 'Consistent Night Owl 🦉' : 'Irregular Night Coder 🌙';
    } else if (morningActivity > totalActivity * 0.4) {
      return isConsistent ? 'Early Bird Developer 🐦' : 'Morning Burst Coder ☀️';
    } else if (weekendRatio > 0.4) {
      return eveningActivity > afternoonActivity ? 'Weekend Evening Warrior 💪' : 'Weekend Day Hacker 🎯';
    } else if (eveningActivity > totalActivity * 0.4) {
      return isConsistent ? 'After-Hours Developer 🌆' : 'Evening Sprint Coder 🏃';
    } else if (afternoonActivity > totalActivity * 0.4) {
      return isConsistent ? 'Afternoon Focused 📈' : 'Midday Momentum 🔥';
    } else if (isConsistent) {
      return 'Steady All-Day Contributor 🔄';
    } else {
      return 'Flexible Schedule Coder 🎨';
    }
  },

  calculateVariance(array) {
    if (array.length === 0) return 0;
    const mean = array.reduce((a, b) => a + b, 0) / array.length;
    return array.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / array.length;
  },

  assessBurnoutRisk(events, weeklyPattern) {
    if (events.length < 20) {
      return { 
        level: 'Low', 
        advice: 'Build consistent coding habits gradually',
        score: Math.random() * 3 + 1 // 1-4 score
      };
    }
    
    // Analyze recent activity intensity
    const recentEvents = events.slice(0, Math.min(50, events.length));
    const intensity = recentEvents.length / Math.min(30, events.length); // Events per day (last 30 events)
    
    // Weekend work analysis
    const totalWeekly = weeklyPattern.reduce((a, b) => a + b, 0);
    const weekendWork = totalWeekly > 0 ? ((weeklyPattern[0] || 0) + (weeklyPattern[6] || 0)) / totalWeekly : 0;
    
    // Time distribution analysis
    const hourlyDist = this.analyzeTimeDistribution(recentEvents);
    const totalHourly = hourlyDist.reduce((a, b) => a + b, 0);
    const lateNightWork = totalHourly > 0 ? 
      (hourlyDist.slice(22).reduce((a, b) => a + b, 0) + hourlyDist.slice(0, 6).reduce((a, b) => a + b, 0)) / totalHourly : 0;
    
    // Activity clustering (many events in short periods)
    const dailyGroups = this.groupEventsByDay(recentEvents);
    const heavyDays = Object.values(dailyGroups).filter(day => day.length > 5).length;
    const clusteringScore = heavyDays / Math.max(Object.keys(dailyGroups).length, 1);
    
    // Calculate risk factors
    let riskScore = 0;
    
    // High intensity factor
    if (intensity > 3) riskScore += 3;
    else if (intensity > 2) riskScore += 2;
    else if (intensity > 1.5) riskScore += 1;
    
    // Weekend work factor
    if (weekendWork > 0.4) riskScore += 3;
    else if (weekendWork > 0.3) riskScore += 2;
    else if (weekendWork > 0.2) riskScore += 1;
    
    // Late night work factor
    if (lateNightWork > 0.3) riskScore += 2;
    else if (lateNightWork > 0.2) riskScore += 1;
    
    // Activity clustering factor
    if (clusteringScore > 0.5) riskScore += 2;
    else if (clusteringScore > 0.3) riskScore += 1;
    
    // Determine risk level and advice
    let level, advice, recommendations;
    
    if (riskScore >= 7) {
      level = 'High';
      advice = 'Take immediate steps to prevent burnout';
      recommendations = [
        'Schedule regular breaks and vacation time',
        'Set boundaries for work hours',
        'Consider delegating or reducing workload',
        'Practice stress management techniques'
      ];
    } else if (riskScore >= 4) {
      level = 'Medium';
      advice = 'Monitor work intensity and maintain balance';
      recommendations = [
        'Establish consistent work hours',
        'Take weekends off when possible',
        'Ensure adequate sleep schedule',
        'Include non-coding activities in your routine'
      ];
    } else if (riskScore >= 2) {
      level = 'Low-Medium';
      advice = 'Good work pattern with minor areas to watch';
      recommendations = [
        'Continue current healthy patterns',
        'Be mindful of late-night coding sessions',
        'Maintain work-life separation'
      ];
    } else {
      level = 'Low';
      advice = 'Healthy work pattern detected';
      recommendations = [
        'Excellent work-life balance',
        'Keep maintaining current habits',
        'Consider sharing your approach with others'
      ];
    }
    
    return { 
      level, 
      advice, 
      score: riskScore,
      recommendations: recommendations.slice(0, 2) // Top 2 recommendations
    };
  },

  // ================================
  // RECOMMENDATION GENERATORS
  // ================================

  generateTechRecommendations(insights) {
    const languages = insights.languages || [];
    const repoCount = insights.repoCount || 0;
    const recentActivity = insights.recentActivity || 0;
    
    const recommendations = [];
    
    // Dynamic recommendations based on current languages
    if (languages.includes('JavaScript')) {
      if (!languages.includes('TypeScript')) {
        recommendations.push({
          type: 'Technology',
          title: 'Upgrade to TypeScript',
          description: 'Enhance your JavaScript projects with TypeScript for better type safety and developer experience.',
          confidence: 0.9,
          icon: '📘'
        });
      }
      
      if (!languages.includes('React') && !languages.includes('Vue')) {
        recommendations.push({
          type: 'Technology',
          title: 'Learn React or Vue.js',
          description: 'Modern frontend frameworks will boost your web development capabilities.',
          confidence: 0.8,
          icon: '⚛️'
        });
      }
    }
    
    if (languages.includes('Python')) {
      if (repoCount > 5) {
        recommendations.push({
          type: 'Technology',
          title: 'Explore FastAPI',
          description: 'Build high-performance APIs with Python using FastAPI framework.',
          confidence: 0.8,
          icon: '🚀'
        });
      }
      
      if (!languages.includes('Java') && !languages.includes('Go')) {
        recommendations.push({
          type: 'Technology',
          title: 'Try Go Programming',
          description: 'Go offers excellent performance and simplicity, perfect for backend services.',
          confidence: 0.7,
          icon: '🐹'
        });
      }
    }
    
    if (languages.includes('Java')) {
      recommendations.push({
        type: 'Technology',
        title: 'Explore Kotlin',
        description: 'Kotlin provides modern language features while maintaining Java compatibility.',
        confidence: 0.8,
        icon: '🎯'
      });
    }
    
    // General recommendations based on activity level
    if (recentActivity > 20) {
      recommendations.push({
        type: 'Technology',
        title: 'Container Technologies',
        description: 'Docker and Kubernetes can streamline your deployment process.',
        confidence: 0.9,
        icon: '🐳'
      });
    }
    
    if (repoCount > 10) {
      recommendations.push({
        type: 'Technology',
        title: 'CI/CD Automation',
        description: 'GitHub Actions or Jenkins can automate your development workflow.',
        confidence: 0.85,
        icon: '🔄'
      });
    }
    
    // If no specific languages, provide general recommendations
    if (languages.length === 0) {
      recommendations.push({
        type: 'Technology',
        title: 'Start with JavaScript',
        description: 'JavaScript is versatile and perfect for both frontend and backend development.',
        confidence: 0.9,
        icon: '💛'
      });
    }
    
    return recommendations.slice(0, 3);
  },

  generateLearningRecommendations(insights) {
    const languages = insights.languages || [];
    const repoCount = insights.repoCount || 0;
    const followerCount = insights.followerCount || 0;
    
    const recommendations = [];
    
    // Recommendations based on current skill level
    if (repoCount < 5) {
      recommendations.push({
        type: 'Learning',
        title: 'Git & GitHub Mastery',
        description: 'Master version control and collaboration workflows to boost your development skills.',
        confidence: 0.95,
        icon: '📚'
      });
      
      recommendations.push({
        type: 'Learning',
        title: 'Algorithm & Data Structures',
        description: 'Build strong programming fundamentals with algorithms and data structures.',
        confidence: 0.9,
        icon: '🧮'
      });
    } else if (repoCount < 15) {
      recommendations.push({
        type: 'Learning',
        title: 'System Design Patterns',
        description: 'Learn scalable architecture patterns for building robust applications.',
        confidence: 0.85,
        icon: '🏗️'
      });
      
      recommendations.push({
        type: 'Learning',
        title: 'Testing Best Practices',
        description: 'Unit testing, integration testing, and TDD will improve your code quality.',
        confidence: 0.8,
        icon: '🧪'
      });
    } else {
      recommendations.push({
        type: 'Learning',
        title: 'Cloud Architecture',
        description: 'AWS, Azure, or GCP certifications can advance your cloud expertise.',
        confidence: 0.8,
        icon: '☁️'
      });
      
      recommendations.push({
        type: 'Learning',
        title: 'Technical Leadership',
        description: 'Develop mentoring and team leadership skills for career advancement.',
        confidence: 0.75,
        icon: '👨‍🏫'
      });
    }
    
    // Language-specific learning paths
    if (languages.includes('JavaScript') && languages.includes('Python')) {
      recommendations.push({
        type: 'Learning',
        title: 'Full-Stack Development',
        description: 'Combine your JavaScript and Python skills for end-to-end development.',
        confidence: 0.9,
        icon: '🔄'
      });
    }
    
    if (followerCount > 50) {
      recommendations.push({
        type: 'Learning',
        title: 'Developer Advocacy',
        description: 'Your growing network suggests potential in developer relations and advocacy.',
        confidence: 0.7,
        icon: '📢'
      });
    }
    
    return recommendations.slice(0, 2);
  },

  generateProductivityRecommendations(insights) {
    const recentActivity = insights.recentActivity || 0;
    const repoCount = insights.repoCount || 0;
    
    const recommendations = [];
    
    if (recentActivity > 30) {
      recommendations.push({
        type: 'Productivity',
        title: 'Automate Repetitive Tasks',
        description: 'High activity suggests you could benefit from automation scripts and tools.',
        confidence: 0.9,
        icon: '🤖'
      });
      
      recommendations.push({
        type: 'Productivity',
        title: 'Time Management',
        description: 'Consider time-blocking and the Pomodoro Technique for sustained productivity.',
        confidence: 0.8,
        icon: '⏰'
      });
    } else if (recentActivity < 10) {
      recommendations.push({
        type: 'Productivity',
        title: 'Consistent Coding Schedule',
        description: 'Establish a regular coding routine to maintain momentum and skills.',
        confidence: 0.85,
        icon: '📅'
      });
    }
    
    if (repoCount > 20) {
      recommendations.push({
        type: 'Productivity',
        title: 'Repository Organization',
        description: 'Organize repositories with clear documentation and naming conventions.',
        confidence: 0.8,
        icon: '📁'
      });
    }
    
    recommendations.push({
      type: 'Productivity',
      title: 'Code Review Practices',
      description: 'Regular code reviews improve quality and knowledge sharing.',
      confidence: 0.75,
      icon: '👥'
    });
    
    return recommendations.slice(0, 2);
  },

  generateCareerRecommendations(insights) {
    const repoCount = insights.repoCount || 0;
    const followerCount = insights.followerCount || 0;
    const languages = insights.languages || [];
    
    const recommendations = [];
    
    if (repoCount > 15 && followerCount > 30) {
      recommendations.push({
        type: 'Career',
        title: 'Technical Leadership Role',
        description: 'Your portfolio and network suggest readiness for senior or lead positions.',
        confidence: 0.85,
        icon: '🎯'
      });
    } else if (repoCount > 8) {
      recommendations.push({
        type: 'Career',
        title: 'Senior Developer Position',
        description: 'Your experience level indicates potential for advancement to senior roles.',
        confidence: 0.8,
        icon: '⬆️'
      });
    }
    
    if (languages.length > 3) {
      recommendations.push({
        type: 'Career',
        title: 'Full-Stack Development',
        description: 'Your diverse language skills make you well-suited for full-stack roles.',
        confidence: 0.8,
        icon: '🌐'
      });
    }
    
    if (followerCount > 100) {
      recommendations.push({
        type: 'Career',
        title: 'Developer Relations',
        description: 'Your strong community presence suggests potential in DevRel roles.',
        confidence: 0.75,
        icon: '🤝'
      });
    }
    
    recommendations.push({
      type: 'Career',
      title: 'Open Source Contribution',
      description: 'Contributing to major projects can significantly boost your professional profile.',
      confidence: 0.9,
      icon: '🌟'
    });
    
    if (languages.includes('Python') || languages.includes('JavaScript')) {
      recommendations.push({
        type: 'Career',
        title: 'Freelance Opportunities',
        description: 'Your skills are in high demand for freelance and contract work.',
        confidence: 0.7,
        icon: '💼'
      });
    }
    
    return recommendations.slice(0, 2);
  },

  // ================================
  // PREDICTION METHODS
  // ================================

  predictNextTechnology(repos) {
    const languages = repos.map(r => r.language).filter(Boolean);
    const recentLanguages = repos.slice(0, 5).map(r => r.language).filter(Boolean);
    const languageCount = {};
    
    // Count language usage
    languages.forEach(lang => {
      languageCount[lang] = (languageCount[lang] || 0) + 1;
    });
    
    // Technology progression patterns based on current stack
    const progressionMap = {
      'JavaScript': {
        primary: ['TypeScript', 'React', 'Vue.js', 'Node.js'],
        advanced: ['Deno', 'WebAssembly', 'GraphQL', 'Next.js']
      },
      'TypeScript': {
        primary: ['React', 'Angular', 'Vue.js', 'Svelte'],
        advanced: ['NestJS', 'Prisma', 'tRPC', 'SolidJS']
      },
      'Python': {
        primary: ['Django', 'FastAPI', 'Flask', 'TensorFlow'],
        advanced: ['PyTorch', 'Pandas', 'Celery', 'Airflow']
      },
      'Java': {
        primary: ['Spring Boot', 'Kotlin', 'Maven', 'Gradle'],
        advanced: ['Quarkus', 'Micronaut', 'Scala', 'Clojure']
      },
      'C#': {
        primary: ['.NET Core', 'ASP.NET', 'Blazor', 'Unity'],
        advanced: ['F#', 'Azure Functions', 'SignalR', 'gRPC']
      },
      'Go': {
        primary: ['Gin', 'Echo', 'Docker', 'Kubernetes'],
        advanced: ['gRPC', 'Cobra', 'Viper', 'NATS']
      },
      'Rust': {
        primary: ['Actix', 'Rocket', 'Tokio', 'Serde'],
        advanced: ['WebAssembly', 'Tauri', 'Bevy', 'egui']
      },
      'PHP': {
        primary: ['Laravel', 'Symfony', 'Composer', 'PHPUnit'],
        advanced: ['ReactPHP', 'Swoole', 'Psalm', 'Rector']
      }
    };
    
    // Trending technologies for 2024-2025
    const trendingTech = [
      'Rust', 'Go', 'TypeScript', 'Svelte', 'Astro', 'Deno', 
      'WebAssembly', 'Tauri', 'SolidJS', 'Qwik', 'Fresh', 'Bun'
    ];
    
    const suggestions = [];
    const usedLanguages = new Set(languages);
    
    // Get suggestions based on current languages
    recentLanguages.forEach(lang => {
      if (progressionMap[lang]) {
        // Add primary suggestions if not already using advanced
        const primary = progressionMap[lang].primary.filter(tech => !usedLanguages.has(tech));
        const advanced = progressionMap[lang].advanced.filter(tech => !usedLanguages.has(tech));
        
        suggestions.push(...primary.slice(0, 2));
        if (languages.filter(l => l === lang).length >= 3) { // If experienced with this language
          suggestions.push(...advanced.slice(0, 1));
        }
      }
    });
    
    // Add trending technologies if user is experimental
    const uniqueLanguages = new Set(languages).size;
    if (uniqueLanguages >= 3) { // Experimental developer
      const unusedTrending = trendingTech.filter(tech => !usedLanguages.has(tech));
      suggestions.push(...unusedTrending.slice(0, 2));
    }
    
    // Remove duplicates and pick top suggestions
    const uniqueSuggestions = [...new Set(suggestions)];
    
    // Calculate confidence based on language diversity and activity
    const confidence = Math.min(0.9, 0.5 + (uniqueLanguages * 0.1) + (repos.length * 0.01));
    
    return {
      primary: uniqueSuggestions[0] || 'React',
      alternatives: uniqueSuggestions.slice(1, 4),
      confidence: confidence,
      reasoning: this.getTechRecommendationReasoning(languages, uniqueLanguages)
    };
  },

  getTechRecommendationReasoning(languages, uniqueLanguages) {
    if (uniqueLanguages >= 5) {
      return 'Based on your diverse technology experience';
    } else if (languages.includes('JavaScript') && languages.includes('Python')) {
      return 'Perfect for full-stack development progression';
    } else if (languages.includes('JavaScript')) {
      return 'Natural evolution of your JavaScript skills';
    } else if (languages.includes('Python')) {
      return 'Complements your Python expertise well';
    } else {
      return 'Popular choice for modern development';
    }
  },

  predictActivityTrend(events) {
    if (events.length < 10) {
      return { 
        trend: 'Building Momentum 📈', 
        confidence: 0.6,
        description: 'Start building consistent coding habits'
      };
    }
    
    // Analyze recent vs older activity
    const recent = events.slice(0, Math.floor(events.length / 3));
    const middle = events.slice(Math.floor(events.length / 3), Math.floor(events.length * 2 / 3));
    const older = events.slice(Math.floor(events.length * 2 / 3));
    
    const recentActivity = recent.length;
    const middleActivity = middle.length;
    const olderActivity = older.length;
    
    // Calculate trend
    const recentToMiddle = recentActivity / Math.max(middleActivity, 1);
    const middleToOlder = middleActivity / Math.max(olderActivity, 1);
    const overallTrend = (recentToMiddle + middleToOlder) / 2;
    
    // Analyze activity types
    const commitEvents = recent.filter(e => e.type === 'PushEvent').length;
    const collaborativeEvents = recent.filter(e => 
      e.type === 'PullRequestEvent' || e.type === 'IssuesEvent'
    ).length;
    
    let trend, description, confidence;
    
    if (overallTrend > 1.3) {
      trend = 'Rapidly Increasing 🚀';
      description = 'Your coding activity is accelerating significantly';
      confidence = 0.9;
    } else if (overallTrend > 1.1) {
      trend = 'Steadily Growing 📈';
      description = 'Consistent upward trend in development activity';
      confidence = 0.8;
    } else if (overallTrend > 0.9) {
      trend = 'Stable & Consistent 📊';
      description = 'Maintaining steady development rhythm';
      confidence = 0.9;
    } else if (overallTrend > 0.7) {
      trend = 'Slightly Decreasing 📉';
      description = 'Minor decline, consider new projects for motivation';
      confidence = 0.8;
    } else {
      trend = 'Needs Attention 🔄';
      description = 'Activity has decreased, time to reignite your coding passion';
      confidence = 0.7;
    }
    
    // Add activity type insights
    if (collaborativeEvents > commitEvents) {
      description += ' • Strong collaboration focus';
    } else if (commitEvents > collaborativeEvents * 2) {
      description += ' • High development velocity';
    }
    
    return { trend, confidence, description };
  },

  predictCollaborationGrowth(events) {
    const collaborativeEvents = events.filter(e => 
      e.type === 'PullRequestEvent' || 
      e.type === 'IssuesEvent' ||
      e.type === 'PullRequestReviewEvent' ||
      e.type === 'IssueCommentEvent'
    );
    
    if (collaborativeEvents.length < 5) {
      return { 
        trend: 'Start Collaborating 🤝', 
        confidence: 0.7,
        suggestion: 'Consider contributing to open source projects'
      };
    }
    
    // Split into periods
    const recent = collaborativeEvents.slice(0, Math.floor(collaborativeEvents.length / 2));
    const older = collaborativeEvents.slice(Math.floor(collaborativeEvents.length / 2));
    
    const recentCollab = recent.length;
    const olderCollab = older.length;
    const growthRatio = recentCollab / Math.max(olderCollab, 1);
    
    // Analyze collaboration diversity
    const uniqueRepos = new Set(collaborativeEvents.map(e => e.repo?.name)).size;
    const uniqueOrgs = new Set(collaborativeEvents.map(e => e.org?.login).filter(Boolean)).size;
    
    let trend, suggestion, confidence;
    
    if (growthRatio > 1.5) {
      trend = 'Rapidly Expanding Network 🌟';
      suggestion = 'Excellent collaboration growth, consider mentoring others';
      confidence = 0.9;
    } else if (growthRatio > 1.2) {
      trend = 'Growing Collaboration 📈';
      suggestion = 'Great progress in community engagement';
      confidence = 0.8;
    } else if (growthRatio > 0.8) {
      trend = 'Stable Community Presence 🔄';
      suggestion = 'Consistent engagement, try exploring new communities';
      confidence = 0.8;
    } else {
      trend = 'Rebuild Connections 🔗';
      suggestion = 'Re-engage with the community through issues and PRs';
      confidence = 0.7;
    }
    
    if (uniqueOrgs > 3) {
      suggestion += ' • Strong multi-org presence';
    } else if (uniqueRepos > 10) {
      suggestion += ' • Good project diversity';
    }
    
    return { trend, confidence, suggestion };
  },

  predictSkillDevelopment(repos, events) {
    const recentRepos = repos.slice(0, Math.min(5, repos.length));
    const allLanguages = new Set(repos.map(r => r.language).filter(Boolean));
    const recentLanguages = new Set(recentRepos.map(r => r.language).filter(Boolean));
    
    // Check for learning indicators
    const learningKeywords = ['tutorial', 'learning', 'practice', 'exercise', 'course', 'bootcamp', 'study'];
    const experimentalKeywords = ['experiment', 'prototype', 'demo', 'test', 'trial', 'poc'];
    
    const learningProjects = repos.filter(r => {
      const name = (r.name || '').toLowerCase();
      const desc = (r.description || '').toLowerCase();
      return learningKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword));
    }).length;
    
    const experimentalProjects = repos.filter(r => {
      const name = (r.name || '').toLowerCase();
      const desc = (r.description || '').toLowerCase();
      return experimentalKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword));
    }).length;
    
    // Analyze skill development velocity
    const totalLanguages = allLanguages.size;
    const newLanguages = [...recentLanguages].filter(lang => 
      !repos.slice(5).some(r => r.language === lang)
    ).length;
    
    let learningVelocity, skillDiversification, confidence, insights;
    
    // Determine learning velocity
    if (learningProjects >= 3 || experimentalProjects >= 2) {
      learningVelocity = 'High - Active Learner 🔥';
      insights = 'Strong commitment to continuous learning';
    } else if (learningProjects >= 1 || newLanguages >= 2) {
      learningVelocity = 'Moderate - Steady Growth 📈';
      insights = 'Consistent skill development pattern';
    } else if (newLanguages >= 1) {
      learningVelocity = 'Slow but Steady 🐢';
      insights = 'Gradual expansion of skill set';
    } else {
      learningVelocity = 'Deepening Expertise 🎯';
      insights = 'Focusing on mastering current technologies';
    }
    
    // Determine skill diversification
    if (totalLanguages >= 6) {
      skillDiversification = 'Polyglot Developer 🌈';
    } else if (totalLanguages >= 4) {
      skillDiversification = 'Well-Rounded 🔄';
    } else if (totalLanguages >= 2) {
      skillDiversification = 'Expanding Horizons 📚';
    } else {
      skillDiversification = 'Specialist Focus 🎯';
    }
    
    confidence = Math.min(0.9, 0.6 + (repos.length * 0.02) + (totalLanguages * 0.05));
    
    return {
      learningVelocity,
      skillDiversification,
      confidence,
      insights,
      recommendations: this.getSkillDevelopmentRecommendations(totalLanguages, learningProjects)
    };
  },

  getSkillDevelopmentRecommendations(totalLanguages, learningProjects) {
    const recommendations = [];
    
    if (totalLanguages < 3) {
      recommendations.push('Try a different programming paradigm (functional, object-oriented)');
    } else if (totalLanguages < 5) {
      recommendations.push('Explore cloud technologies or DevOps tools');
    } else {
      recommendations.push('Consider specializing in a specific domain (AI, security, etc.)');
    }
    
    if (learningProjects < 2) {
      recommendations.push('Create more learning-focused repositories');
    }
    
    return recommendations;
  },

  // ================================
  // UTILITY METHODS
  // ================================

  groupEventsByDay(events) {
    return events.reduce((groups, event) => {
      const date = new Date(event.created_at).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(event);
      return groups;
    }, {});
  },

  calculateDistribution(items) {
    const counts = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
    
    const total = items.length;
    return Object.fromEntries(
      Object.entries(counts).map(([key, count]) => [key, count / total])
    );
  },

  determinePersonalityType(metrics) {
    const { innovation, collaboration, consistency, exploration } = metrics;
    
    if (innovation > 7 && exploration > 7) return 'Innovator 🚀';
    if (collaboration > 7 && consistency > 7) return 'Team Player 🤝';
    if (consistency > 8) return 'Reliable Contributor 🎯';
    if (exploration > 8) return 'Technology Explorer 🔍';
    return 'Balanced Developer ⚖️';
  },

  generatePersonalityDescription(metrics) {
    const type = this.determinePersonalityType(metrics);
    
    const descriptions = {
      'Innovator 🚀': 'You love experimenting with new technologies and creating original solutions.',
      'Team Player 🤝': 'You excel at collaboration and maintain consistent, reliable contributions.',
      'Reliable Contributor 🎯': 'You are known for consistent, high-quality work and dependability.',
      'Technology Explorer 🔍': 'You enjoy learning diverse technologies and exploring new domains.',
      'Balanced Developer ⚖️': 'You maintain a well-rounded approach to development and collaboration.'
    };
    
    return descriptions[type] || 'A skilled developer with unique strengths.';
  },

  identifyStrengths(metrics) {
    const strengths = [];
    
    if (metrics.innovation > 7) strengths.push('Innovation & Creativity');
    if (metrics.collaboration > 7) strengths.push('Team Collaboration');
    if (metrics.consistency > 7) strengths.push('Reliable Delivery');
    if (metrics.exploration > 7) strengths.push('Technology Adaptability');
    if (metrics.leadership > 7) strengths.push('Technical Leadership');
    
    return strengths.length ? strengths : ['Dedicated Development', 'Problem Solving'];
  },

  identifyGrowthAreas(metrics) {
    const areas = [];
    
    if (metrics.innovation < 5) areas.push('Experiment with new technologies');
    if (metrics.collaboration < 5) areas.push('Increase community involvement');
    if (metrics.consistency < 5) areas.push('Develop regular coding habits');
    if (metrics.exploration < 5) areas.push('Try diverse programming languages');
    if (metrics.leadership < 5) areas.push('Take ownership of projects');
    
    return areas.length ? areas : ['Continue current excellent practices'];
  },

  analyzeBasicPatterns(userData) {
    // Simplified analysis for recommendation generation
    return {
      languages: userData.repositories?.map(r => r.language).filter(Boolean) || [],
      repoCount: userData.public_repos || 0,
      followerCount: userData.followers || 0,
      recentActivity: userData.events?.length || 0
    };
  },

  // ================================
  // MISSING ANALYSIS METHODS
  // ================================

  analyzeProjectJuggling(events) {
    const repoActivity = {};
    events.forEach(event => {
      const repo = event.repo?.name;
      if (repo) {
        repoActivity[repo] = (repoActivity[repo] || 0) + 1;
      }
    });
    
    const uniqueRepos = Object.keys(repoActivity).length;
    const totalEvents = events.length || 1;
    
    return {
      uniqueProjects: uniqueRepos,
      averageEventsPerProject: totalEvents / uniqueRepos,
      multitaskingScore: Math.min(10, uniqueRepos / 5 * 10)
    };
  },

  estimateSessionLength(events) {
    if (events.length < 2) return { average: 'Unknown', pattern: 'Insufficient data' };
    
    // Group events by day and analyze gaps
    const dailyEvents = this.groupEventsByDay(events);
    const sessionLengths = [];
    
    Object.values(dailyEvents).forEach(dayEvents => {
      if (dayEvents.length < 2) return;
      
      dayEvents.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      
      for (let i = 1; i < dayEvents.length; i++) {
        const gap = (new Date(dayEvents[i].created_at) - new Date(dayEvents[i-1].created_at)) / (1000 * 60); // minutes
        if (gap < 240) { // Less than 4 hours gap = same session
          sessionLengths.push(gap);
        }
      }
    });
    
    if (sessionLengths.length === 0) return { average: '1-2 hours', pattern: 'Focused sessions' };
    
    const averageGap = sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length;
    
    if (averageGap < 30) return { average: 'Short bursts', pattern: 'Frequent check-ins' };
    if (averageGap < 120) return { average: '1-2 hours', pattern: 'Focused sessions' };
    return { average: '2+ hours', pattern: 'Deep work sessions' };
  },

  calculateWorkConsistency(weeklyPattern) {
    const totalActivity = weeklyPattern.reduce((a, b) => a + b, 0);
    if (totalActivity === 0) return 5;
    
    const mean = totalActivity / 7;
    const variance = weeklyPattern.reduce((sum, day) => sum + Math.pow(day - mean, 2), 0) / 7;
    const stdDev = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    return Math.max(0, Math.min(10, 10 - (stdDev / mean) * 3));
  },

  analyzeLanguagePreferences(repos) {
    const languages = repos.map(r => r.language).filter(Boolean);
    const distribution = this.calculateDistribution(languages);
    
    // Convert to preferences with scoring
    const preferences = {};
    Object.entries(distribution).forEach(([lang, freq]) => {
      preferences[lang] = freq;
    });
    
    return preferences;
  },

  categorizeProjectTypes(repos) {
    const categories = [];
    
    repos.forEach(repo => {
      const name = repo.name?.toLowerCase() || '';
      const desc = repo.description?.toLowerCase() || '';
      
      if (name.includes('api') || desc.includes('api')) categories.push('API Development');
      if (name.includes('web') || desc.includes('website')) categories.push('Web Development');
      if (name.includes('mobile') || desc.includes('android') || desc.includes('ios')) categories.push('Mobile Development');
      if (name.includes('game') || desc.includes('game')) categories.push('Game Development');
      if (name.includes('ml') || desc.includes('machine learning') || desc.includes('ai')) categories.push('Machine Learning');
      if (name.includes('tool') || desc.includes('tool') || desc.includes('utility')) categories.push('Developer Tools');
      if (name.includes('lib') || desc.includes('library')) categories.push('Library Development');
    });
    
    return [...new Set(categories)].slice(0, 5) || ['General Development'];
  },

  analyzeCommitStyle(events) {
    const pushEvents = events.filter(e => e.type === 'PushEvent');
    if (pushEvents.length === 0) return { style: 'Unknown', pattern: 'No push events found' };
    
    const commitCounts = pushEvents.map(e => e.payload?.commits?.length || 1);
    const averageCommitsPerPush = commitCounts.reduce((a, b) => a + b, 0) / commitCounts.length;
    
    if (averageCommitsPerPush < 2) return { style: 'Atomic Commits', pattern: 'Small, focused changes' };
    if (averageCommitsPerPush < 5) return { style: 'Moderate Batches', pattern: 'Balanced approach' };
    return { style: 'Large Batches', pattern: 'Comprehensive changes' };
  },

  analyzeTestingApproach(repos) {
    const testIndicators = repos.filter(repo => {
      const name = repo.name?.toLowerCase() || '';
      const desc = repo.description?.toLowerCase() || '';
      return name.includes('test') || desc.includes('test') || desc.includes('testing');
    });
    
    const testRatio = testIndicators.length / (repos.length || 1);
    
    if (testRatio > 0.3) return 'Test-Driven Development';
    if (testRatio > 0.1) return 'Testing-Aware';
    return 'Exploratory Development';
  },

  analyzeArchitectureStyle(repos) {
    const patterns = [];
    
    repos.forEach(repo => {
      const name = repo.name?.toLowerCase() || '';
      const desc = repo.description?.toLowerCase() || '';
      
      if (desc.includes('microservice') || desc.includes('micro-service')) patterns.push('Microservices');
      if (desc.includes('monolith')) patterns.push('Monolithic');
      if (desc.includes('serverless') || desc.includes('lambda')) patterns.push('Serverless');
      if (desc.includes('docker') || desc.includes('container')) patterns.push('Containerized');
      if (desc.includes('mvc') || desc.includes('mvp') || desc.includes('mvvm')) patterns.push('MV* Pattern');
    });
    
    return [...new Set(patterns)].slice(0, 3) || ['Standard Architecture'];
  },

  assessTeamPlayerScore(events) {
    const collaborativeEvents = events.filter(e => 
      e.type === 'PullRequestEvent' || 
      e.type === 'IssuesEvent' || 
      e.type === 'PullRequestReviewEvent' ||
      e.type === 'IssueCommentEvent'
    ).length;
    
    return Math.min(10, (collaborativeEvents / (events.length || 1)) * 20);
  },

  analyzeMentorshipStyle(events) {
    const helpfulEvents = events.filter(e => 
      e.type === 'IssueCommentEvent' || 
      e.type === 'PullRequestReviewEvent'
    ).length;
    
    if (helpfulEvents > 20) return 'Active Mentor';
    if (helpfulEvents > 10) return 'Helpful Contributor';
    if (helpfulEvents > 5) return 'Occasional Helper';
    return 'Focus on Own Work';
  },

  analyzeCommunicationStyle(events) {
    const communicationEvents = events.filter(e => 
      e.type === 'IssueCommentEvent' || 
      e.type === 'PullRequestReviewEvent' ||
      e.type === 'IssuesEvent'
    ).length;
    
    const ratio = communicationEvents / (events.length || 1);
    
    if (ratio > 0.4) return 'Highly Communicative';
    if (ratio > 0.2) return 'Good Communicator';
    if (ratio > 0.1) return 'Moderate Communicator';
    return 'Task-Focused';
  },

  assessLeadershipTendencies(repos, events) {
    const ownedRepos = repos.filter(r => !r.fork).length;
    const starredRepos = repos.reduce((total, repo) => total + (repo.stargazers_count || 0), 0);
    const organizationActivity = events.filter(e => e.org).length;
    
    const leadership = (ownedRepos * 2 + starredRepos * 0.1 + organizationActivity * 0.5) / 10;
    
    if (leadership > 8) return 'Strong Leader';
    if (leadership > 5) return 'Emerging Leader';
    if (leadership > 2) return 'Team Contributor';
    return 'Individual Contributor';
  },

  estimateNetworkSize(events) {
    const uniqueRepos = new Set(events.map(e => e.repo?.name).filter(Boolean)).size;
    const uniqueOrgs = new Set(events.map(e => e.org?.login).filter(Boolean)).size;
    
    return {
      repositoryNetwork: uniqueRepos,
      organizationNetwork: uniqueOrgs,
      networkScore: Math.min(10, (uniqueRepos * 0.2 + uniqueOrgs * 2))
    };
  },

  predictCollaborationGrowth(events) {
    const recent = events.slice(0, 15);
    const older = events.slice(15, 30);
    
    const recentCollab = recent.filter(e => 
      e.type === 'PullRequestEvent' || e.type === 'IssuesEvent'
    ).length;
    
    const olderCollab = older.filter(e => 
      e.type === 'PullRequestEvent' || e.type === 'IssuesEvent'
    ).length;
    
    if (recentCollab > olderCollab * 1.3) {
      return { trend: 'Increasing Collaboration 🤝', confidence: 0.8 };
    } else if (recentCollab < olderCollab * 0.7) {
      return { trend: 'Focusing Inward 🔄', confidence: 0.7 };
    } else {
      return { trend: 'Stable Collaboration 📊', confidence: 0.9 };
    }
  },

  predictSkillDevelopment(repos, events) {
    const recentRepos = repos.slice(0, 5);
    const recentLanguages = new Set(recentRepos.map(r => r.language).filter(Boolean));
    const experimentalProjects = recentRepos.filter(r => 
      r.description?.includes('learning') || 
      r.description?.includes('tutorial') ||
      r.description?.includes('experiment')
    ).length;
    
    return {
      learningVelocity: experimentalProjects > 2 ? 'High' : experimentalProjects > 0 ? 'Moderate' : 'Stable',
      skillDiversification: recentLanguages.size > 2 ? 'Expanding' : 'Deepening',
      confidence: 0.7
    };
  },

  analyzeRisks(userData) {
    const events = userData.events || [];
    const repos = userData.repositories || [];
    
    return {
      burnoutRisk: this.assessBurnoutRisk(events, this.analyzeWeeklyPattern(events)),
      skillStagnation: this.assessSkillStagnation(repos),
      collaborationIsolation: this.assessCollaborationIsolation(events)
    };
  },

  assessSkillStagnation(repos) {
    const languages = repos.map(r => r.language).filter(Boolean);
    const uniqueLanguages = new Set(languages).size;
    const recentLanguages = new Set(repos.slice(0, 5).map(r => r.language).filter(Boolean)).size;
    
    if (recentLanguages < uniqueLanguages * 0.3) {
      return { level: 'Medium', advice: 'Consider exploring new technologies to maintain growth' };
    } else {
      return { level: 'Low', advice: 'Good variety in technology exploration' };
    }
  },

  assessCollaborationIsolation(events) {
    const collaborativeEvents = events.filter(e => 
      e.type === 'PullRequestEvent' || 
      e.type === 'IssuesEvent' || 
      e.type === 'PullRequestReviewEvent'
    ).length;
    
    const collaborationRatio = collaborativeEvents / (events.length || 1);
    
    if (collaborationRatio < 0.1) {
      return { level: 'High', advice: 'Consider engaging more with the GitHub community' };
    } else if (collaborationRatio < 0.2) {
      return { level: 'Medium', advice: 'Good collaboration, consider expanding your network' };
    } else {
      return { level: 'Low', advice: 'Excellent community engagement' };
    }
  }
};
