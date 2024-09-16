import Chart from 'chart.js/auto';
import './style.css';

let ctx = document.getElementById("chart").getContext("2d");
let chart;
let data = [];
const dataLength = 1000; // Длина массива данных
const largeData = Array.from({ length: dataLength }, (_, i) => i);

// Функция для инициализации графика
function initChart() {
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

// Обновление графика
function updateChart(newData) {
  console.log("updateChartNewData", newData);
  data.push(newData);
  chart.data.labels = data.map((_, i) => i + 1);
  chart.data.datasets[0].data = data;
  chart.update();
}

// Функция для обработки четных чисел с задержкой
function processEvenNumber(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      updateChart(value);
      resolve(); // Разрешаем промис после задержки
    }, Math.random() * 1000); // Случайная задержка до 1000 мс
  });
}

// Функция для обработки данных по порядку
async function initDataForChart() {
  showLoader(); // Показываем лоадер при начале обработки

  // Обработка данных по порядку
  for (const value of largeData) {
    if (value % 2 === 0) {
      // Если число четное, обрабатываем с задержкой
      await processEvenNumber(value);
    } else {
      // Если число нечетное, обрабатываем синхронно
      updateChart(value);
    }
  }

  hideLoader(); // Скрываем лоадер после завершения обработки
}

window.onload = () => {
  console.log('DOM fully loaded and parsed');
  initChart();
  initDataForChart();
};
