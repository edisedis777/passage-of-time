import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio); // Better mobile rendering
renderer.setSize(800, 600);
document.getElementById("orbitScene").appendChild(renderer.domElement);

// Enhanced lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
scene.add(sunLight);

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

// Sun
const sunGeometry = new THREE.SphereGeometry(30, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  emissive: 0xffff00,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sunLight.position.copy(sun.position);
scene.add(sun);

// Earth with blue color
const earthGeometry = new THREE.SphereGeometry(15, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x0077ff, // Bright blue color
  shininess: 25,
  specular: 0x444444,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Moon with grey color - Updated size and material
const moonGeometry = new THREE.SphereGeometry(8, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0xdddddd,
  shininess: 20,
  specular: 0x555555,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
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
const earthOrbitPath = createHelicalPath(200, 100, 1, 500);
const earthOrbitGeometry = new THREE.TubeGeometry(
  earthOrbitPath,
  500,
  1,
  8,
  false
);
const earthOrbitMaterial = new THREE.MeshBasicMaterial({
  color: 0x444444,
  transparent: true,
  opacity: 0.5,
});
const earthOrbit = new THREE.Mesh(earthOrbitGeometry, earthOrbitMaterial);
scene.add(earthOrbit);

// Moon's orbit - Updated radius and height
const moonOrbitPath = createHelicalPath(60, 30, 12, 500);
const moonOrbitGeometry = new THREE.TubeGeometry(
  moonOrbitPath,
  500,
  0.5,
  8,
  false
);
const moonOrbitMaterial = new THREE.MeshBasicMaterial({
  color: 0x444444,
  transparent: true,
  opacity: 0.5,
});
const moonOrbit = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
scene.add(moonOrbit);

// Animation parameters
const daysPerYear = 365.25;
const daysPerMonth = 29.5;

let isPlaying = false;
let currentDay = 0;
let animationSpeed = 0.5;

// UI elements
const playPauseBtn = document.getElementById("playPause");
const resetBtn = document.getElementById("reset");
const timeSlider = document.getElementById("timeSlider");
const speedSlider = document.getElementById("speedSlider");
const timeDisplay = document.getElementById("timeDisplay");

function updateScene() {
  const yearProgress = currentDay / daysPerYear;
  const monthProgress = (currentDay % daysPerMonth) / daysPerMonth;

  // Update Earth position
  const earthPoint = earthOrbitPath.getPoint(yearProgress);
  earth.position.copy(earthPoint);

  // Update Moon position - Increased scale factor
  const moonPoint = moonOrbitPath.getPoint(monthProgress);
  moon.position.set(
    earthPoint.x + moonPoint.x * 0.3,
    earthPoint.y + moonPoint.y * 0.3,
    earthPoint.z + moonPoint.z * 0.3
  );

  moonOrbit.position.copy(earth.position);

  // Update time display
  const years = Math.floor(currentDay / daysPerYear);
  const months = Math.floor((currentDay % daysPerYear) / daysPerMonth);
  const days = Math.floor(currentDay % daysPerMonth);
  timeDisplay.textContent = `Year ${years}, Month ${months + 1}, Day ${days}`;
}

function animate() {
  if (isPlaying) {
    requestAnimationFrame(animate);
    currentDay = (currentDay + animationSpeed) % daysPerYear;
    timeSlider.value = currentDay;
    updateScene();
    renderer.render(scene, camera);
  }
}

// Camera and controls setup - Updated positions
camera.position.set(500, 250, 500);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 200;
controls.maxDistance = 1200;

// Event listeners
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

// Updated resize handler
window.addEventListener("resize", () => {
  const container = document.getElementById("orbitScene");
  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Adjust camera position based on screen size
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
