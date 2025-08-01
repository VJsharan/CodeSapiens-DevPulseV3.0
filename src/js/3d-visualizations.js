/**
 * DevPulse 3D Visualizations JavaScript
 * Interactive Three.js-powered GitHub analytics visualization
 */

window.DevPulse3D = {
  
  // ================================
  // CORE PROPERTIES
  // ================================
  
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  animationId: null,
  
  // Visualization data
  userData: null,
  repositories: [],
  languages: [],
  
  // 3D Objects
  repositoryNodes: [],
  languageParticles: [],
  connectionLines: [],
  
  // Settings
  settings: {
    animationSpeed: 1.0,
    particleCount: 200,
    autoRotate: true,
    currentVisualization: 'repository-network'
  },
  
  // Performance tracking
  performance: {
    fps: 60,
    lastTime: 0,
    frameCount: 0
  },
  
  // ================================
  // INITIALIZATION
  // ================================
  
  /**
   * Initialize 3D visualization system
   */
  init() {
    console.log('🌌 Initializing DevPulse 3D Visualizations...');
    
    try {
      this.showLoadingStatus('Checking Three.js availability...');
      
      // Check if Three.js is available
      if (typeof THREE === 'undefined') {
        throw new Error('Three.js library not loaded');
      }
      
      this.showLoadingStatus('Setting up 3D environment...');
      this.setupScene();
      this.setupCamera();
      this.setupRenderer();
      this.setupControls();
      this.setupLights();
      
      this.showLoadingStatus('Loading sample data...');
      this.loadSampleData();
      
      this.showLoadingStatus('Creating initial visualization...');
      this.createRepositoryNetwork();
      
      this.showLoadingStatus('Setting up interactions...');
      this.setupEventListeners();
      this.setupUI();
      
      this.showLoadingStatus('Starting animation loop...');
      this.startAnimation();
      
      // Hide loading screen
      setTimeout(() => {
        this.hideLoading();
        console.log('✅ DevPulse 3D Visualizations initialized successfully');
      }, 1500);
      
    } catch (error) {
      console.error('❌ 3D Visualization initialization failed:', error);
      this.showError(error.message);
    }
  },
  
  /**
   * Setup Three.js scene
   */
  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a1a);
    
    // Add fog for depth perception
    this.scene.fog = new THREE.Fog(0x0a0a1a, 50, 500);
  },
  
  /**
   * Setup camera
   */
  setupCamera() {
    const canvas = document.getElementById('threejs-canvas');
    const aspect = canvas.clientWidth / canvas.clientHeight;
    
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0, 0, 0);
  },
  
  /**
   * Setup renderer
   */
  setupRenderer() {
    const canvas = document.getElementById('threejs-canvas');
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());
  },
  
  /**
   * Setup orbit controls
   */
  setupControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = this.settings.autoRotate;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.maxDistance = 300;
    this.controls.minDistance = 20;
  },
  
  /**
   * Setup lighting
   */
  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    
    // Point lights for color
    const pointLight1 = new THREE.PointLight(0x667eea, 1, 200);
    pointLight1.position.set(30, 30, 30);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x764ba2, 1, 200);
    pointLight2.position.set(-30, -30, -30);
    this.scene.add(pointLight2);
  },
  
  // ================================
  // DATA LOADING
  // ================================
  
  /**
   * Load sample data for demonstration
   */
  loadSampleData() {
    // Sample repository data
    this.repositories = [
      {
        name: 'react',
        stars: 220000,
        language: 'JavaScript',
        size: 50000,
        position: { x: 0, y: 0, z: 0 },
        connections: ['vue', 'angular']
      },
      {
        name: 'vue',
        stars: 206000,
        language: 'JavaScript',
        size: 35000,
        position: { x: 30, y: 10, z: -20 },
        connections: ['react', 'svelte']
      },
      {
        name: 'angular',
        stars: 93000,
        language: 'TypeScript',
        size: 40000,
        position: { x: -25, y: 15, z: 25 },
        connections: ['react']
      },
      {
        name: 'svelte',
        stars: 75000,
        language: 'JavaScript',
        size: 25000,
        position: { x: 45, y: -10, z: 30 },
        connections: ['vue']
      },
      {
        name: 'tensorflow',
        stars: 180000,
        language: 'Python',
        size: 60000,
        position: { x: -40, y: 25, z: -30 },
        connections: ['pytorch']
      },
      {
        name: 'pytorch',
        stars: 75000,
        language: 'Python',
        size: 45000,
        position: { x: -60, y: 35, z: -10 },
        connections: ['tensorflow']
      }
    ];
    
    // Sample language data
    this.languages = [
      { name: 'JavaScript', percentage: 35, color: 0xf7df1e },
      { name: 'Python', percentage: 25, color: 0x3776ab },
      { name: 'TypeScript', percentage: 20, color: 0x007acc },
      { name: 'Java', percentage: 10, color: 0xed8b00 },
      { name: 'Go', percentage: 6, color: 0x00add8 },
      { name: 'Rust', percentage: 4, color: 0xdea584 }
    ];
    
    // Load data from parent window if available
    if (window.opener && window.opener.DevPulse) {
      const parentData = window.opener.DevPulse.currentUserData;
      if (parentData) {
        this.userData = parentData;
        this.processUserData(parentData);
      }
    }
  },
  
  /**
   * Process real user data from parent window
   */
  processUserData(userData) {
    if (userData.repositories) {
      this.repositories = userData.repositories.slice(0, 20).map((repo, index) => ({
        name: repo.name,
        stars: repo.stargazers_count,
        language: repo.language || 'Unknown',
        size: repo.size,
        position: this.generatePosition(index),
        connections: this.generateConnections(repo, userData.repositories)
      }));
    }
    
    if (userData.languageStats) {
      this.languages = userData.languageStats.map(lang => ({
        name: lang.name,
        percentage: lang.percentage,
        color: this.getLanguageColor(lang.name)
      }));
    }
  },
  
  /**
   * Generate random position for repository node
   */
  generatePosition(index) {
    const radius = 50;
    const angle = (index / this.repositories.length) * Math.PI * 2;
    return {
      x: Math.cos(angle) * radius + (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 40,
      z: Math.sin(angle) * radius + (Math.random() - 0.5) * 20
    };
  },
  
  /**
   * Generate connections between repositories
   */
  generateConnections(repo, allRepos) {
    const connections = [];
    const sameLanguage = allRepos.filter(r => 
      r.language === repo.language && r.name !== repo.name
    );
    
    if (sameLanguage.length > 0) {
      connections.push(sameLanguage[0].name);
    }
    
    return connections.slice(0, 2);
  },
  
  /**
   * Get color for programming language
   */
  getLanguageColor(language) {
    const colors = {
      'JavaScript': 0xf7df1e,
      'TypeScript': 0x007acc,
      'Python': 0x3776ab,
      'Java': 0xed8b00,
      'Go': 0x00add8,
      'Rust': 0xdea584,
      'C++': 0x00599c,
      'C': 0x555555,
      'Ruby': 0x701516,
      'PHP': 0x777bb4,
      'Swift': 0xfa7343,
      'Kotlin': 0x7f52ff
    };
    
    return colors[language] || 0x888888;
  },
  
  // ================================
  // VISUALIZATION CREATION
  // ================================
  
  /**
   * Create repository network visualization
   */
  createRepositoryNetwork() {
    this.clearVisualization();
    
    // Create repository nodes
    this.repositories.forEach((repo, index) => {
      const node = this.createRepositoryNode(repo, index);
      this.scene.add(node);
      this.repositoryNodes.push(node);
    });
    
    // Create connections
    this.createConnections();
    
    // Create floating particles
    this.createParticleSystem();
    
    this.updateMetrics();
  },
  
  /**
   * Create a single repository node
   */
  createRepositoryNode(repo, index) {
    const group = new THREE.Group();
    
    // Calculate size based on stars
    const baseSize = Math.max(1, Math.log(repo.stars + 1) * 0.5);
    const size = Math.min(baseSize, 8);
    
    // Create main sphere
    const geometry = new THREE.SphereGeometry(size, 32, 16);
    const material = new THREE.MeshPhongMaterial({
      color: this.getLanguageColor(repo.language),
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    
    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(size * 1.2, 16, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: this.getLanguageColor(repo.language),
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    
    // Position
    group.position.set(repo.position.x, repo.position.y, repo.position.z);
    
    // Add animation data
    group.userData = {
      repo: repo,
      originalPosition: { ...repo.position },
      animationOffset: index * 0.1,
      rotationSpeed: (Math.random() + 0.5) * 0.01
    };
    
    group.add(sphere);
    group.add(glow);
    
    return group;
  },
  
  /**
   * Create connections between repositories
   */
  createConnections() {
    this.repositories.forEach(repo => {
      repo.connections.forEach(connectionName => {
        const targetRepo = this.repositories.find(r => r.name === connectionName);
        if (targetRepo) {
          const line = this.createConnectionLine(repo.position, targetRepo.position);
          this.scene.add(line);
          this.connectionLines.push(line);
        }
      });
    });
  },
  
  /**
   * Create a connection line between two points
   */
  createConnectionLine(start, end) {
    const points = [
      new THREE.Vector3(start.x, start.y, start.z),
      new THREE.Vector3(end.x, end.y, end.z)
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x667eea,
      transparent: true,
      opacity: 0.3
    });
    
    return new THREE.Line(geometry, material);
  },
  
  /**
   * Create particle system
   */
  createParticleSystem() {
    const particleCount = this.settings.particleCount;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Random positions in a sphere
      const radius = Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random colors
      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.7, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });
    
    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
    this.languageParticles.push(particles);
  },
  
  /**
   * Clear current visualization
   */
  clearVisualization() {
    // Remove repository nodes
    this.repositoryNodes.forEach(node => {
      this.scene.remove(node);
    });
    this.repositoryNodes = [];
    
    // Remove connection lines
    this.connectionLines.forEach(line => {
      this.scene.remove(line);
    });
    this.connectionLines = [];
    
    // Remove particles
    this.languageParticles.forEach(particles => {
      this.scene.remove(particles);
    });
    this.languageParticles = [];
  },
  
  // ================================
  // ANIMATION LOOP
  // ================================
  
  /**
   * Start animation loop
   */
  startAnimation() {
    this.animate();
  },
  
  /**
   * Main animation loop
   */
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const currentTime = performance.now();
    
    // Update performance metrics
    this.updatePerformance(currentTime);
    
    // Update controls
    this.controls.update();
    
    // Animate repository nodes
    this.animateRepositoryNodes(currentTime);
    
    // Animate particles
    this.animateParticles(currentTime);
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  },
  
  /**
   * Animate repository nodes
   */
  animateRepositoryNodes(time) {
    this.repositoryNodes.forEach(node => {
      const userData = node.userData;
      
      // Floating animation
      const offset = userData.animationOffset;
      const floatAmount = Math.sin(time * 0.001 * this.settings.animationSpeed + offset) * 2;
      node.position.y = userData.originalPosition.y + floatAmount;
      
      // Rotation
      node.rotation.y += userData.rotationSpeed * this.settings.animationSpeed;
    });
  },
  
  /**
   * Animate particles
   */
  animateParticles(time) {
    this.languageParticles.forEach(particles => {
      particles.rotation.y += 0.001 * this.settings.animationSpeed;
      particles.rotation.x += 0.0005 * this.settings.animationSpeed;
    });
  },
  
  /**
   * Update performance metrics
   */
  updatePerformance(currentTime) {
    this.performance.frameCount++;
    
    if (currentTime - this.performance.lastTime >= 1000) {
      this.performance.fps = this.performance.frameCount;
      this.performance.frameCount = 0;
      this.performance.lastTime = currentTime;
      
      // Update FPS display
      const fpsElement = document.getElementById('fps-counter');
      if (fpsElement) {
        fpsElement.textContent = this.performance.fps;
      }
    }
  },
  
  // ================================
  // EVENT HANDLERS
  // ================================
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Visualization type change
    document.getElementById('viz-type').addEventListener('change', (e) => {
      this.settings.currentVisualization = e.target.value;
      this.switchVisualization(e.target.value);
    });
    
    // Animation speed
    document.getElementById('animation-speed').addEventListener('input', (e) => {
      this.settings.animationSpeed = parseFloat(e.target.value);
      document.getElementById('speed-value').textContent = `${e.target.value}x`;
    });
    
    // Particle count
    document.getElementById('particle-count').addEventListener('input', (e) => {
      this.settings.particleCount = parseInt(e.target.value);
      document.getElementById('particle-value').textContent = e.target.value;
      this.updateParticleSystem();
    });
    
    // Auto rotate
    document.getElementById('auto-rotate').addEventListener('click', (e) => {
      this.settings.autoRotate = !this.settings.autoRotate;
      this.controls.autoRotate = this.settings.autoRotate;
      e.target.classList.toggle('active', this.settings.autoRotate);
    });
    
    // Reset view
    document.getElementById('reset-view').addEventListener('click', () => {
      this.resetCamera();
    });
    
    // Data panel toggle
    document.getElementById('toggle-data-panel').addEventListener('click', () => {
      document.querySelector('.viz-data-panel').classList.toggle('collapsed');
    });
    
    // Theme toggle
    document.getElementById('theme-toggle-3d').addEventListener('click', () => {
      this.toggleTheme();
    });
  },
  
  /**
   * Setup UI elements
   */
  setupUI() {
    this.updateMetrics();
  },
  
  /**
   * Handle window resize
   */
  onWindowResize() {
    const canvas = document.getElementById('threejs-canvas');
    const aspect = canvas.clientWidth / canvas.clientHeight;
    
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  },
  
  /**
   * Switch visualization type
   */
  switchVisualization(type) {
    switch (type) {
      case 'repository-network':
        this.createRepositoryNetwork();
        this.updateVisualizationInfo('🌟 Repository Network', 
          'Interactive 3D visualization of repository relationships');
        break;
      case 'language-galaxy':
        this.createLanguageGalaxy();
        this.updateVisualizationInfo('🌌 Language Galaxy', 
          'Programming languages arranged in a cosmic formation');
        break;
      case 'contribution-terrain':
        this.createContributionTerrain();
        this.updateVisualizationInfo('🏔️ Contribution Terrain', 
          '3D landscape representing contribution activity over time');
        break;
      case 'code-universe':
        this.createCodeUniverse();
        this.updateVisualizationInfo('🌠 Code Universe', 
          'Immersive universe of code complexity and relationships');
        break;
    }
  },
  
  /**
   * Create language galaxy visualization
   */
  createLanguageGalaxy() {
    this.clearVisualization();
    
    this.languages.forEach((lang, index) => {
      const radius = lang.percentage * 2;
      const angle = (index / this.languages.length) * Math.PI * 2;
      const distance = 30 + lang.percentage;
      
      const position = {
        x: Math.cos(angle) * distance,
        y: (Math.random() - 0.5) * 10,
        z: Math.sin(angle) * distance
      };
      
      const node = this.createLanguageNode(lang, position, radius);
      this.scene.add(node);
      this.repositoryNodes.push(node);
    });
    
    this.createParticleSystem();
    this.updateMetrics();
  },
  
  /**
   * Create language node for galaxy
   */
  createLanguageNode(lang, position, radius) {
    const group = new THREE.Group();
    
    const geometry = new THREE.SphereGeometry(radius, 32, 16);
    const material = new THREE.MeshPhongMaterial({
      color: lang.color,
      transparent: true,
      opacity: 0.9
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    
    group.position.set(position.x, position.y, position.z);
    group.userData = {
      language: lang,
      originalPosition: { ...position },
      animationOffset: Math.random() * Math.PI * 2
    };
    
    group.add(sphere);
    return group;
  },
  
  /**
   * Create contribution terrain (placeholder)
   */
  createContributionTerrain() {
    this.clearVisualization();
    
    const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const material = new THREE.MeshPhongMaterial({
      color: 0x667eea,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -20;
    
    // Add height variation
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] = Math.random() * 10;
    }
    geometry.attributes.position.needsUpdate = true;
    
    this.scene.add(terrain);
    this.repositoryNodes.push(terrain);
    
    this.updateMetrics();
  },
  
  /**
   * Create code universe (placeholder)
   */
  createCodeUniverse() {
    this.clearVisualization();
    this.createRepositoryNetwork();
    this.createParticleSystem();
    
    // Add more visual effects
    this.updateMetrics();
  },
  
  /**
   * Update particle system
   */
  updateParticleSystem() {
    // Remove old particles
    this.languageParticles.forEach(particles => {
      this.scene.remove(particles);
    });
    this.languageParticles = [];
    
    // Create new particles
    this.createParticleSystem();
  },
  
  /**
   * Reset camera to default position
   */
  resetCamera() {
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0, 0, 0);
    this.controls.reset();
  },
  
  /**
   * Toggle theme
   */
  toggleTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      body.removeAttribute('data-theme');
    } else {
      body.setAttribute('data-theme', 'dark');
    }
    
    // Update scene background
    this.scene.background = isDark ? 
      new THREE.Color(0x0a0a1a) : 
      new THREE.Color(0x000000);
  },
  
  /**
   * Update metrics display
   */
  updateMetrics() {
    document.getElementById('total-nodes').textContent = this.repositoryNodes.length;
    document.getElementById('total-connections').textContent = this.connectionLines.length;
    document.getElementById('active-particles').textContent = this.settings.particleCount;
  },
  
  /**
   * Update visualization info panel
   */
  updateVisualizationInfo(title, description) {
    document.getElementById('info-title').textContent = title;
    document.getElementById('info-details').innerHTML = `<p>${description}</p>`;
  },
  
  // ================================
  // UTILITY METHODS
  // ================================
  
  /**
   * Show loading status
   */
  showLoadingStatus(message) {
    const statusElement = document.getElementById('loading-status');
    if (statusElement) {
      statusElement.textContent = message;
    }
  },
  
  /**
   * Hide loading screen
   */
  hideLoading() {
    const loadingElement = document.getElementById('viz-loading');
    if (loadingElement) {
      loadingElement.style.opacity = '0';
      setTimeout(() => {
        loadingElement.style.display = 'none';
      }, 500);
    }
  },
  
  /**
   * Show error message
   */
  showError(message) {
    console.error('3D Visualization Error:', message);
    const loadingElement = document.getElementById('viz-loading');
    if (loadingElement) {
      loadingElement.innerHTML = `
        <div class="loading-content">
          <div class="error-icon">❌</div>
          <h3>Visualization Error</h3>
          <p>${message}</p>
          <button onclick="window.location.reload()" class="retry-btn">
            Try Again
          </button>
        </div>
      `;
    }
  },
  
  /**
   * Cleanup resources
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // Clean up geometry and materials
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.DevPulse3D) {
    window.DevPulse3D.destroy();
  }
});
