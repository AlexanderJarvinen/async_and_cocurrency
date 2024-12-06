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

  // Проверяем поддержку Memory API
  if (performance.memory) {
    console.log(`Initial Memory Usage: ${formatMemoryUsage(performance.memory.usedJSHeapSize)} MB`);
  } else {
    console.warn("Memory API is not supported in this browser.");
  }

  // Начало отсчета времени
  const startMark = "simulateProblemLargeDataProcessing-start";
  const endMark = "simulateProblemLargeDataProcessing-end";
  performance.mark(startMark);

  const heapLimit = performance.memory.jsHeapSizeLimit; // Лимит кучи
  console.log(`Heap size limit: ${(heapLimit / 1024 / 1024).toFixed(2)} MB`);

  largeData.forEach((value, index) => {
    // Проверяем текущее использование памяти
    const usedHeap = performance.memory.usedJSHeapSize;
    const usedHeapMB = usedHeap / 1024 / 1024;
    const heapLimitMB = heapLimit / 1024 / 1024;

    if (usedHeap >= heapLimit * 0.9) { // Если используется 90% лимита
      throw new Error(
          `Memory usage exceeded safe threshold: ${usedHeapMB.toFixed(2)} MB (limit: ${heapLimitMB.toFixed(2)} MB)`
      );
    }

    // Долгая обработка данных
    for (let i = 0; i < 1000; i++) {}

    updateChart([value]);

    // Лог каждые 100 итераций
    if (index % 100 === 0) {
      console.log(
          `Processed ${index} items, Current Memory: ${usedHeapMB.toFixed(2)} MB`
      );
    }
  });

  // Завершаем отсчет времени
  performance.mark(endMark);

  // Измеряем время выполнения
  performance.measure(
      "simulateProblemLargeDataProcessing-duration",
      startMark,
      endMark
  );

  // Получаем результат измерения времени
  const measure = performance.getEntriesByName(
      "simulateProblemLargeDataProcessing-duration"
  )[0];

  console.log(`simulateProblemLargeDataProcessing took ${measure.duration} ms`);

  // Проверяем использование памяти после выполнения
  if (performance.memory) {
    console.log(`Final Memory Usage: ${formatMemoryUsage(performance.memory.usedJSHeapSize)} MB`);
    console.log(`Total Memory Change: ${formatMemoryUsage(performance.memory.usedJSHeapSize - performance.memory.totalJSHeapSize)} MB`);
  }

  // Очистка меток и измерений
  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
  performance.clearMeasures("simulateProblemLargeDataProcessing-duration");
}

// Форматирование значения памяти в MB
function formatMemoryUsage(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
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
  initializeMemoryLogTable();
  addMemoryLog();
  initChart();
  // Run problematic functions
  simulateProblemLargeDataProcessing(); // Problem 1
  // simulateLargeDataProcessingSolved() // Solution 1
  // simulateLargeDataProcessingAsyncDelayProblem(); // Problem 2
  // simulateLargeDataProcessingAsyncDelaySolved(); // Solution 2
};

// Инициализация таблицы
function initializeMemoryLogTable() {
  const logDiv = document.getElementById("log");
  const table = document.createElement("table");
  table.id = "memoryLogTable";

  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
          <th>Timestamp</th>
          <th>Used JS Heap Size (MB)</th>
          <th>Total JS Heap Size (MB)</th>
          <th>JS Heap Size Limit (MB)</th>
        `;
  table.appendChild(headerRow);
  logDiv.appendChild(table);
}

// Добавление записи в таблицу
function addMemoryLog() {
  const logDiv = document.getElementById("log");
  const table = document.getElementById("memoryLogTable");

  if (performance.memory) {
    const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
    const timestamp = new Date().toLocaleTimeString();

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
            <td>${timestamp}</td>
            <td>${formatMemoryUsage(usedJSHeapSize)}</td>
            <td>${formatMemoryUsage(totalJSHeapSize)}</td>
            <td>${formatMemoryUsage(jsHeapSizeLimit)}</td>
          `;
    table.appendChild(newRow);
  } else {
    const warningRow = document.createElement("tr");
    warningRow.innerHTML = `<td colspan="4">Memory API is not supported in this browser.</td>`;
    table.appendChild(warningRow);
  }
}