import Chart from 'chart.js/auto';
import './style.css';
import MyWorker from './worker.worker.js';

// Создаем Web Worker
const worker = new MyWorker();


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

// Функция для инициализации графиков
function initCharts() {
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

  platforms.forEach(platform => {
    const ctx = document.getElementById(platform.id).getContext('2d');
    const data = platform.customData ? platform.customData() : getRandomData(platform.maxData, 5000);
    new Chart(ctx, chartConfig(platform.label, data, platform.color, platform.bg));
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

  // Если прогресс достиг 100%, отправляем данные в Web Worker
  if (progress === 100) {
    updateCharts();
  }
}

// Обновление графиков после получения данных от Web Worker
function updateCharts() {
  chart.data.labels = data.map((_, i) => i + 1);
  chart.data.datasets[0].data = data;
  chart.update();
  console.log("График данных обновлен");

  chart2.data.labels = indexData.map((_, i) => i + 1);
  chart2.data.datasets[0].data = indexData;
  chart2.update();
  console.log("График индексов обновлен");
}

// Отправляем данные в Web Worker для обработки
function processDataInWorker(batch) {
  console.log("batch", batch);
  worker.postMessage({ batch, dataLength });
}

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

    const batch = largeData.slice(index, index + batchSize);

    processBatch(batch).then(() => {
      console.log('processBatch', batchSize)
      processDataInWorker(batch)
      index += batchSize;
      updateProgressBar(index);
      setTimeout(processNextChunk, 0);
    });
  }

  processNextChunk();
}

// Инициализация данных и запуск обработки
function initDataForChart() {
  showLoader();
  processData();
}

window.onload = () => {
  initCharts();
  initDataForChart();
};

// Эмуляция данных для 12 месяцев
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Функция для генерации случайных данных с колебаниями
function getRandomData(baseValue, variance) {
  return Array.from({ length: 12 }, () => {
    // Генерируем случайное значение в диапазоне от -variance до +variance
    const randomVariation = Math.floor(Math.random() * variance) - (variance / 2);
    return Math.max(0, baseValue + randomVariation); // Убедимся, что значение не отрицательное
  });
}

// Формула для расчета популярности на YouTube
function calculateYouTubePopularity(subscribers, views, engagement, mentions, retention, growth, virality) {
  const w1 = 0.25; // weight for Subscribers
  const w2 = 0.2;  // weight for Views
  const w3 = 0.2;  // weight for Engagement
  const w4 = 0.1;  // weight for Mentions
  const w5 = 0.1;  // weight for Retention
  const w6 = 0.1;  // weight for Growth
  const w7 = 0.05; // weight for Virality

  return (w1 * subscribers) +
         (w2 * views) +
         (w3 * engagement) +
         (w4 * mentions) +
         (w5 * retention) +
         (w6 * growth) +
         (w7 * virality);
}

// Генерация данных для YouTube на основе формулы популярности за 12 месяцев
function getYouTubeData(callback) {
  let subscribers = Math.floor(Math.random() * 100) + 1;
    // let views = Math.floor(Math.random() * 100) + 1;
  // let engagement = Math.floor(Math.random() * 100) + 1;
  // let mentions = Math.floor(Math.random() * 100) + 1;
  // let retention = Math.floor(Math.random() * 100) + 1;
  // let growth = Math.floor(Math.random() * 100) + 1;
  // let virality = Math.floor(Math.random() * 100) + 1;

  let s = 0;
   // let v = 0;
  // let e = 0;
  // let m = 0;
  // let r = 0;
  // let g = 0;
  // let v = 0;

  // Используем setTimeout для эмуляции задержки вычислений
  setTimeout(() => {
    while (s <= 1000000) {
      subscribers += Math.floor(Math.random() * 100) + 1;
      s++;
    }

    const views = 50000000;
    const engagement = 5; // 5% engagement
    const mentions = 10000;
    const retention = 60; // 60% retention
    const growth = 10; // 10% growth
    const virality = 1; // 1 viral video

    // Расчет популярности для 12 месяцев
    const popularityData = Array.from({ length: 12 }, () => 
      Math.floor(calculateYouTubePopularity(subscribers, views, engagement, mentions, retention, growth, virality) * (1 + (Math.random() - 0.5) / 5))
    );

    // Вызываем callback с полученными данными
    callback(popularityData);
  }, 0); // Устанавливаем таймер с нулевой задержкой
}

// Пример вызова функции getYouTubeData


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

// Отрисовка графиков
const platforms = [
  { id: 'spotifyChart', label: 'Spotify', maxData: 50000, color: 'rgba(30, 215, 96, 1)', bg: 'rgba(30, 215, 96, 0.2)' },
  { id: 'youtubeChart', label: 'YouTube', maxData: null, color: 'rgba(255, 0, 0, 1)', bg: 'rgba(255, 0, 0, 0.2)', customData: getYouTubeData(data => data)},
  { id: 'instagramChart', label: 'Instagram', maxData: 30000, color: 'rgba(193, 53, 132, 1)', bg: 'rgba(193, 53, 132, 0.2)' },
  { id: 'facebookChart', label: 'Facebook', maxData: 25000, color: 'rgba(59, 89, 152, 1)', bg: 'rgba(59, 89, 152, 0.2)' },
  { id: 'twitterChart', label: 'Twitter', maxData: 20000, color: 'rgba(29, 161, 242, 1)', bg: 'rgba(29, 161, 242, 0.2)' },
  { id: 'pandoraChart', label: 'Pandora', maxData: 15000, color: 'rgba(0, 123, 255, 1)', bg: 'rgba(0, 123, 255, 0.2)' },
  { id: 'soundcloudChart', label: 'SoundCloud', maxData: 10000, color: 'rgba(255, 85, 0, 1)', bg: 'rgba(255, 85, 0, 0.2)' },
  { id: 'deezerChart', label: 'Deezer', maxData: 5000, color: 'rgba(0, 176, 255, 1)', bg: 'rgba(0, 176, 255, 0.2)' },
  { id: 'tiktokChart', label: 'TikTok', maxData: 30000, color: 'rgba(255, 255, 0, 1)', bg: 'rgba(255, 255, 0, 0.2)' }
];


