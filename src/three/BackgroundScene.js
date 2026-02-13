import * as THREE from 'three';

export class BackgroundScene {
  constructor(canvasId) {
    this.canvas = document.querySelector(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050505, 0.001); // Adds depth

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 20;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.particles = null;
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);

    this.initParticles();
    this.addListeners();
    this.animate();
  }

  initParticles() {
    const geometry = new THREE.BufferGeometry();
    const count = 3000;
    
    // Position array (x, y, z)
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 60;
        const y = (Math.random() - 0.5) * 60;
        const z = (Math.random() - 0.5) * 60;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Color gradient (Hot Pink to Purple based on position)
        const mixedColor = new THREE.Color();
        if (Math.random() > 0.5) {
            mixedColor.setHex(0xff0055); // Pink
        } else {
            mixedColor.setHex(0x7000ff); // Purple
        }

        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom shader material for better particle look
    // Using PointsMaterial for simplicity and performance
    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  addListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(event) {
    this.targetMouse.x = event.clientX * 0.001;
    this.targetMouse.y = event.clientY * 0.001;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const time = Date.now() * 0.0005;

    // Smooth mouse follow
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    // Rotate the whole system slowly
    if (this.particles) {
        this.particles.rotation.y = time * 0.1;
        this.particles.rotation.z = this.mouse.x * 0.5;
        this.particles.rotation.x = this.mouse.y * 0.5;

        // Make particles gently wave
        // (Advanced: would require custom shader, keeping simple transform for now)
    }

    this.renderer.render(this.scene, this.camera);
  }
}
