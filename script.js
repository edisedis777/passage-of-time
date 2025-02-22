import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
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
  color: 0x0077ff,
  shininess: 25,
  specular: 0x444444,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Moon with grey color
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

// Earth's orbit - Updated to 4 years and white color
const earthOrbitPath = createHelicalPath(200, 100, 4, 2000); // Increased turns to 4, more points for smoothness
const earthOrbitGeometry = new THREE.TubeGeometry(
  earthOrbitPath,
  2000,
  1,
  8,
  false
);
const earthOrbitMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff, // Changed to white
  transparent: true,
  opacity: 0.3,
});
const earthOrbit = new THREE.Mesh(earthOrbitGeometry, earthOrbitMaterial);
scene.add(earthOrbit);

// Animation parameters
const daysPerYear = 365.25;
const daysPerMonth = 29.5 * 3; // Slowed down moon rotation by factor of 3

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
timeSlider.max = daysPerYear * 4;

function updateScene() {
  const totalDays = daysPerYear * 4; // Total days for 4 years
  const yearProgress = (currentDay % totalDays) / totalDays;
  const monthProgress = (currentDay % daysPerMonth) / daysPerMonth;

  // Update Earth position
  const earthPoint = earthOrbitPath.getPoint(yearProgress);
  earth.position.copy(earthPoint);

  // Update Moon position - simplified orbit
  const moonAngle = monthProgress * Math.PI * 2;
  const moonRadius = 40; // Distance from Earth
  moon.position.set(
    earthPoint.x + Math.cos(moonAngle) * moonRadius,
    earthPoint.y,
    earthPoint.z + Math.sin(moonAngle) * moonRadius
  );

  // Update time display
  const years = Math.floor(currentDay / daysPerYear);
  const months = Math.floor((currentDay % daysPerYear) / daysPerMonth);
  const days = Math.floor(currentDay % daysPerMonth);
  timeDisplay.textContent = `Year ${years}, Month ${months + 1}, Day ${days}`;
}

function animate() {
  if (isPlaying) {
    requestAnimationFrame(animate);
    currentDay = (currentDay + animationSpeed) % (daysPerYear * 4); // Updated for 4 years
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
