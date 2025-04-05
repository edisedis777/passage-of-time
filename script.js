import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Get container dimensions
const container = document.getElementById("orbitScene");
const containerWidth = container.clientWidth;
const containerHeight = container.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  containerWidth / containerHeight,
  0.1,
  2000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(containerWidth, containerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Enhanced lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
sunLight.castShadow = true;
scene.add(sunLight);

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
const starsCount = window.innerWidth < 768 ? 1000 : 2000;
const starsVertices = [];
for (let i = 0; i < starsCount; i++) {
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

// Load textures
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load("images/sun.jpg"); // sun texture
const earthTexture = textureLoader.load("images/earth.jpg"); // earth texture
const moonTexture = textureLoader.load("images/moon.jpg"); // moon texture

// Celestial bodies
const sunGeometry = new THREE.SphereGeometry(
  150,
  window.innerWidth < 768 ? 32 : 64,
  window.innerWidth < 768 ? 32 : 64
);
const sunMaterial = new THREE.MeshStandardMaterial({
  map: sunTexture,
  emissive: 0xffcc00,
  emissiveIntensity: 0.5,
  roughness: 0.2,
  metalness: 0.5,
});

const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sunLight.position.copy(sun.position);
scene.add(sun);

// Create sun path cylinder
const sunPathGeometry = new THREE.CylinderGeometry(130, 130, 400, 32); // Radius, radius, height
const sunPathMaterial = new THREE.MeshBasicMaterial({
  color: 0xff9900,
  transparent: true,
  opacity: 0.7,
  side: THREE.DoubleSide,
});
const sunPath = new THREE.Mesh(sunPathGeometry, sunPathMaterial);
sunPath.rotation.x = Math.PI / 100; // Rotate to horizontal position
sunPath.position.set(0, -200, 0); // Position below the sun
scene.add(sunPath);

const earthGeometry = new THREE.SphereGeometry(
  15,
  window.innerWidth < 768 ? 32 : 64,
  window.innerWidth < 768 ? 32 : 64
);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  roughness: 0.7,
  metalness: 0.1,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;
scene.add(earth);

const moonGeometry = new THREE.SphereGeometry(
  8,
  window.innerWidth < 768 ? 32 : 64,
  window.innerWidth < 768 ? 32 : 64
);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  roughness: 0.8,
  metalness: 0.1,
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
const earthOrbitPath = createHelicalPath(500, 400, 4, 2000);
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
  opacity: 0.5,
});
const earthOrbit = new THREE.Mesh(earthOrbitGeometry, earthOrbitMaterial);
scene.add(earthOrbit);

// Create spiral path around a curve
function createSpiralAroundPath(mainPath, radius, turns, points) {
  const curve = new THREE.CurvePath();
  const segments = points || 360;
  const vertices = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const mainPoint = mainPath.getPoint(t);
    const angle = t * Math.PI * 2 * turns;
    const x = mainPoint.x + radius * Math.cos(angle);
    const y = mainPoint.y + radius * Math.sin(angle);
    const z = mainPoint.z;
    vertices.push(new THREE.Vector3(x, y, z));
  }

  for (let i = 0; i < vertices.length - 1; i++) {
    const lineCurve = new THREE.LineCurve3(vertices[i], vertices[i + 1]);
    curve.add(lineCurve);
  }

  return curve;
}

// Moon's spiral orbit
const moonOrbitPath = createSpiralAroundPath(earthOrbitPath, 40, 48, 2000);
const moonOrbitGeometry = new THREE.TubeGeometry(
  moonOrbitPath,
  2000,
  0.5,
  8,
  false
);
const moonOrbitMaterial = new THREE.MeshBasicMaterial({
  color: 0xff6600,
  transparent: true,
  opacity: 0.5,
});
const moonOrbit = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
scene.add(moonOrbit);

// Time constants
const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = DAYS_PER_MONTH * MONTHS_PER_YEAR;
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

// Update time slider max value
timeSlider.max = TOTAL_DAYS;

function updateScene() {
  const yearProgress = (currentDay % TOTAL_DAYS) / TOTAL_DAYS;
  const moonProgress = (currentDay % DAYS_PER_MONTH) / DAYS_PER_MONTH;

  // Update Earth position
  const earthPoint = earthOrbitPath.getPoint(yearProgress);
  earth.position.copy(earthPoint);

  // Update Moon position
  const moonPoint = moonOrbitPath.getPoint(yearProgress);
  moon.position.copy(moonPoint);

  // Update time display
  const years = Math.floor(currentDay / DAYS_PER_YEAR);
  const months = Math.floor((currentDay % DAYS_PER_YEAR) / DAYS_PER_MONTH);
  const days = Math.floor(currentDay % DAYS_PER_MONTH);
  timeDisplay.textContent = `Year ${years + 1}, Month ${months + 1}, Day ${
    days + 1
  }`;
}

// Create a reference line for one month (between month 5 and 6)
function createReferenceLine(startPoint, endPoint, color, text) {
  // Create the line
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    startPoint,
    endPoint,
  ]);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: color,
    linewidth: 2,
  });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);

  // Create text sprite
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 128;
  context.fillStyle = "#ffffff";
  context.font = "Bold 48px Arial";
  context.fillText(text, 10, 50);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);

  // Position sprite at midpoint of line
  sprite.position.set(
    (startPoint.x + endPoint.x) / 2,
    (startPoint.y + endPoint.y) / 2 + 10,
    (startPoint.z + endPoint.z) / 2
  );
  sprite.scale.set(50, 25, 1);
  scene.add(sprite);

  return { line, sprite };
}

// Calculate points for month reference (between month 5 and 6)
const month5Progress = (12 + 365 * 2) / TOTAL_DAYS; // During year 2
const month6Progress = (40 + 365 * 2) / TOTAL_DAYS;
const month5Point = moonOrbitPath.getPoint(month5Progress);
const month6Point = moonOrbitPath.getPoint(month6Progress);

// Create month reference line
const monthReference = createReferenceLine(
  month5Point,
  month6Point,
  0x00ff00, // Green color
  "one month"
);

// Calculate points for year reference (between year 2 and 3)
const year2Progress = (365 * 1) / TOTAL_DAYS;
const year3Progress = (365 * 2) / TOTAL_DAYS;
const year2Point = earthOrbitPath.getPoint(year2Progress);
const year3Point = earthOrbitPath.getPoint(year3Progress);

// Create year reference line
const yearReference = createReferenceLine(
  year2Point,
  year3Point,
  0x00ff00, // green color
  "one year"
);

function updateReferenceLines() {
  // Update month reference visibility
  const monthOpacity = 0.8;
  monthReference.line.material.opacity = monthOpacity;
  monthReference.sprite.material.opacity = monthOpacity;

  // Update year reference visibility
  const yearOpacity = 0.8;
  yearReference.line.material.opacity = yearOpacity;
  yearReference.sprite.material.opacity = yearOpacity;
}

// Add this to your existing animate function
function animate() {
  if (isPlaying) {
    requestAnimationFrame(animate);
    currentDay = (currentDay + animationSpeed) % TOTAL_DAYS;
    timeSlider.value = currentDay;
    updateScene();
    updateReferenceLines(); // Add this line
    renderer.render(scene, camera);
  }
}

// Store initial camera position and orientation
const initialCameraPosition = {
  x: window.innerWidth < 768 ? 800 : 700,
  y: window.innerWidth < 768 ? 400 : 350,
  z: window.innerWidth < 768 ? 800 : 700,
};

// Camera and controls setup
camera.position.set(
  initialCameraPosition.x,
  initialCameraPosition.y,
  initialCameraPosition.z
);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = window.innerWidth < 768 ? 400 : 300;
controls.maxDistance = window.innerWidth < 768 ? 1000 : 1400;
controls.maxPolarAngle = Math.PI / 1.5;
controls.minPolarAngle = Math.PI / 6;

// Event listeners
playPauseBtn.addEventListener("click", () => {
  isPlaying = !isPlaying;
  playPauseBtn.textContent = isPlaying ? "Pause" : "Play";
  playPauseBtn.setAttribute("aria-pressed", isPlaying);
  if (isPlaying) animate();
});

resetBtn.addEventListener("click", () => {
  // Reset animation state
  isPlaying = false;
  playPauseBtn.textContent = "Play";
  playPauseBtn.setAttribute("aria-pressed", "false");
  currentDay = 0;
  timeSlider.value = 0;

  // Reset camera position and controls
  camera.position.set(
    initialCameraPosition.x,
    initialCameraPosition.y,
    initialCameraPosition.z
  );
  camera.lookAt(0, 0, 0);
  controls.reset(); // Reset orbit controls to initial state

  // Update the scene
  updateScene();
  renderer.render(scene, camera);
});

timeSlider.addEventListener("input", (e) => {
  currentDay = parseFloat(e.target.value);
  updateScene();
});

speedSlider.addEventListener("input", (e) => {
  animationSpeed = parseFloat(e.target.value);
});

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    playPauseBtn.click();
  } else if (e.key === "r") {
    e.preventDefault();
    resetBtn.click();
  }
});

// Optimized resize handler
let resizeTimeout;
window.addEventListener("resize", () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Update initial camera position based on screen size
    if (width < 768) {
      initialCameraPosition.x = 800;
      initialCameraPosition.y = 400;
      initialCameraPosition.z = 800;
      controls.minDistance = 400;
      controls.maxDistance = 1000;
    } else {
      initialCameraPosition.x = 700;
      initialCameraPosition.y = 350;
      initialCameraPosition.z = 700;
      controls.minDistance = 300;
      controls.maxDistance = 1400;
    }

    // Only reset camera position if not actively interacting with the scene
    if (!controls.enabled) {
      camera.position.set(
        initialCameraPosition.x,
        initialCameraPosition.y,
        initialCameraPosition.z
      );
      camera.lookAt(0, 0, 0);
    }
  }, 250);
});

// Render loop
function renderLoop() {
  requestAnimationFrame(renderLoop);
  controls.update();
  renderer.render(scene, camera);
}

// Initialize
updateScene();
renderLoop();
