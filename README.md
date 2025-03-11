# Passage of Time
[![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=vsc&logoColor=white)](#)
[![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
[![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
[![Markdown](https://img.shields.io/badge/Markdown-%23000000.svg?logo=markdown&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)



This interactive web application visualizes the orbital paths of the Earth and Moon around the Sun in a 3D environment, simulating their helical motion over time. It uses Three.js for 3D rendering and provides an engaging, educational experience for astronomy enthusiasts.

<img width="835" alt="Screenshot 2025-02-22 at 13 28 35" src="https://github.com/user-attachments/assets/3fc53bb4-9290-474b-82e6-cc599d2d3222" />



### Overview
- The Sun (yellow) at the center.
- The Earth (blue) orbiting the Sun in an elliptical path, completing one orbit in 360 days (for simplification purposes).
- The Moon (gray) orbiting the Earth, completing one orbit in 30 days (for simplification purposes).
- Gray orbit lines for the Earth’s path, and Orange orbit lines for the Moon's path, simulating a helical motion in 3D space.
- Users can control the animation with play/pause, reset, time slider, and speed adjustment features.

### Features
- 3D Visualization: Uses Three.js to render a 3D scene with helical orbits.
- Interactive Controls: Play/pause, reset, time slider (days), and speed adjustment.
- Starry Background: A simple starry effect to enhance the space theme.
- Accessibility: Includes ARIA labels and keyboard controls for better usability.
- Design: Optimized for both desktop and mobile devices.

### Demo 
- Try it Live: [Here](https://edisedis777.github.io/passage-of-time/)

### Installation
To run this project locally, follow these steps:

#### Clone the Repository

- If you have a GitHub repository for this project, clone it:

```bash
git clone <repository-url>
cd passage-of-time
```

If not, create a new folder and download the files manually.

##### Set Up a Local Web Server
Since this project relies on JavaScript and CDNs, you need to serve it via a web server (not directly from file://):

- Using Python (recommended for quick setup):
```bash
python -m http.server 8000
```

- Then open your browser and navigate to http://localhost:8000.
- Using VS Code Live Server Extension: Install the Live Server extension, right-click index.html, and select "Open with Live Server."

Alternative: 
- Use any local web server (e.g., Node.js with http-server).
- Ensure Internet Connection

The project uses CDN-hosted Three.js and OrbitControls libraries, so an active internet connection is required for the initial load.

### Usage
- Open index.html in a web browser via a local web server.
- Use the controls at the bottom to interact with the animation:
- Play/Pause Button: Start or stop the animation (also toggle with the spacebar).
- Reset Button: Reset the animation to Day 0 (also use the ‘r’ key).
- Time Slider (Days): Adjust the current day (0–360) to view specific positions.
- Speed Slider: Adjust the animation speed (0.1x to 2x).
- The starry background and celestial bodies (Sun, Earth, Moon) should be visible, with gray orbit lines showing their paths. 
- Click **"Play"** to see the animation of helical orbits.

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge, versions from 2023 or later) with WebGL enabled.
- An internet connection to load Three.js and OrbitControls from CDNs.

### Known Issues
- If you see errors like THREE is not defined, ensure your internet connection is active and the CDN URLs in index.html are accessible. 
- Consider using local copies of three.min.js and OrbitControls.min.js if CDNs fail (see comments in index.html for fallback instructions).
- Orbit controls may not work if the OrbitControls.min.js script fails to load. Temporarily, the project operates without orbit controls until visibility is confirmed.

### Contributing
- Contributions are welcome!


### License
- This project is licensed under the MIT License. See the LICENSE file for details.

### Acknowledgements
- Built using Three.js for 3D rendering.
- Inspired by a retro-style image of Earth, Moon, and Sun orbits, from [here](https://archive.org/details/yousciencescienc00bran/page/172/mode/1up).

<img width="570" alt="Screenshot 2025-02-22 at 13 38 27" src="https://github.com/user-attachments/assets/fa469fe3-e2e3-4aa1-b2d7-5cb644da39dd" />
