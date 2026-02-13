import * as THREE from 'three';
import gsap from 'gsap';

export class HistoryScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.objects = [];
        this.initObjects();
        this.addLights();

        // Animation loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        // Handle Resize
        window.addEventListener('resize', this.onResize.bind(this));
    }

    initObjects() {
        // Create a group for the BMX abstraction
        this.group = new THREE.Group();
        this.scene.add(this.group);

        // 1. Wheel (Torus)
        const wheelGeo = new THREE.TorusGeometry(1.5, 0.1, 16, 50);
        const wheelMat = new THREE.MeshStandardMaterial({
            color: 0xff3333,
            wireframe: true,
            emissive: 0xff0055,
            emissiveIntensity: 0.5
        });
        this.wheel = new THREE.Mesh(wheelGeo, wheelMat);
        this.group.add(this.wheel);

        // 2. Inner Spokes (Lines) -> Simple Plane or Cylinder
        const spokeGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
        const spokeMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        this.spoke1 = new THREE.Mesh(spokeGeo, spokeMat);
        this.spoke1.rotation.z = Math.PI / 2;
        this.group.add(this.spoke1);

        this.spoke2 = new THREE.Mesh(spokeGeo, spokeMat);
        this.group.add(this.spoke2);

        // Floating particles
        const partGeo = new THREE.BufferGeometry();
        const count = 200;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            pos[i] = (Math.random() - 0.5) * 10;
        }
        partGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const partMat = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xffffff
        });
        this.particles = new THREE.Points(partGeo, partMat);
        this.scene.add(this.particles);
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);
    }

    onResize() {
        if (!this.container) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate);

        if (this.group) {
            this.group.rotation.y += 0.005;
            this.group.rotation.x += 0.002;
        }

        if (this.particles) {
            this.particles.rotation.y -= 0.002;
        }

        this.renderer.render(this.scene, this.camera);
    }
}
