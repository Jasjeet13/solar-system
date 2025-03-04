// Initialize the scene
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 70, 100); // Move the camera back for better framing
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 2, 500);
light.position.set(0, 10, 0);
scene.add(light);

// Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffaa00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet data
const planetData = [
    { name: "Mercury", size: 0.5, orbitA: 10, orbitB: 8, color: 0xaaaaaa, speed: 0.02 },
    { name: "Venus", size: 1.2, orbitA: 16, orbitB: 13, color: 0xffa500, speed: 0.015 },
    { name: "Earth", size: 1.3, orbitA: 22, orbitB: 18, color: 0x0000ff, speed: 0.012 },
    { name: "Mars", size: 0.8, orbitA: 30, orbitB: 24, color: 0xff0000, speed: 0.01 },
    { name: "Jupiter", size: 3, orbitA: 45, orbitB: 38, color: 0xffc300, speed: 0.008 },
    { name: "Saturn", size: 2.5, orbitA: 55, orbitB: 48, color: 0xffa07a, speed: 0.006 },
    { name: "Uranus", size: 2, orbitA: 65, orbitB: 58, color: 0x00ffff, speed: 0.004 },
    { name: "Neptune", size: 2, orbitA: 75, orbitB: 68, color: 0x191970, speed: 0.002 }
];

// Function to create elliptical orbits
function createOrbit(orbitA, orbitB) {
    const points = [];
    for (let i = 0; i <= 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        const x = Math.cos(angle) * orbitA;
        const z = Math.sin(angle) * orbitB;
        points.push(new THREE.Vector3(x, 0, z));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    return orbit;
}

// Create planets & orbits
const planets = [];
planetData.forEach(data => {
    // Create planet
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: data.color });
    const planet = new THREE.Mesh(geometry, material);
    planet.userData = { orbitA: data.orbitA, orbitB: data.orbitB, speed: data.speed, angle: Math.random() * Math.PI * 2 };
    scene.add(planet);
    planets.push(planet);

    // Create and add orbit
    const orbit = createOrbit(data.orbitA, data.orbitB);
    scene.add(orbit);
});

// Animation loop (Planets revolve around the Sun)
function animate() {
    requestAnimationFrame(animate);

    planets.forEach(planet => {
        const { orbitA, orbitB, speed } = planet.userData;
        planet.userData.angle += speed; // Update angle for revolution

        // Elliptical motion around the Sun
        planet.position.x = Math.cos(planet.userData.angle) * orbitA;
        planet.position.z = Math.sin(planet.userData.angle) * orbitB;
    });

    renderer.render(scene, camera);
}

// Keep everything centered in the frame
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start Animation
animate();
