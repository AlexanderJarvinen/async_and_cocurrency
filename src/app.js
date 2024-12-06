import Chart from 'chart.js/auto';
import './style.css';

let ctx = document.getElementById("chart").getContext("2d");
let chart;
let data = [10, 20, 30, 40, 50];

function initChart() {
  // If the chart already exists, destroy it before creating a new one
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((_, i) => i + 1),
      datasets: [
        {
          label: "Data Points",
          data: data,
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      animation: {
        duration: 0,
      },
    },
  });
}

// Show the loader
function showLoader() {
  document.getElementById("loader").style.display = "block";
}

// Hide the loader
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

// Test chart update
function testUpdateChart(newData) {
  console.log("testUpdateChart", newData);
}

// Update the chart
function updateChart(newData) {
  console.log("updateChartNewData", newData);
  data = [...data, ...newData];
  chart.data.labels = data.map((_, i) => i + 1);
  chart.data.datasets[0].data = data;
  chart.update();
}

// Problem 1: Blocking the main thread
function simulateProblemLargeDataProcessing() {
  const largeData = Array.from({ length: 1000 }, (_, i) => i);

  largeData.forEach((value) => {
    // Lengthy data processing
    for (let i = 0; i < 1000; i++) {}
    updateChart([value]);
  });
}

// Solution 1: Avoid blocking the main thread
function simulateLargeDataProcessingSolved() {
  const largeData = Array.from({ length: 50000 }, (_, i) => i);

  let currentIndex = 0;

  showLoader(); // Show the loader at the start of processing

  function processChunk() {
    const chunkSize = 1000; // Process 1000 items at a time
    const newData = [];

    for (let i = 0; i < chunkSize && currentIndex < largeData.length; i++) {
      const value = largeData[currentIndex];
      newData.push(value); // Collect new data
      currentIndex++;
    }

    // Update the chart with the new chunk of data
    updateChart(newData);

    // If there is more data, continue processing
    if (currentIndex < largeData.length) {
      setTimeout(processChunk, 0); // Yield to the browser and continue later
    } else {
      hideLoader(); // Hide the loader after processing is complete
    }
  }

  processChunk(); // Start processing
}


// Function to simulate asynchronous data fetching with random delays
function fetchDataChunk(chunkSize, currentIndex, largeData, callback) {
  const delay = Math.random() * 1000; // Random delay from 0 to 1000 ms

  const newData = largeData.slice(currentIndex, currentIndex + chunkSize);

  setTimeout(() => {
    callback(newData, currentIndex);
  }, delay);
}

// Problem 2: Asynchronous data fetching with random delays
function simulateLargeDataProcessingAsyncDelayProblem() {
  const largeData = Array.from({ length: 1000 }, (_, i) => i);
  const chunkSize = 100; // Chunk size

  let currentIndex = 0;
  const totalChunks = Math.ceil(largeData.length / chunkSize);

  showLoader(); // Show the loader at the start of processing

  for (let i = 0; i < totalChunks; i++) {
    fetchDataChunk(chunkSize, currentIndex, largeData, (newData) => {
      // Data may arrive asynchronously but in order
      updateChart(newData);

      // Hide the loader only after all chunks are received
      if (currentIndex >= largeData.length - chunkSize) {
        hideLoader();
      }
    });

    currentIndex += chunkSize; // Move to the next chunk
  }
}

// Function to simulate asynchronous data fetching with random delays
function fetchDataChunk2(chunkSize, currentIndex, largeData) {
  return new Promise((resolve) => {
    const delay = Math.random() * 1000; // Random delay from 0 to 1000 ms
    const newData = largeData.slice(currentIndex, currentIndex + chunkSize);

    setTimeout(() => {
      resolve(newData);
    }, delay);
  });
}

// Function to process chunks sequentially
async function processChunksSequentially(largeData, chunkSize) {
  let currentIndex = 0;
  const totalChunks = Math.ceil(largeData.length / chunkSize);
  let dataQueue = [];

  showLoader(); // Show the loader at the start of processing

  while (currentIndex < largeData.length) {
    const chunkData = await fetchDataChunk2(chunkSize, currentIndex, largeData);
    dataQueue.push(chunkData);
    currentIndex += chunkSize;
  }

  for (const chunk of dataQueue) {
    updateChart(chunk);
    await new Promise(resolve => setTimeout(resolve, 0)); // Yield to the browser
  }

  hideLoader(); // Hide the loader after processing is complete
}

function simulateLargeDataProcessingAsyncDelaySolved() {
  const largeData = Array.from({ length: 1000 }, (_, i) => i);
  const chunkSize = 100; // Chunk size

  processChunksSequentially(largeData, chunkSize); // Start processing
}

window.onload = () => {
  console.log('DOM fully loaded and parsed');
  initChart();
  // Run problematic functions
  // simulateProblemLargeDataProcessing(); // Problem 1
  // simulateLargeDataProcessingSolved() // Solution 1
  // simulateLargeDataProcessingAsyncDelayProblem(); // Problem 2
  simulateLargeDataProcessingAsyncDelaySolved(); // Solution 2
};