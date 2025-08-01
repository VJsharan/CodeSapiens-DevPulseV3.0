/**
 * AI Insights UI Component
 * Renders AI-powered insights in a beautiful, interactive interface
 */

window.DevPulseAIUI = {
  
  /**
   * Render AI insights section in the dashboard
   * @param {Object} insights - AI-generated insights
   * @param {string} username - GitHub username
   */
  renderAIInsights(insights, username) {
    console.log('🎨 Rendering AI insights UI...');
    
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;
    
    // Create AI insights section
    const aiSection = this.createAISection(insights, username);
    
    // Insert after user profile section
    const profileSection = document.getElementById('user-profile');
    if (profileSection && profileSection.nextSibling) {
      dashboard.insertBefore(aiSection, profileSection.nextSibling);
    } else {
      dashboard.appendChild(aiSection);
    }
    
    // Initialize interactive elements
    this.initializeInteractiveElements();
    
    console.log('✅ AI insights UI rendered successfully');
  },

  /**
   * Create the main AI insights section
   * @param {Object} insights - AI insights data
   * @param {string} username - GitHub username
   * @returns {Element} AI section element
   */
  createAISection(insights, username) {
    const section = document.createElement('section');
    section.id = 'ai-insights';
    section.className = 'dashboard-section ai-insights-section hover-lift animate-on-load';
    section.style.animationDelay = '0.2s';
    
    section.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          AI-Powered Insights
          <span class="ai-badge">🤖 AI</span>
        </h2>
        <div class="ai-controls">
          <button class="ai-refresh-btn" title="Refresh AI Analysis">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
          <button class="ai-export-btn" title="Export AI Report">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="ai-insights-content">
        
        <!-- Personality Profile -->
        <div class="ai-card personality-card">
          <div class="card-header">
            <h3 class="card-title">
              <span class="card-icon">${insights.personalityProfile.type.split(' ')[1] || '🧠'}</span>
              Developer Personality
            </h3>
            <div class="personality-type">${insights.personalityProfile.type}</div>
          </div>
          <div class="card-content">
            <p class="personality-description">${insights.personalityProfile.description}</p>
            
            <div class="personality-metrics">
              ${this.renderPersonalityMetrics(insights.personalityProfile.scores)}
            </div>
            
            <div class="personality-traits">
              <div class="strengths">
                <h4>💪 Strengths</h4>
                <ul>
                  ${insights.personalityProfile.strengths.map(strength => `<li>${strength}</li>`).join('')}
                </ul>
              </div>
              <div class="growth-areas">
                <h4>🌱 Growth Areas</h4>
                <ul>
                  ${insights.personalityProfile.growthAreas.map(area => `<li>${area}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Work Patterns -->
        <div class="ai-card work-patterns-card">
          <div class="card-header">
            <h3 class="card-title">
              <span class="card-icon">⏰</span>
              Work Patterns
            </h3>
            <div class="working-style">${insights.workPatterns.workingStyle}</div>
          </div>
          <div class="card-content">
            <div class="work-metrics">
              <div class="metric">
                <span class="metric-label">Peak Hours</span>
                <span class="metric-value">${this.formatPeakHours(insights.workPatterns.peakHours)}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Consistency</span>
                <span class="metric-value">${insights.workPatterns.consistency.toFixed(1)}/10</span>
              </div>
              <div class="metric burnout-metric">
                <span class="metric-label">Burnout Risk</span>
                <span class="metric-value ${insights.workPatterns.burnoutRisk.level.toLowerCase()}">${insights.workPatterns.burnoutRisk.level}</span>
              </div>
            </div>
            <div class="burnout-advice">
              <p>💡 ${insights.workPatterns.burnoutRisk.advice}</p>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="ai-card recommendations-card">
          <div class="card-header">
            <h3 class="card-title">
              <span class="card-icon">💡</span>
              Personalized Recommendations
            </h3>
          </div>
          <div class="card-content">
            <div class="recommendations-grid">
              ${insights.recommendations.map(rec => this.renderRecommendation(rec)).join('')}
            </div>
          </div>
        </div>

        <!-- Predictions -->
        <div class="ai-card predictions-card">
          <div class="card-header">
            <h3 class="card-title">
              <span class="card-icon">🔮</span>
              Future Predictions
            </h3>
          </div>
          <div class="card-content">
            <div class="predictions-grid">
              <div class="prediction-item">
                <h4>📈 Activity Trend</h4>
                <div class="prediction-value">${insights.predictions.activityTrend.trend}</div>
                <div class="confidence">Confidence: ${Math.round(insights.predictions.activityTrend.confidence * 100)}%</div>
              </div>
              <div class="prediction-item">
                <h4>🚀 Next Technology</h4>
                <div class="prediction-value">${insights.predictions.nextTechnology.primary}</div>
                <div class="alternatives">
                  Also consider: ${insights.predictions.nextTechnology.alternatives.slice(0, 2).join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Coding Style Analysis -->
        <div class="ai-card coding-style-card">
          <div class="card-header">
            <h3 class="card-title">
              <span class="card-icon">👨‍💻</span>
              Coding Style Analysis
            </h3>
          </div>
          <div class="card-content">
            <div class="coding-analysis">
              <div class="language-preferences">
                <h4>🔧 Language Preferences</h4>
                <div class="language-tags">
                  ${this.renderLanguageTags(insights.codingStyle.languagePreferences)}
                </div>
              </div>
              <div class="project-types">
                <h4>📂 Project Types</h4>
                <div class="project-categories">
                  ${insights.codingStyle.projectTypes.map(type => `<span class="project-tag">${type}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
    
    return section;
  },

  /**
   * Render personality metrics as progress bars
   * @param {Object} scores - Personality scores
   * @returns {string} HTML string
   */
  renderPersonalityMetrics(scores) {
    const metrics = [
      { key: 'innovation', label: 'Innovation', icon: '🚀' },
      { key: 'collaboration', label: 'Collaboration', icon: '🤝' },
      { key: 'consistency', label: 'Consistency', icon: '📈' },
      { key: 'exploration', label: 'Exploration', icon: '🔍' },
      { key: 'leadership', label: 'Leadership', icon: '👑' }
    ];

    return metrics.map(metric => {
      const score = scores[metric.key] || 5;
      const percentage = (score / 10) * 100;
      
      return `
        <div class="metric-bar">
          <div class="metric-header">
            <span class="metric-icon">${metric.icon}</span>
            <span class="metric-name">${metric.label}</span>
            <span class="metric-score">${score.toFixed(1)}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%" data-score="${score}"></div>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Render a single recommendation
   * @param {Object} rec - Recommendation object
   * @returns {string} HTML string
   */
  renderRecommendation(rec) {
    const confidenceClass = rec.confidence > 0.8 ? 'high' : rec.confidence > 0.6 ? 'medium' : 'low';
    
    return `
      <div class="recommendation-item ${rec.type.toLowerCase()}-recommendation">
        <div class="rec-header">
          <span class="rec-icon">${rec.icon}</span>
          <span class="rec-type">${rec.type}</span>
          <div class="confidence-badge ${confidenceClass}">
            ${Math.round(rec.confidence * 100)}%
          </div>
        </div>
        <h4 class="rec-title">${rec.title}</h4>
        <p class="rec-description">${rec.description}</p>
        <button class="rec-action-btn" data-rec-type="${rec.type}" data-rec-title="${rec.title}">
          Learn More
        </button>
      </div>
    `;
  },

  /**
   * Render language preference tags
   * @param {Object} preferences - Language preferences
   * @returns {string} HTML string
   */
  renderLanguageTags(preferences) {
    if (!preferences || typeof preferences !== 'object') {
      return '<span class="no-data">Analyzing code patterns...</span>';
    }
    
    return Object.entries(preferences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, score]) => {
        const intensity = score > 0.3 ? 'high' : score > 0.1 ? 'medium' : 'low';
        return `<span class="lang-tag ${intensity}">${lang}</span>`;
      })
      .join('');
  },

  /**
   * Format peak hours for display
   * @param {Array} peakHours - Array of peak hour numbers
   * @returns {string} Formatted string
   */
  formatPeakHours(peakHours) {
    if (!peakHours || !peakHours.length) return 'Various';
    
    const formatHour = (hour) => {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}${ampm}`;
    };
    
    if (peakHours.length === 1) {
      return formatHour(peakHours[0]);
    } else if (peakHours.length <= 3) {
      return peakHours.map(formatHour).join(', ');
    } else {
      return `${formatHour(Math.min(...peakHours))}-${formatHour(Math.max(...peakHours))}`;
    }
  },

  /**
   * Initialize interactive elements
   */
  initializeInteractiveElements() {
    // Animate progress bars
    setTimeout(() => {
      const progressBars = document.querySelectorAll('.progress-fill');
      progressBars.forEach(bar => {
        bar.style.transition = 'width 1s ease-out';
        bar.style.width = '0%';
        setTimeout(() => {
          const targetWidth = (parseFloat(bar.dataset.score) / 10) * 100;
          bar.style.width = `${targetWidth}%`;
        }, 100);
      });
    }, 500);

    // Add hover effects to recommendation cards
    const recItems = document.querySelectorAll('.recommendation-item');
    recItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      });
      
      item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '';
      });
    });

    // Handle recommendation actions
    const recActionBtns = document.querySelectorAll('.rec-action-btn');
    recActionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.dataset.recType;
        const title = e.target.dataset.recTitle;
        this.handleRecommendationAction(type, title);
      });
    });

    // AI refresh button
    const refreshBtn = document.querySelector('.ai-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.refreshAIAnalysis();
      });
    }

    // AI export button
    const exportBtn = document.querySelector('.ai-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportAIReport();
      });
    }
  },

  /**
   * Handle recommendation action
   * @param {string} type - Recommendation type
   * @param {string} title - Recommendation title
   */
  handleRecommendationAction(type, title) {
    const actionMap = {
      'Technology': 'https://github.com/topics/',
      'Learning': 'https://github.com/search?q=',
      'Productivity': 'https://docs.github.com/',
      'Career': 'https://github.com/explore'
    };
    
    const baseUrl = actionMap[type] || 'https://github.com/explore';
    const searchTerm = title.toLowerCase().replace(/\s+/g, '-');
    
    // Show modal with more details instead of direct navigation
    this.showRecommendationModal(type, title);
  },

  /**
   * Show recommendation details modal
   * @param {string} type - Recommendation type
   * @param {string} title - Recommendation title
   */
  showRecommendationModal(type, title) {
    const modal = document.createElement('div');
    modal.className = 'ai-recommendation-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="this.closest('.ai-recommendation-modal').remove()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="this.closest('.ai-recommendation-modal').remove()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>This ${type.toLowerCase()} recommendation is based on AI analysis of your coding patterns and GitHub activity.</p>
          <div class="action-buttons">
            <button class="btn-primary" onclick="window.open('https://github.com/search?q=${title.replace(/\s+/g, '+')}', '_blank')">
              Search on GitHub
            </button>
            <button class="btn-secondary" onclick="this.closest('.ai-recommendation-modal').remove()">
              Got it
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  },

  /**
   * Refresh AI analysis
   */
  async refreshAIAnalysis() {
    const refreshBtn = document.querySelector('.ai-refresh-btn');
    if (refreshBtn) {
      refreshBtn.style.animation = 'spin 1s linear infinite';
      refreshBtn.disabled = true;
    }

    try {
      // Re-run AI analysis
      if (window.DevPulse && window.DevPulse.currentUserData) {
        const insights = await window.DevPulseAI.generateInsights(window.DevPulse.currentUserData);
        
        // Update the existing AI section
        const existingSection = document.getElementById('ai-insights');
        if (existingSection) {
          existingSection.remove();
        }
        
        this.renderAIInsights(insights, window.DevPulse.currentUsername);
        
        // Show success toast
        if (window.DevPulse.showToast) {
          window.DevPulse.showToast('AI analysis refreshed successfully!', 'success');
        }
      }
    } catch (error) {
      console.error('Failed to refresh AI analysis:', error);
      if (window.DevPulse.showToast) {
        window.DevPulse.showToast('Failed to refresh AI analysis', 'error');
      }
    } finally {
      if (refreshBtn) {
        refreshBtn.style.animation = '';
        refreshBtn.disabled = false;
      }
    }
  },

  /**
   * Export AI report
   */
  exportAIReport() {
    const insights = this.getCurrentInsights();
    if (!insights) return;

    const report = {
      username: window.DevPulse?.currentUsername || 'unknown',
      generatedAt: new Date().toISOString(),
      insights: insights
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-insights-${report.username}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.DevPulse.showToast) {
      window.DevPulse.showToast('AI report exported successfully!', 'success');
    }
  },

  /**
   * Get current insights from DOM
   * @returns {Object} Current insights data
   */
  getCurrentInsights() {
    // This would extract current insights from the DOM
    // For now, return placeholder
    return {
      personalityProfile: { type: 'Extracted from DOM' },
      workPatterns: {},
      recommendations: [],
      predictions: {}
    };
  }
};
