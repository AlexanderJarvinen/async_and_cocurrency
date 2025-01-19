import Chart from 'chart.js/auto';
import './style.css';
import MyWorker from './worker.worker.js';
import ArtistChartsWorker from './workers/artistsCharts.worker.js';
import YoutubeChartWorker from './workers/youtubeWorker.worker.js';
import { logMetrics } from './utils.js';

// Создание нового SharedArrayBuffer
const sharedBuffer = new SharedArrayBuffer(12 * Float32Array.BYTES_PER_ELEMENT); // 12 месяцев


// Создаем Web Worker
const worker = new MyWorker();
const artist_charts_worker = new ArtistChartsWorker();
const youtube_chart_worker = new YoutubeChartWorker();


let ctx = document.getElementById("chart").getContext("2d");
let ctx2 = document.getElementById("chart2").getContext("2d");
let chart;
let chart2;
let data = [];
let indexData = [];
let randomArray = [];
let indices = [];
const dataLength = 100; // Длина массива данных
const largeData = Array.from({ length: dataLength }, (_, i) => i);
const batchSize = Math.floor(dataLength / 100); // Пачка
// Эмуляция данных для 12 месяцев
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const platformCharts = {};
let globalProgress = 0;


// Отрисовка графиков
const platforms = [
  { id: 'spotifyChart', label: 'Spotify', maxData: 50000, color: 'rgba(30, 215, 96, 1)', bg: 'rgba(30, 215, 96, 0.2)' },
  { id: 'youtubeChart', label: 'YouTube', maxData: 100000, color: 'rgba(255, 0, 0, 1)', bg: 'rgba(255, 0, 0, 0.2)'},
  { id: 'instagramChart', label: 'Instagram', maxData: 30000, color: 'rgba(193, 53, 132, 1)', bg: 'rgba(193, 53, 132, 0.2)' },
  { id: 'facebookChart', label: 'Facebook', maxData: 25000, color: 'rgba(59, 89, 152, 1)', bg: 'rgba(59, 89, 152, 0.2)' },
  { id: 'twitterChart', label: 'Twitter', maxData: 20000, color: 'rgba(29, 161, 242, 1)', bg: 'rgba(29, 161, 242, 0.2)' },
  { id: 'pandoraChart', label: 'Pandora', maxData: 15000, color: 'rgba(0, 123, 255, 1)', bg: 'rgba(0, 123, 255, 0.2)' },
  { id: 'soundcloudChart', label: 'SoundCloud', maxData: 10000, color: 'rgba(255, 85, 0, 1)', bg: 'rgba(255, 85, 0, 0.2)' },
  { id: 'deezerChart', label: 'Deezer', maxData: 5000, color: 'rgba(0, 176, 255, 1)', bg: 'rgba(0, 176, 255, 0.2)' },
  { id: 'tiktokChart', label: 'TikTok', maxData: 30000, color: 'rgba(255, 255, 0, 1)', bg: 'rgba(255, 255, 0, 0.2)' }
];


// Функция для инициализации графиков
function initCharts() {
  performance.mark('initCharts-start');
  if (chart) {
    chart.destroy();
  }
  if (chart2) {
    chart2.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
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

  chart2 = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Index of Data Points",
          data: [],
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
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

  // Настройки графиков для каждой платформы
const chartConfig = (label, data, borderColor, backgroundColor) => ({
  type: 'line',
  data: {
    labels: months,
    datasets: [{
      label: label,
      data: data,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      fill: true,
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});



    artist_charts_worker.onmessage = function(e) {
    const processedPlatforms = e.data.platforms;

            processedPlatforms.forEach(platform => {
        const ctx = document.getElementById(platform.id).getContext('2d');

        if (platformCharts[platform.id]) {
          platformCharts[platform.id].destroy();
        }

        platformCharts[platform.id] = new Chart(ctx, chartConfig(platform.label, platform.data, platform.color, platform.bg));
      });
  };


}

// Показываем лоадер
function showLoader(id) {
  document.getElementById(id).style.display = "block";
}

// Скрываем лоадер
function hideLoader(id) {
  document.getElementById(id).style.display = "none";
}

// Обновляем прогресс-бар
function updateProgressBar(index, progressBarId, progressTextId) {
  const progressBar = document.getElementById(progressBarId);
  const progressText = document.getElementById(progressTextId);

  const progress = (index / dataLength) * 100;
  progressBar.value = progress;
  progressText.innerText = `${Math.floor(progress)}%`;
  globalProgress = progress;

}

// Обновление графиков после получения данных от Web Worker
function updateMainThreadChart() {
  chart.data.labels = data.map((_, i) => i + 1);
  chart.data.datasets[0].data = data;
  chart.update();
}

function updateMainWorkerChart() {
  chart2.data.labels = indexData.map((_, i) => i + 1);
  chart2.data.datasets[0].data = indexData;
  chart2.update();
}

// Отправляем данные в Web Worker для обработки
function processDataInWorker(batch) {
  worker.postMessage({ batch, dataLength });
  artist_charts_worker.postMessage({ platforms, buffer: sharedBuffer });
  youtube_chart_worker.postMessage({ buffer: sharedBuffer });;
}

youtube_chart_worker.onmessage = function(e) {
    const youtubePopularityData = e.data;

  // Проверяем, есть ли график для YouTube в platformCharts и обновляем его данные
  if (platformCharts['youtubeChart']) {
    platformCharts['youtubeChart'].data.datasets[0].data = youtubePopularityData;
    platformCharts['youtubeChart'].update();
  }
};

// Обработчик сообщений от Web Worker
worker.onmessage = function(e) {
  randomArray = e.data.randomArray;
  indices = e.data.indices;

  // Обновляем графики с результатами от Web Worker
  indexData.push(indices);
};

// Функция для обработки четных чисел с задержкой
function processEvenNumber(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value); // Возвращаем значение после задержки
    }, Math.random() * 1000); // Случайная задержка до 1000 мс
  });
}

// Обработка данных пачками с использованием макротасков (setTimeout)
async function processBatch(batch) {
  const results = [];

  for (const value of batch) {
    if (value % 2 === 0) {
      const result = await processEvenNumber(value);
      results.push(result);
    } else {
      results.push(value);
    }
  }

  return results;
}

// Функция для обработки данных с использованием макротасков и Performance API
function processDataForMainFlow() {
  showLoader("mainThreadLoader");
  let index = 0;

  function processNextChunk() {
    if (index >= largeData.length) {
      hideLoader("mainThreadLoader");
      updateMainThreadChart();
      return;
    }

    const batch = largeData.slice(index, index + batchSize);

    // Начало измерения времени
    const startTime = performance.now();
    const initialMemory = performance.memory.usedJSHeapSize;

    processBatch(batch, data).then((resp) => {
      data.push(...resp);
      index += batchSize;
      updateProgressBar(index, "main-thread-progress-bar", "main-thread-progress-text");

      // Конец измерения времени
      const endTime = performance.now();
      const finalMemory = performance.memory.usedJSHeapSize;

      // Логирование метрик
      const timeElapsed = endTime - startTime;
      const memoryUsed = finalMemory - initialMemory;

      logMetrics('mainThreadLog', memoryUsed, timeElapsed);

      // Переход к следующей пачке данных
      setTimeout(processNextChunk, 0);
    });
  }


  processNextChunk();
}

// Инициализация данных и запуск обработки
function initDataForWorker() {
  showLoader("mainWorkerLoader");
  let index = 0;

  function processNextChunk() {
    if (index >= largeData.length) {
      hideLoader("mainWorkerLoader");
      updateMainWorkerChart()
      return;
    }

    const batch = largeData.slice(index, index + batchSize);

    // Начало измерения времени
    const startTime = performance.now();
    const initialMemory = performance.memory.usedJSHeapSize;

    processBatch(batch).then(() => {
      processDataInWorker(batch);

      index += batchSize;
      updateProgressBar(index, "main-worker-progress-bar", "main-worker-progress-text");

      // Конец измерения времени
      const endTime = performance.now();
      const finalMemory = performance.memory.usedJSHeapSize;

      // Логирование метрик
      const timeElapsed = endTime - startTime;
      const memoryUsed = finalMemory - initialMemory;

      logMetrics("mainWorkerLog", memoryUsed, timeElapsed);

      // Переход к следующей пачке данных
      setTimeout(processNextChunk, 0);
    });
  }

  processNextChunk();
}

window.onload = () => {
  initCharts();
  // initDataForChart();
  document
      .getElementById("startMainChartDataLoadingButton")
      .addEventListener("click",  processDataForMainFlow);

  document
      .getElementById("startWorkersButton")
      .addEventListener("click",  initDataForWorker);
};






