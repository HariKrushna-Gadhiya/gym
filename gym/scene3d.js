// scene3d.js
// Initialize Three.js WebGL Scene

const canvas = document.getElementById('bg-canvas');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070709);
scene.fog = new THREE.FogExp2(0x070709, 0.03);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Objects
// We will create floating metallic torus knots representing weights / atoms
const material = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.8,
    roughness: 0.2,
});

const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4500, // Vibrant glowing orange
    emissive: 0xff4500,
    emissiveIntensity: 0.5,
    metalness: 0.5,
    roughness: 0.1,
});

const group = new THREE.Group();

for (let i = 0; i < 20; i++) {
    const geometry = new THREE.TorusKnotGeometry(Math.random() * 0.5 + 0.1, 0.1, 64, 8);
    const mesh = new THREE.Mesh(
        geometry,
        Math.random() > 0.8 ? accentMaterial : material
    );
    
    mesh.position.x = (Math.random() - 0.5) * 20;
    mesh.position.y = (Math.random() - 0.5) * 20;
    mesh.position.z = (Math.random() - 0.5) * 10 - 2;
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    mesh.userData = {
        rotationSpeed: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
        }
    };

    group.add(mesh);
}
scene.add(group);

// Particles
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 1000;
const posArray = new Float32Array(particleCount * 3);

for(let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 25;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0xff4500,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleMesh);

// Lights
const pointLight = new THREE.PointLight(0x0088ff, 2, 20); // Electric blue
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xff4500, 2, 20); // Neon orange
pointLight2.position.set(-2, -3, 2);
scene.add(pointLight2);

const ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

// Resizing
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Scroll & Mouse Interaction
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) - 0.5;
    mouse.y = -(event.clientY / sizes.height) + 0.5;
});

// Animation Loop
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Rotate meshes
    group.children.forEach(mesh => {
        mesh.rotation.x += mesh.userData.rotationSpeed.x;
        mesh.rotation.y += mesh.userData.rotationSpeed.y;
    });

    // Parallax & Scroll camera movement
    const parallaxX = mouse.x * 2;
    const parallaxY = mouse.y * 2;
    camera.position.x += (parallaxX - camera.position.x) * 0.05;
    camera.position.y += (parallaxY - camera.position.y) * 0.05 + ((scrollY * -0.002) - camera.position.y) * 0.1;
    
    // Rotate particles slowly
    particleMesh.rotation.y = elapsedTime * 0.05;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
