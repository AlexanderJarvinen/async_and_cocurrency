import Chart from 'chart.js/auto';
import './style.css';

let ctx = document.getElementById("chart").getContext("2d");
let chart;
let data = [10, 20, 30, 40, 50];

function initChart() {
  // Если график уже существует, уничтожаем его перед созданием нового
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

// Показываем лоадер
function showLoader() {
  document.getElementById("loader").style.display = "block";
}

// Скрываем лоадер
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

// Обновление графика test
function testUpdateChart(newData) {
  console.log("testUpdateChart", newData);
}

// Обновление графика
function updateChart(newData) {
  console.log("updateChartNewData", newData);
  data = [...data, ...newData];
  chart.data.labels = data.map((_, i) => i + 1);
  chart.data.datasets[0].data = data;
  chart.update();
}

// Проблема 1: Блокировка основного потока
function simulateProblemLargeDataProcessing() {
  const largeData = Array.from({ length: 1000 }, (_, i) => i);
  
  largeData.forEach((value) => {
    // Долгая обработка данных
    for (let i = 0; i < 1000; i++) {}
    updateChart([value]);
  }); 
}

// Решение 1: Блокировка основного потока
function simulateLargeDataProcessingSolved() {
  const largeData = Array.from({ length: 50000 }, (_, i) => i);
  
  
  let currentIndex = 0;

  showLoader(); // Показываем лоадер при начале обработки

  function processChunk() {
    const chunkSize = 1000; // Обрабатываем по 1000 элементов за раз
    const newData = [];

    for (let i = 0; i < chunkSize && currentIndex < largeData.length; i++) {
      const value = largeData[currentIndex];
      newData.push(value); // Собираем новые данные
      currentIndex++;
    }

    // Обновляем график с новой порцией данных
    updateChart(newData);

    // Если есть еще данные, продолжаем обработку
    if (currentIndex < largeData.length) {
      setTimeout(processChunk, 0); // Отдаем управление браузеру и продолжаем позже
    } else {
      hideLoader(); // Скрываем лоадер после завершения обработки
    }
  }

  processChunk(); // Запускаем обработку
  
}


// Функция для имитации асинхронного получения данных с разными задержками
function fetchDataChunk(chunkSize, currentIndex, largeData, callback) {
  const delay = Math.random() * 1000; // Случайная задержка от 0 до 1000 мс

  const newData = largeData.slice(currentIndex, currentIndex + chunkSize);

  setTimeout(() => {
    callback(newData, currentIndex);
  }, delay);
}

// Проблема 2: Aсинхронного получения данных с разными задержками
function simulateLargeDataProcessingAsyncDelayProblem() {
  const largeData = Array.from({ length: 1000 }, (_, i) => i);
  const chunkSize = 100; // Размер чанка

  let currentIndex = 0;
  const totalChunks = Math.ceil(largeData.length / chunkSize);

  showLoader(); // Показываем лоадер при начале обработки

  for (let i = 0; i < totalChunks; i++) {
    fetchDataChunk(chunkSize, currentIndex, largeData, (newData) => {
      // Данные могут прийти асинхронно, но по порядку
      updateChart(newData);

      // Скрываем лоадер только после получения всех чанков
      if (currentIndex >= largeData.length - chunkSize) {
        hideLoader();
      }
    });

    currentIndex += chunkSize; // Переходим к следующему чанку
  }
}

window.onload = () => {
  console.log('DOM fully loaded and parsed');
  initChart();
  // Запуск проблемных функций
  // simulateProblemLargeDataProcessing(); // Проблема 1
  // simulateLargeDataProcessingSolved() // Решение 1
  simulateLargeDataProcessingAsyncDelayProblem(); // Проблема 2
};