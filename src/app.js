import Chart from 'chart.js/auto';
import './style.css';

let ctx = document.getElementById("chart").getContext("2d");
let chart;
let data = [];
const dataLength = 10000; // Длина массива данных
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


function initDataForChart() {
   showLoader(); // Показываем лоадер при начале обработки
  const largeData = Array.from({ length: 1000 }, (_, i) => i);


  largeData.forEach((value) => {
    if (value % 2 === 0) {
      // Если число четное, обрабатываем с задержкой
      setTimeout(() => {
       updateChart(value);
      }, Math.random() * 1000); // Случайная задержка до 1000 мс
    } else {
       updateChart(value);
    }
  });
  hideLoader(); // Скрываем лоадер после завершения обработки
}

window.onload = () => {
  console.log('DOM fully loaded and parsed');
  initChart();
  initDataForChart();
};
