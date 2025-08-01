/**
 * DevPulse v3.0 - Charts Module
 * Handles all data visualization using Chart.js
 */

window.DevPulseCharts = {
  
  // ================================
  // INITIALIZATION
  // ================================
  
  config: null,
  charts: {},
  chartDefaults: null,

  /**
   * Initialize the charts module
   */
  init() {
    this.config = window.DevPulseConfig;
    this.setupChartDefaults();
    console.log('📊 DevPulse Charts initialized');
  },

  /**
   * Setup Chart.js defaults
   */
  setupChartDefaults() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded, charts will not work');
      return;
    }

    const config = this.config;
    const isDark = window.DevPulseUI?.getCurrentTheme() === 'dark';
    
    // Register Chart.js components
    Chart.register(
      Chart.CategoryScale,
      Chart.LinearScale,
      Chart.PointElement,
      Chart.LineElement,
      Chart.BarElement,
      Chart.ArcElement,
      Chart.Title,
      Chart.Tooltip,
      Chart.Legend,
      Chart.Filler
    );

    // Set global defaults
    Chart.defaults.font.family = config.get('ui.typography.fontFamily', '"Inter", system-ui, sans-serif');
    Chart.defaults.font.size = config.get('charts.fontSize', 12);
    Chart.defaults.color = isDark ? '#e5e7eb' : '#374151';
    Chart.defaults.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    Chart.defaults.borderColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
    Chart.defaults.plugins.tooltip.backgroundColor = isDark ? '#1f2937' : '#ffffff';
    Chart.defaults.plugins.tooltip.borderColor = isDark ? '#374151' : '#e5e7eb';
    Chart.defaults.plugins.tooltip.titleColor = isDark ? '#f9fafb' : '#111827';
    Chart.defaults.plugins.tooltip.bodyColor = isDark ? '#e5e7eb' : '#374151';

    this.chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: config.get('ui.animations.enabled', true) ? config.get('charts.animationDuration', 1000) : 0
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              weight: '500'
            }
          }
        },
        tooltip: {
          enabled: true,
          mode: 'nearest',
          intersect: false,
          cornerRadius: 8,
          padding: 12,
          borderWidth: 1,
          displayColors: true,
          callbacks: {
            title: (context) => {
              return context[0]?.label || '';
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: 11
            }
          }
        },
        y: {
          grid: {
            display: true,
            color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: 11
            }
          }
        }
      }
    };
  },

  // ================================
  // CONTRIBUTION CALENDAR
  // ================================
  
  /**
   * Create contribution calendar chart
   * @param {string} containerId - Container element ID
   * @param {Array} contributionData - Array of contribution data
   * @param {number} year - Year for the calendar
   */
  createContributionCalendar(containerId, contributionData, year = new Date().getFullYear()) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Process data into calendar format
    const calendarData = this.processContributionData(contributionData, year);
    
    // Create calendar HTML
    container.innerHTML = `
      <div class="contribution-calendar">
        <div class="calendar-header">
          <h3 class="calendar-title">${year} Contributions</h3>
          <div class="calendar-legend">
            <span class="legend-label">Less</span>
            <div class="legend-colors">
              <div class="legend-color" data-level="0"></div>
              <div class="legend-color" data-level="1"></div>
              <div class="legend-color" data-level="2"></div>
              <div class="legend-color" data-level="3"></div>
              <div class="legend-color" data-level="4"></div>
            </div>
            <span class="legend-label">More</span>
          </div>
        </div>
        <div class="calendar-grid" id="${containerId}-grid">
          ${this.generateCalendarGrid(calendarData, year)}
        </div>
        <div class="calendar-stats">
          <div class="stat-item">
            <span class="stat-value">${calendarData.totalContributions}</span>
            <span class="stat-label">Total contributions</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${calendarData.streakDays}</span>
            <span class="stat-label">Longest streak</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${calendarData.activeDays}</span>
            <span class="stat-label">Active days</span>
          </div>
        </div>
      </div>
    `;

    // Add interactivity
    this.setupCalendarInteractivity(containerId, calendarData);
  },

  /**
   * Process contribution data for calendar
   * @param {Array} data - Raw contribution data
   * @param {number} year - Target year
   * @returns {Object} Processed calendar data
   */
  processContributionData(data, year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const dayData = new Map();
    
    let totalContributions = 0;
    let activeDays = 0;
    let currentStreak = 0;
    let longestStreak = 0;

    // Initialize all days of the year
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      dayData.set(dateKey, { date: new Date(d), count: 0, level: 0 });
    }

    // Fill in actual contribution data
    data.forEach(contribution => {
      const date = new Date(contribution.date);
      const dateKey = date.toISOString().split('T')[0];
      
      if (dayData.has(dateKey)) {
        const count = contribution.count || 0;
        const level = this.getContributionLevel(count);
        
        dayData.set(dateKey, {
          date: date,
          count: count,
          level: level
        });
        
        totalContributions += count;
        if (count > 0) {
          activeDays++;
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
    });

    return {
      dayData: dayData,
      totalContributions,
      activeDays,
      streakDays: longestStreak,
      year
    };
  },

  /**
   * Get contribution level (0-4) based on count
   * @param {number} count - Contribution count
   * @returns {number} Level from 0-4
   */
  getContributionLevel(count) {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 10) return 3;
    return 4;
  },

  /**
   * Generate calendar grid HTML
   * @param {Object} calendarData - Processed calendar data
   * @param {number} year - Year
   * @returns {string} Calendar grid HTML
   */
  generateCalendarGrid(calendarData, year) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    let html = '';
    
    // Month labels
    html += '<div class="calendar-months">';
    months.forEach(month => {
      html += `<span class="month-label">${month}</span>`;
    });
    html += '</div>';
    
    // Day labels
    html += '<div class="calendar-days">';
    days.forEach((day, index) => {
      html += `<span class="day-label" ${index % 2 === 0 ? 'style="opacity: 1"' : 'style="opacity: 0"'}>${day}</span>`;
    });
    html += '</div>';
    
    // Calendar grid
    html += '<div class="calendar-weeks">';
    
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const firstDayOfWeek = startDate.getDay();
    
    // Start from the first Sunday of the year
    const gridStart = new Date(startDate);
    gridStart.setDate(gridStart.getDate() - firstDayOfWeek);
    
    let currentDate = new Date(gridStart);
    
    while (currentDate <= endDate || currentDate.getDay() !== 0) {
      if (currentDate.getDay() === 0) {
        html += '<div class="calendar-week">';
      }
      
      const dateKey = currentDate.toISOString().split('T')[0];
      const dayInfo = calendarData.dayData.get(dateKey);
      const isCurrentYear = currentDate.getFullYear() === year;
      
      html += `
        <div class="calendar-day ${isCurrentYear ? 'current-year' : 'other-year'}" 
             data-date="${dateKey}" 
             data-count="${dayInfo?.count || 0}"
             data-level="${dayInfo?.level || 0}"
             title="${this.formatCalendarTooltip(currentDate, dayInfo?.count || 0)}">
        </div>
      `;
      
      if (currentDate.getDay() === 6) {
        html += '</div>';
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    html += '</div>';
    
    return html;
  },

  /**
   * Setup calendar interactivity
   * @param {string} containerId - Container ID
   * @param {Object} calendarData - Calendar data
   */
  setupCalendarInteractivity(containerId, calendarData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const days = container.querySelectorAll('.calendar-day');
    
    days.forEach(day => {
      day.addEventListener('mouseenter', (e) => {
        const date = e.target.dataset.date;
        const count = parseInt(e.target.dataset.count);
        
        // Show enhanced tooltip
        this.showCalendarTooltip(e.target, date, count);
      });
      
      day.addEventListener('mouseleave', () => {
        this.hideCalendarTooltip();
      });
    });
  },

  /**
   * Format calendar tooltip
   * @param {Date} date - Date
   * @param {number} count - Contribution count
   * @returns {string} Formatted tooltip
   */
  formatCalendarTooltip(date, count) {
    const formattedDate = window.Utils.formatDate(date, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (count === 0) {
      return `No contributions on ${formattedDate}`;
    } else if (count === 1) {
      return `1 contribution on ${formattedDate}`;
    } else {
      return `${count} contributions on ${formattedDate}`;
    }
  },

  /**
   * Show calendar tooltip
   * @param {HTMLElement} element - Target element
   * @param {string} date - Date string
   * @param {number} count - Contribution count
   */
  showCalendarTooltip(element, date, count) {
    // Implementation for enhanced tooltip
    // Could be expanded with more detailed information
  },

  /**
   * Hide calendar tooltip
   */
  hideCalendarTooltip() {
    // Implementation for hiding tooltip
  },

  // ================================
  // LANGUAGE STATISTICS CHART
  // ================================
  
  /**
   * Create language statistics chart
   * @param {string} canvasId - Canvas element ID
   * @param {Array} languageData - Language statistics data
   */
  createLanguageChart(canvasId, languageData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !languageData || languageData.length === 0) return;

    // Destroy existing chart
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    // Process and limit data
    const processedData = this.processLanguageData(languageData);
    
    const ctx = canvas.getContext('2d');
    this.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: processedData.labels,
        datasets: [{
          data: processedData.values,
          backgroundColor: processedData.colors,
          borderColor: processedData.borderColors,
          borderWidth: 2,
          hoverBorderWidth: 3
        }]
      },
      options: {
        ...this.chartDefaults,
        cutout: '60%',
        plugins: {
          ...this.chartDefaults.plugins,
          legend: {
            ...this.chartDefaults.plugins.legend,
            position: 'bottom',
            labels: {
              ...this.chartDefaults.plugins.legend.labels,
              generateLabels: (chart) => {
                const data = chart.data;
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                
                return data.labels.map((label, index) => {
                  const value = data.datasets[0].data[index];
                  const percentage = ((value / total) * 100).toFixed(1);
                  
                  return {
                    text: `${label} (${percentage}%)`,
                    fillStyle: data.datasets[0].backgroundColor[index],
                    strokeStyle: data.datasets[0].borderColor[index],
                    lineWidth: 2,
                    hidden: false,
                    index: index
                  };
                });
              }
            }
          },
          tooltip: {
            ...this.chartDefaults.plugins.tooltip,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${window.Utils.formatNumber(value)} bytes (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  },

  /**
   * Process language data for chart
   * @param {Array} data - Raw language data
   * @returns {Object} Processed chart data
   */
  processLanguageData(data) {
    // Sort by size and take top languages
    const sortedData = data
      .filter(lang => lang.size > 0)
      .sort((a, b) => b.size - a.size)
      .slice(0, this.config.get('charts.maxLanguages', 8));

    const labels = sortedData.map(lang => lang.name);
    const values = sortedData.map(lang => lang.size);
    const colors = sortedData.map(lang => this.getLanguageColor(lang.name));
    const borderColors = colors.map(color => this.adjustColorBrightness(color, -20));

    return { labels, values, colors, borderColors };
  },

  /**
   * Get color for programming language
   * @param {string} language - Language name
   * @returns {string} Color hex code
   */
  getLanguageColor(language) {
    const colors = window.Utils.getLanguageColors();
    return colors[language] || this.generateColorFromString(language);
  },

  /**
   * Generate color from string (fallback)
   * @param {string} str - String to generate color from
   * @returns {string} Generated color
   */
  generateColorFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  },

  /**
   * Adjust color brightness
   * @param {string} color - Color to adjust
   * @param {number} amount - Amount to adjust (-100 to 100)
   * @returns {string} Adjusted color
   */
  adjustColorBrightness(color, amount) {
    // Simple brightness adjustment
    // For production, could use a proper color manipulation library
    return color;
  },

  // ================================
  // ACTIVITY TIMELINE CHART
  // ================================
  
  /**
   * Create activity timeline chart
   * @param {string} canvasId - Canvas element ID
   * @param {Array} activityData - Activity data over time
   */
  createActivityChart(canvasId, activityData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !activityData || activityData.length === 0) return;

    // Destroy existing chart
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    // Process data for last 30 days
    const processedData = this.processActivityData(activityData);
    
    const ctx = canvas.getContext('2d');
    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: processedData.labels,
        datasets: [{
          label: 'Commits',
          data: processedData.commits,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4
        }, {
          label: 'Issues & PRs',
          data: processedData.issues,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        ...this.chartDefaults,
        scales: {
          ...this.chartDefaults.scales,
          x: {
            ...this.chartDefaults.scales.x,
            type: 'category',
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            ...this.chartDefaults.scales.y,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Activity Count'
            },
            ticks: {
              ...this.chartDefaults.scales.y.ticks,
              stepSize: 1
            }
          }
        },
        plugins: {
          ...this.chartDefaults.plugins,
          tooltip: {
            ...this.chartDefaults.plugins.tooltip,
            callbacks: {
              title: (context) => {
                return window.Utils.formatDate(new Date(context[0].label), {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                });
              },
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.y}`;
              }
            }
          }
        }
      }
    });
  },

  /**
   * Process activity data for chart
   * @param {Array} data - Raw activity data
   * @returns {Object} Processed chart data
   */
  processActivityData(data) {
    const days = 30;
    const labels = [];
    const commits = [];
    const issues = [];
    
    // Generate last 30 days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      labels.push(window.Utils.formatDate(date, { month: 'short', day: 'numeric' }));
      
      // Find activity for this date
      const dayActivity = data.filter(activity => {
        const activityDate = new Date(activity.created_at).toISOString().split('T')[0];
        return activityDate === dateStr;
      });
      
      // Count different types of activity
      const commitCount = dayActivity.filter(a => a.type === 'PushEvent').length;
      const issueCount = dayActivity.filter(a => 
        a.type === 'IssuesEvent' || a.type === 'PullRequestEvent'
      ).length;
      
      commits.push(commitCount);
      issues.push(issueCount);
    }
    
    return { labels, commits, issues };
  },

  // ================================
  // REPOSITORY STATISTICS CHART
  // ================================
  
  /**
   * Create repository statistics chart
   * @param {string} canvasId - Canvas element ID
   * @param {Array} repositories - Repository data
   */
  createRepositoryChart(canvasId, repositories) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !repositories || repositories.length === 0) return;

    // Destroy existing chart
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    // Process repository data
    const processedData = this.processRepositoryData(repositories);
    
    const ctx = canvas.getContext('2d');
    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: processedData.labels,
        datasets: [{
          label: 'Stars',
          data: processedData.stars,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: '#3b82f6',
          borderWidth: 1
        }, {
          label: 'Forks',
          data: processedData.forks,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: '#10b981',
          borderWidth: 1
        }]
      },
      options: {
        ...this.chartDefaults,
        scales: {
          ...this.chartDefaults.scales,
          x: {
            ...this.chartDefaults.scales.x,
            title: {
              display: true,
              text: 'Repositories'
            },
            ticks: {
              ...this.chartDefaults.scales.x.ticks,
              maxRotation: 45
            }
          },
          y: {
            ...this.chartDefaults.scales.y,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count'
            }
          }
        },
        plugins: {
          ...this.chartDefaults.plugins,
          tooltip: {
            ...this.chartDefaults.plugins.tooltip,
            callbacks: {
              title: (context) => {
                return context[0].label;
              },
              label: (context) => {
                return `${context.dataset.label}: ${window.Utils.formatNumber(context.parsed.y)}`;
              }
            }
          }
        }
      }
    });
  },

  /**
   * Process repository data for chart
   * @param {Array} repositories - Repository data
   * @returns {Object} Processed chart data
   */
  processRepositoryData(repositories) {
    // Get top repositories by stars
    const topRepos = repositories
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, this.config.get('charts.maxRepositories', 10));

    const labels = topRepos.map(repo => repo.name);
    const stars = topRepos.map(repo => repo.stargazers_count);
    const forks = topRepos.map(repo => repo.forks_count);

    return { labels, stars, forks };
  },

  // ================================
  // CHART UTILITIES
  // ================================
  
  /**
   * Destroy all charts
   */
  destroyAllCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
  },

  /**
   * Destroy specific chart
   * @param {string} chartId - Chart ID
   */
  destroyChart(chartId) {
    if (this.charts[chartId]) {
      this.charts[chartId].destroy();
      delete this.charts[chartId];
    }
  },

  /**
   * Update chart theme
   */
  updateChartsTheme() {
    this.setupChartDefaults();
    
    // Re-create all existing charts with new theme
    Object.keys(this.charts).forEach(chartId => {
      const chart = this.charts[chartId];
      if (chart) {
        // Update chart options
        chart.options = { ...this.chartDefaults, ...chart.options };
        chart.update();
      }
    });
  },

  /**
   * Resize all charts
   */
  resizeCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.resize();
    });
  },

  /**
   * Check if Chart.js is available
   * @returns {boolean} Whether Chart.js is loaded
   */
  isChartJsAvailable() {
    return typeof Chart !== 'undefined';
  }
};

// Initialize charts when module loads
if (typeof window !== 'undefined' && window.DevPulseConfig) {
  // Wait for DOM and Chart.js to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Small delay to ensure Chart.js is loaded
      setTimeout(() => window.DevPulseCharts.init(), 100);
    });
  } else {
    setTimeout(() => window.DevPulseCharts.init(), 100);
  }
}

// Listen for theme changes
if (typeof window !== 'undefined') {
  window.addEventListener('themechange', () => {
    if (window.DevPulseCharts.updateChartsTheme) {
      window.DevPulseCharts.updateChartsTheme();
    }
  });
}

// Make charts globally available
window.Charts = window.DevPulseCharts;
