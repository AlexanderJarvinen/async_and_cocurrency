import Chart from 'chart.js/auto';
import './style.css';
import {
  addMemoryLog,
  formatMemoryUsage,
  showLoader,
  hideLoader,
  initializeMemoryLogTable,
  fetchDataChunk2,
  fetchDataChunk,
  logMetrics
} from './utils'

let ctx = document.getElementById("chart").getContext("2d");
let chart;
let data = [];

function initChart() {
  // If the chart already exists, destroy it before creating a new one
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
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

// Update the chart
function updateChart(newData) {
  console.log("updateChartNewData", newData);
  data = [...data, ...newData];
  chart.data.labels = data.map((_, i) => i + 1);
  chart.data.datasets[0].data = data;
  chart.update();
}


// Problem 1: Blocking the main thread
export function simulateProblemLargeDataProcessing() {
  const largeData = Array.from({ length: 1000 }, (_, i) => i);

  // Check Memory API support
  if (performance.memory) {
    console.log(`Initial Memory Usage: ${formatMemoryUsage(performance.memory.usedJSHeapSize)} MB`);
  } else {
    console.warn("Memory API is not supported in this browser.");
  }

  // Start of time countdown
  const startMark = "simulateProblemLargeDataProcessing-start";
  const endMark = "simulateProblemLargeDataProcessing-end";
  performance.mark(startMark);

  const heapLimit = performance.memory.jsHeapSizeLimit; // Лимит кучи
  console.log(`Heap size limit: ${(heapLimit / 1024 / 1024).toFixed(2)} MB`);

  largeData.forEach((value, index) => {
    // Check current memory usage
    const usedHeap = performance.memory.usedJSHeapSize;
    const usedHeapMB = usedHeap / 1024 / 1024;
    const heapLimitMB = heapLimit / 1024 / 1024;

    if (usedHeap >= heapLimit * 0.9) { // Если используется 90% лимита
      throw new Error(
          `Memory usage exceeded safe threshold: ${usedHeapMB.toFixed(2)} MB (limit: ${heapLimitMB.toFixed(2)} MB)`
      );
    }

    updateChart([value]);

    // Log every 100 iterations
    if (index % 100 === 0) {
      console.log(
          `Processed ${index} items, Current Memory: ${usedHeapMB.toFixed(2)} MB`
      );
    }
  });

  // Finalizing the countdown
  performance.mark(endMark);

  // Measuring runtime
  performance.measure(
      "simulateProblemLargeDataProcessing-duration",
      startMark,
      endMark
  );

  // We get the result of time measurement
  const measure = performance.getEntriesByName(
      "simulateProblemLargeDataProcessing-duration"
  )[0];

  console.log(`simulateProblemLargeDataProcessing took ${measure.duration} ms`);

  // Check memory usage after execution
  if (performance.memory) {
    console.log(`Final Memory Usage: ${formatMemoryUsage(performance.memory.usedJSHeapSize)} MB`);
    console.log(`Total Memory Change: ${formatMemoryUsage(performance.memory.usedJSHeapSize - performance.memory.totalJSHeapSize)} MB`);
  }

  // Cleaning marks and measurements
  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
  performance.clearMeasures("simulateProblemLargeDataProcessing-duration");
}

// Solution 1: Avoid blocking the main thread
function simulateLargeDataProcessingSolved() {
  const largeData = Array.from({ length: 50000 }, (_, i) => i);
  let currentIndex = 0;

  // Changing the initial parameters
  let chunkSize = 1000; // Initial chunk size
  let delay = 0; // Initial delay before the next iteration

  showLoader(); // Showing the loader before processing

  // Measuring the initial state of time and memory
  const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
  const startTime = performance.now();

  function processChunk() {
    const newData = [];

    // Process data with current chunk size
    for (let i = 0; i < chunkSize && currentIndex < largeData.length; i++) {
      const value = largeData[currentIndex];
      newData.push(value);
      currentIndex++;
    }

    // Updating the graph with the new data chunk
    updateChart(newData);

    // Measuring the current memory usage and time
    const currentMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    const currentTime = performance.now();
    const memoryUsed = currentMemory - startMemory;
    const timeElapsed = currentTime - startTime;

    // Logging metrics
    logMetrics(memoryUsed, timeElapsed);

    // Change the parameters at each iteration
    chunkSize = Math.min(5000, chunkSize + 500); // Increasing the size of the chunk
    delay = Math.max(0, delay + 10); // Increase the delay

    // If there is more data, continue processing
    if (currentIndex < largeData.length) {
      setTimeout(processChunk, delay); // Pause before the next iteration
    } else {
      addMemoryLog(false);
      hideLoader(); //  Hiding the loader after processing is complete
    }
  }

  processChunk(); // Let's start processing
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

// Solution 2: Resolving a problem using Promise
function simulateLargeDataProcessingAsyncDelaySolved() {
  const largeData = Array.from({ length: 1000 }, (_, i) => i);
  const chunkSize = 100; // Chunk size

  const startMemory = performance.memory ? performance.memory.usedJSHeapSize : null;
  const startTime = performance.now();

  processChunksSequentially(largeData, chunkSize)
      .then(() => {
        const endTime = performance.now();
        const endMemory = performance.memory ? performance.memory.usedJSHeapSize : null;

        console.log(`Time taken: ${(endTime - startTime).toFixed(2)}ms`);
        if (startMemory !== null && endMemory !== null) {
          console.log(`Memory usage change: ${(endMemory - startMemory) / 1024 / 1024} MB`);
        } else {
          console.log("Memory metrics are not supported in this environment.");
        }
      })
      .catch(error => {
        console.error("Error during processing:", error);
      });
}

// Function for processing chunks sequentially
export async function processChunksSequentially(largeData, chunkSize) {
  let currentIndex = 0;
  const totalChunks = Math.ceil(largeData.length / chunkSize);
  let dataQueue = [];
  const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
  const startTime = performance.now();

  showLoader(); // Show loading indicator at the beginning of processing

  while (currentIndex < largeData.length) {
    const chunkData = await fetchDataChunk2(chunkSize, currentIndex, largeData);
    dataQueue.push(chunkData);

    // Measuring the current memory usage and time
    const currentMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    const currentTime = performance.now();
    const memoryUsed = currentMemory - startMemory;
    const timeElapsed = currentTime - startTime;

    // Logging metrics
    logMetrics(memoryUsed, timeElapsed);

    currentIndex += chunkSize;
  }

  for (const chunk of dataQueue) {
    const chunkRenderStartTime = performance.now();

    updateChart(chunk);
    await new Promise(resolve => setTimeout(resolve, 0)); // Freeing up the thread for the browser

    const chunkRenderEndTime = performance.now();
    console.log(`Chart updated for chunk in ${(chunkRenderEndTime - chunkRenderStartTime).toFixed(2)}ms`);
  }

  hideLoader(); // Remove the loading indicator after processing is complete
}

window.simulateProblemLargeDataProcessing = simulateProblemLargeDataProcessing;

function resetAllProcesses() {
   addMemoryLog(true);
   document.getElementById("log").innerHTML="";
   data=[];
   initChart();
}

window.onload = () => {
  console.log('DOM fully loaded and parsed');
  initializeMemoryLogTable();
  addMemoryLog(true);
  initChart();
  document
      .getElementById("simulateProblemLargeDataProcessingButton")
      .addEventListener("click", simulateProblemLargeDataProcessing);
  document
      .getElementById("simulateProblemLargeDataProcessingButtonSolving")
      .addEventListener("click", simulateLargeDataProcessingSolved);
  document
      .getElementById("simulateLargeDataAsyncDelayButton")
      .addEventListener("click", simulateLargeDataProcessingAsyncDelayProblem);
  document
      .getElementById("simulateLargeDataAsyncDelayButtonSolving")
      .addEventListener("click", simulateLargeDataProcessingAsyncDelaySolved);
  document
      .getElementById("resetDataProcessingButton")
      .addEventListener("click", resetAllProcesses);
};


