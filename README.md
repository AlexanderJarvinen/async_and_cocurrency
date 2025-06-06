# Social Platform Analytics Visualization
This project visualizes popularity metrics across various social platforms using dynamic charts. It features:

- Real-time data simulation and rendering
- Batched data processing
- Web Workers for concurrent computation
- Visual performance metrics (memory and time)

# Features

- Interactive dashboard with multiple charts
- One-click data generation for platforms: YouTube, Spotify, Instagram, Facebook, Twitter, Pandora, SoundCloud, Deezer, TikTok
- Batch data processing with progress bar
- Performance logging (memory usage, time per batch)
- Dual-mode operation: Main thread vs. Web Worker processing

##  Installation and Launch

### Clone the repository
git clone https://github.com/your-username/data-visualization-app.git
cd data-visualization-app

### Install dependencies
npm install

### Start the development server
npm run dev

### Builds the app for production to the dist folder.
npm run build

### Runs ESLint to check code quality.
npm run lint

### Formats the code using Prettier.
npm run format

# Usage
- Load the main charts with:

  - Start Main Chart – loads data on main thread
  - Start Workers – loads using Web Workers

- Click platform buttons (e.g., "Spotify", "YouTube") to simulate individual data feeds

- Progress bar shows batch processing status

- Performance table displays memory & time per batch

# Technical Highlights

- Chart.js is used for rendering charts
- Web Workers simulate platform-specific data generation in parallel
- SharedArrayBuffer used to share data between workers and main thread (if supported)
- processLargeData() function handles chunking and visual progress
- Performance logs are shown per batch in the dashboard

# Core Concepts

## Main Chart Initialization

initCharts(); // Initializes and resets all platform charts
initData(true); // Main thread data simulation

## Worker-Based Simulation

initData(); // Worker-driven data generation
initDataFunctions.initDataForSpotifyChart(); // Per-platform init

## Batch Processing

processLargeData({
batchProcessor: processBatch,
updateChartCallback: updateMainThreadChart,
});

# Metrics Logging

Every batch logs:
- Used memory in MB
- Time spent in ms

Metrics are appended to a performance table in the UI.

