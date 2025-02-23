import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(800, 600);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("orbitScene").appendChild(renderer.domElement);

// Enhanced lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
sunLight.castShadow = true;
scene.add(sunLight);

// Add directional light for better 3D effect
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(100, 100, 100);
scene.add(dirLight);

// Starry background
scene.background = new THREE.Color(0x000000);
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.5,
});
const starsVertices = [];
for (let i = 0; i < 2000; i++) {
  starsVertices.push(
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000
  );
}
starsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starsVertices, 3)
);
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Enhanced Sun
const sunGeometry = new THREE.SphereGeometry(30, 64, 64);
const sunMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  emissive: 0xffff00,
  emissiveIntensity: 1,
  roughness: 0.2,
  metalness: 0.5,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sunLight.position.copy(sun.position);
scene.add(sun);

// Enhanced Earth
const earthGeometry = new THREE.SphereGeometry(15, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
  color: 0x0077ff,
  roughness: 0.7,
  metalness: 0.1,
  normalScale: new THREE.Vector2(1, 1),
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;
scene.add(earth);

// Enhanced Moon
const moonGeometry = new THREE.SphereGeometry(8, 64, 64);
const moonMaterial = new THREE.MeshStandardMaterial({
  color: 0xdddddd,
  roughness: 0.8,
  metalness: 0.1,
  normalScale: new THREE.Vector2(1, 1),
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.castShadow = true;
moon.receiveShadow = true;
scene.add(moon);

// Create helical paths
function createHelicalPath(radius, height, turns, points) {
  const curve = new THREE.CurvePath();
  const segments = points || 360;
  const vertices = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2 * turns;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = height * t;
    vertices.push(new THREE.Vector3(x, y, z));
  }

  for (let i = 0; i < vertices.length - 1; i++) {
    const lineCurve = new THREE.LineCurve3(vertices[i], vertices[i + 1]);
    curve.add(lineCurve);
  }

  return curve;
}

// Earth's orbit
const earthOrbitPath = createHelicalPath(200, 100, 4, 2000);
const earthOrbitGeometry = new THREE.TubeGeometry(
  earthOrbitPath,
  2000,
  1,
  8,
  false
);
const earthOrbitMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.3,
});
const earthOrbit = new THREE.Mesh(earthOrbitGeometry, earthOrbitMaterial);
scene.add(earthOrbit);

// Create moon's orbit ring
function createMoonOrbitRing() {
  const radius = 40;
  const tube = 0.5;
  const tubularSegments = 48;
  const radialSegments = 8;
  const geometry = new THREE.TorusGeometry(
    radius,
    tube,
    radialSegments,
    tubularSegments
  );
  const material = new THREE.MeshBasicMaterial({
    color: 0xff6600, // Orange color
    transparent: false, // Removed transparency
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.z = Math.PI / 2; // Rotated to match vertical orbit
  return ring;
}

const moonOrbit = createMoonOrbitRing();
scene.add(moonOrbit);

// Updated time constants
const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = DAYS_PER_MONTH * MONTHS_PER_YEAR; // 360 days
const TOTAL_YEARS = 4;
const TOTAL_DAYS = DAYS_PER_YEAR * TOTAL_YEARS;

let isPlaying = false;
let currentDay = 0;
let animationSpeed = 0.5;

// UI elements
const playPauseBtn = document.getElementById("playPause");
const resetBtn = document.getElementById("reset");
const timeSlider = document.getElementById("timeSlider");
const speedSlider = document.getElementById("speedSlider");
const timeDisplay = document.getElementById("timeDisplay");

// Update time slider max value for 4 years
timeSlider.max = TOTAL_DAYS;

function updateScene() {
  const yearProgress = (currentDay % TOTAL_DAYS) / TOTAL_DAYS;
  const moonProgress = (currentDay % DAYS_PER_MONTH) / DAYS_PER_MONTH;

  // Update Earth position
  const earthPoint = earthOrbitPath.getPoint(yearProgress);
  earth.position.copy(earthPoint);

  // Update Moon orbit ring position
  moonOrbit.position.copy(earthPoint);

  // Update Moon position
  const moonAngle = moonProgress * Math.PI * 2;
  const moonRadius = 40;
  moon.position.set(
    earthPoint.x + Math.cos(moonAngle) * moonRadius,
    earthPoint.y + Math.sin(moonAngle) * moonRadius,
    earthPoint.z
  );

  // Update time display
  const years = Math.floor(currentDay / DAYS_PER_YEAR);
  const months = Math.floor((currentDay % DAYS_PER_YEAR) / DAYS_PER_MONTH);
  const days = Math.floor(currentDay % DAYS_PER_MONTH);
  timeDisplay.textContent = `Year ${years + 1}, Month ${months + 1}, Day ${
    days + 1
  }`;
}

function animate() {
  if (isPlaying) {
    requestAnimationFrame(animate);
    currentDay = (currentDay + animationSpeed) % TOTAL_DAYS;
    timeSlider.value = currentDay;
    updateScene();
    renderer.render(scene, camera);
  }
}

// Camera and controls setup
camera.position.set(500, 250, 500);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 200;
controls.maxDistance = 1200;

playPauseBtn.addEventListener("click", () => {
  isPlaying = !isPlaying;
  playPauseBtn.textContent = isPlaying ? "Pause" : "Play";
  playPauseBtn.setAttribute("aria-pressed", isPlaying);
  if (isPlaying) animate();
});

resetBtn.addEventListener("click", () => {
  isPlaying = false;
  playPauseBtn.textContent = "Play";
  playPauseBtn.setAttribute("aria-pressed", "false");
  currentDay = 0;
  timeSlider.value = 0;
  updateScene();
});

timeSlider.addEventListener("input", (e) => {
  currentDay = parseFloat(e.target.value);
  updateScene();
});

speedSlider.addEventListener("input", (e) => {
  animationSpeed = parseFloat(e.target.value);
});

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    playPauseBtn.click();
  } else if (e.key === "r") {
    e.preventDefault();
    resetBtn.click();
  }
});

function renderLoop() {
  requestAnimationFrame(renderLoop);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  const container = document.getElementById("orbitScene");
  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  if (width < 768) {
    camera.position.set(500, 250, 500);
  } else {
    camera.position.set(400, 200, 400);
  }

  camera.lookAt(0, 0, 0);
});

// Initialize
updateScene();
renderLoop();
