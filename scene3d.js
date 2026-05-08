// scene3d.js
// Ultra-Premium Three.js WebGL Scene for Titan Fitness

const canvas = document.getElementById('bg-canvas');

const scene = new THREE.Scene();
// Ultra-deep space background
scene.background = new THREE.Color(0x010102);
// Enhanced Depth-based fog for cinematic blending
scene.fog = new THREE.FogExp2(0x010102, 0.05);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 7;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
// Cap pixel ratio for high DPI performance
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Premium tone mapping for intense glowing highlights
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

// --- Premium Materials ---

// Base dark highly reflective metallic material
const material = new THREE.MeshStandardMaterial({
    color: 0x050505,
    metalness: 1.0,
    roughness: 0.15,
});

// Intense Glowing neon orange material
const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4500,
    emissive: 0xff4500,
    emissiveIntensity: 3.5,
    metalness: 0.1,
    roughness: 0.1,
});

// Intense Secondary glowing blue material
const blueMaterial = new THREE.MeshStandardMaterial({
    color: 0x0088ff,
    emissive: 0x0088ff,
    emissiveIntensity: 2.5,
    metalness: 0.1,
    roughness: 0.1,
});

const group = new THREE.Group();

// Floating abstract geometries (Icosahedrons & Torus Knots)
for (let i = 0; i < 40; i++) {
    // Mix of shapes
    const isKnot = Math.random() > 0.5;
    const geometry = isKnot 
        ? new THREE.TorusKnotGeometry(Math.random() * 0.5 + 0.1, 0.05, 100, 16)
        : new THREE.IcosahedronGeometry(Math.random() * 0.4 + 0.1, 0);
    
    // Assign materials
    let rand = Math.random();
    let mat = material;
    if (rand > 0.88) mat = accentMaterial;
    else if (rand > 0.78) mat = blueMaterial;

    const mesh = new THREE.Mesh(geometry, mat);
    
    // Deeper field
    mesh.position.x = (Math.random() - 0.5) * 30;
    mesh.position.y = (Math.random() - 0.5) * 30;
    mesh.position.z = (Math.random() - 0.5) * 20 - 4;
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    mesh.userData = {
        rotationSpeed: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
        },
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: Math.random() * 0.4 + 0.3
    };

    group.add(mesh);
}
scene.add(group);

// --- Multi-Layered Particle System (Depth of Field Effect) ---

// 1. Background Sharp Particles (Stars/Distant Energy)
const bgParticleGeo = new THREE.BufferGeometry();
const bgParticleCount = 2000;
const bgPosArray = new Float32Array(bgParticleCount * 3);
for(let i = 0; i < bgParticleCount * 3; i++) {
    bgPosArray[i] = (Math.random() - 0.5) * 40;
}
bgParticleGeo.setAttribute('position', new THREE.BufferAttribute(bgPosArray, 3));
const bgParticleMat = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x0088ff,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const bgParticles = new THREE.Points(bgParticleGeo, bgParticleMat);
bgParticles.position.z = -10;
scene.add(bgParticles);

// 2. Midground Orange Particles
const midParticleGeo = new THREE.BufferGeometry();
const midParticleCount = 1500;
const midPosArray = new Float32Array(midParticleCount * 3);
for(let i = 0; i < midParticleCount * 3; i++) {
    midPosArray[i] = (Math.random() - 0.5) * 30;
}
midParticleGeo.setAttribute('position', new THREE.BufferAttribute(midPosArray, 3));
const midParticleMat = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xff4500,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const midParticles = new THREE.Points(midParticleGeo, midParticleMat);
scene.add(midParticles);

// 3. Foreground Blurred Particles (Bokeh Effect Simulation)
const fgParticleGeo = new THREE.BufferGeometry();
const fgParticleCount = 300;
const fgPosArray = new Float32Array(fgParticleCount * 3);
for(let i = 0; i < fgParticleCount * 3; i++) {
    fgPosArray[i] = (Math.random() - 0.5) * 15;
}
fgParticleGeo.setAttribute('position', new THREE.BufferAttribute(fgPosArray, 3));
const fgParticleMat = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xff6a00,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const fgParticles = new THREE.Points(fgParticleGeo, fgParticleMat);
fgParticles.position.z = 4; // Close to camera
scene.add(fgParticles);

// --- Lights ---
const pointLight1 = new THREE.PointLight(0x0088ff, 5, 30);
pointLight1.position.set(4, 5, 3);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff4500, 6, 30);
pointLight2.position.set(-4, -5, 4);
scene.add(pointLight2);

const ambientLight = new THREE.AmbientLight(0x111111, 0.8);
scene.add(ambientLight);

// --- Resizing ---
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// --- Scroll & Mouse Interaction ---
let scrollY = window.scrollY;
let scrollVelocity = 0;
let lastScrollY = scrollY;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

const mouse = new THREE.Vector2();
let targetMouse = new THREE.Vector2();
const windowHalfX = sizes.width / 2;
const windowHalfY = sizes.height / 2;

window.addEventListener('mousemove', (event) => {
    targetMouse.x = (event.clientX - windowHalfX) * 0.001;
    targetMouse.y = (event.clientY - windowHalfY) * 0.001;
});

// --- Animation Loop ---
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Calculate scroll velocity for warp effect
    scrollVelocity = scrollY - lastScrollY;
    lastScrollY = scrollY;
    
    // Smooth mouse interpolation
    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;

    // Rotate and float meshes
    group.children.forEach(mesh => {
        mesh.rotation.x += mesh.userData.rotationSpeed.x;
        mesh.rotation.y += mesh.userData.rotationSpeed.y;
        
        // Float + react to scroll velocity (distortion)
        mesh.position.y += Math.sin(elapsedTime * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.002;
        mesh.rotation.z = scrollVelocity * 0.001; // Twist on fast scroll
    });

    // Parallax Layering
    const parallaxX = mouse.x * 4;
    const parallaxY = -mouse.y * 4;
    
    // Target Camera Y responds to mouse and inverted scroll
    const targetCameraY = parallaxY + (scrollY * -0.0025);
    
    camera.position.x += (parallaxX - camera.position.x) * 0.05;
    camera.position.y += (targetCameraY - camera.position.y) * 0.05;
    
    // Camera warp lookAt based on velocity
    camera.lookAt(0, camera.position.y * 0.6 - (scrollVelocity * 0.005), 0);
    
    // Particle Rotation
    bgParticles.rotation.y = elapsedTime * 0.01;
    midParticles.rotation.y = elapsedTime * 0.03;
    midParticles.rotation.x = elapsedTime * 0.01;
    fgParticles.rotation.y = elapsedTime * -0.02;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
