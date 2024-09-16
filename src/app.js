import Chart from 'chart.js/auto';
import './style.css';

let ctx = document.getElementById("chart").getContext("2d");
let chart;
let data = [];
const dataLength = 100; // Длина массива данных
const largeData = Array.from({ length: dataLength }, (_, i) => i);
const batchSize = Math.floor(dataLength / 5); // Пачка — это одна пятая от общего количества

// Функция для инициализации графика
function initChart() {
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [], // Изначально пустые данные
      datasets: [
        {
          label: "Data Points",
          data: [],
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

// Обновляем прогресс-бар
function updateProgressBar(index) {
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  const progress = (index / dataLength) * 100;
  progressBar.value = progress;
  progressText.innerText = `${Math.floor(progress)}%`;

  // Если прогресс достиг 100%, обновляем график
  if (progress === 100) {
    updateChart();
  }
}

// Обновление графика после полной обработки данных
function updateChart() {
  chart.data.labels = data.map((_, i) => i + 1);
  chart.data.datasets[0].data = data;
  chart.update();
  console.log("График обновлен");
}

// Функция для обработки четных чисел с задержкой
function processEvenNumber(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value); // Возвращаем значение после задержки
      console.log(value);
    }, Math.random() * 1000); // Случайная задержка до 1000 мс
  });
}

// Обработка данных пачками с использованием макротасков (setTimeout)
async function processBatch(batch) {
  const results = [];

  for (const value of batch) {
    if (value % 2 === 0) {
      // Если число четное, обрабатываем с задержкой
      const result = await processEvenNumber(value);
      results.push(result);
    } else {
      // Если число нечетное, добавляем сразу
      results.push(value);
    }
  }

  // Добавляем результаты в общий массив данных, но не обновляем график
  data.push(...results);
}

// Функция для обработки данных с использованием макротасков
function processData() {
  let index = 0;

  function processNextChunk() {
    if (index >= largeData.length) {
      hideLoader();
      return;
    }

    // Получаем следующий блок данных для обработки
    const batch = largeData.slice(index, index + batchSize);

    // Обрабатываем текущий блок данных
    processBatch(batch).then(() => {
      index += batchSize;

      // Обновляем прогресс-бар
      updateProgressBar(index);

      // Используем setTimeout с задержкой 0 для планирования следующей макротаски
      setTimeout(processNextChunk, 0);
    });
  }

  // Запускаем первую итерацию
  processNextChunk();
}

// Инициализация данных и запуск обработки
function initDataForChart() {
  showLoader();
  processData();
}

window.onload = () => {
  console.log('DOM fully loaded and parsed');
  initChart();
  initDataForChart();
};