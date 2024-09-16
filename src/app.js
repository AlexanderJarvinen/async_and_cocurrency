import Chart from 'chart.js/auto';
import './style.css';

let ctx = document.getElementById("chart").getContext("2d");
let ctx2 = document.getElementById("chart2").getContext("2d"); // Контекст для второго графика
let chart;
let chart2;
let data = [];
const dataLength = 100; // Длина массива данных
const largeData = Array.from({ length: dataLength }, (_, i) => i);
const batchSize = Math.floor(dataLength / 100); // Пачка — это одна пятая от общего количества

// Генерация массива случайных чисел
const randomArray = Array.from({ length: dataLength }, () => Math.floor(Math.random() * dataLength));

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

  chart2 = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: [], // Изначально пустые данные
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

  // Если прогресс достиг 100%, обновляем графики
  if (progress === 100) {
    updateCharts();
  }
}

// Найти индекс элемента из randomArray в largeData
function findIndexInLargeData(value) {
  return largeData.indexOf(value);
}

// Обновление графиков после полной обработки данных
function updateCharts() {
  chart.data.labels = data.map((_, i) => i + 1);
  chart.data.datasets[0].data = data;
  
  // Находим и выводим индекс каждого элемента data в randomArray
  const indices = data.map(item => {
    const indexInRandomArray = randomArray.indexOf(item);
    return indexInRandomArray === -1 ? null : indexInRandomArray;
  });

  // Обновляем первый график
  chart.update();
  console.log("График данных обновлен");

  // Обновляем второй график
  chart2.data.labels = indices.map((_, i) => i + 1);
  chart2.data.datasets[0].data = indices;
  chart2.update();
  console.log("График индексов обновлен");
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
  initCharts();
  initDataForChart();
};
