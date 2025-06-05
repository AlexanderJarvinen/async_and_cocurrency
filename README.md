# Data Visualization App

An application for visualizing and analyzing the performance of large-scale data processing in the browser using charts (Chart.js), memory and time measurements, and various optimization techniques (including chunking, asynchronous processing, and `setTimeout`).

## Features

- Real-time data visualization using [Chart.js](https://www.chartjs.org/)
- Demonstrates main thread blocking issues (`simulateProblemLargeDataProcessing`)
- Step-by-step processing solution (`simulateLargeDataProcessingSolved`)
- Asynchronous processing with delays (`simulateLargeDataProcessingAsyncDelayProblem`)
- Resolving asynchronous collisions using Promises (`simulateLargeDataProcessingAsyncDelaySolved`)
- Memory and time usage metrics
- Loading indicator during data processing

##  Tech Stack

- [Vite](https://vitejs.dev/) — fast build and development server
- [Chart.js](https://www.chartjs.org/) — data visualization
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) — code quality and formatting
- JavaScript (ES6+)


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


##  Visualization Scenarios

### simulateProblemLargeDataProcessing

Blocks the main thread by processing a large dataset synchronously.

### simulateLargeDataProcessingSolved 

Divides processing into chunks using setTimeout to avoid blocking.

### simulateLargeDataProcessingAsyncDelayProblem 

Demonstrates how naive async processing with delays can still cause race conditions.

### simulateLargeDataProcessingAsyncDelaySolved

Shows how to correctly handle async processing using Promise chaining.

##  Metrics
The app collects basic performance indicators:

### Processing time (start–end)

### Memory usage before and after processing (using performance.memory if supported)

# Purpose
This project is designed for learning and demonstrating:

Performance optimization techniques for data-heavy operations

Event loop and main thread behavior

Practical use of setTimeout, async functions, and Promises for optimization
