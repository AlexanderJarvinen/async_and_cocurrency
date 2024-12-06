import Chart from 'chart.js/auto';
import './style.css';
import {
  addMemoryLog,
  formatMemoryUsage,
  showLoader,
  hideLoader,
  initializeMemoryLogTable,
  processChunksSequentially,
  fetchDataChunk2,
  fetchDataChunk,
  logMetrics
} from './utils'

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

// Solution 1: Avoid blocking the main thread
function simulateLargeDataProcessingSolved() {
  const largeData = Array.from({ length: 50000 }, (_, i) => i);
  let currentIndex = 0;

  // Изменяем начальные параметры
  let chunkSize = 1000; // Начальный размер чанка
  let delay = 0; // Начальная задержка перед следующей итерацией

  showLoader(); // Показываем лоадер перед началом обработки

  // Замеряем начальное состояние времени и памяти
  const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
  const startTime = performance.now();

  function processChunk() {
    const newData = [];

    // Обрабатываем данные с текущим размером чанка
    for (let i = 0; i < chunkSize && currentIndex < largeData.length; i++) {
      const value = largeData[currentIndex];
      newData.push(value);
      currentIndex++;
    }

    // Обновляем график с новым чанком данных
    updateChart(newData);

    // Замеряем текущее использование памяти и время
    const currentMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    const currentTime = performance.now();
    const memoryUsed = currentMemory - startMemory;
    const timeElapsed = currentTime - startTime;

    // Логируем метрики
    logMetrics(memoryUsed, timeElapsed);

    // Изменяем параметры на каждой итерации
    chunkSize = Math.min(5000, chunkSize + 500); // Увеличиваем размер чанка
    delay = Math.max(0, delay + 10); // Увеличиваем задержку

    // Если есть еще данные, продолжаем обработку
    if (currentIndex < largeData.length) {
      setTimeout(processChunk, delay); // Пауза перед следующей итерацией
    } else {
      hideLoader(); // Прячем лоадер после завершения обработки
    }
  }

  processChunk(); // Начинаем обработку
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
  // simulateProblemLargeDataProcessing(); // Problem 1
  // simulateLargeDataProcessingSolved() // Solution 1
  simulateLargeDataProcessingAsyncDelayProblem(); // Problem 2
  // simulateLargeDataProcessingAsyncDelaySolved(); // Solution 2
};


