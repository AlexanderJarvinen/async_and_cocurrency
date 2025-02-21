import Chart from 'chart.js/auto'
import './style.css'

let ctx = document.getElementById('chart').getContext('2d')
let chart
let data = []
const dataLength = 10000 // Length of the data array
const largeData = Array.from({ length: dataLength }, (_, i) => i)

// Function for chart initialization
function initChart() {
  if (chart) {
    chart.destroy()
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i + 1),
      datasets: [
        {
          label: 'Data Points',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
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
  })
}

// Show loader
function showLoader() {
  document.getElementById('loader').style.display = 'block'
}

// Hide the loader
function hideLoader() {
  document.getElementById('loader').style.display = 'none'
}

// Updating the chart
function updateChart(newData) {
  console.log('updateChartNewData', newData)
  data.push(newData)
  chart.data.labels = data.map((_, i) => i + 1)
  chart.data.datasets[0].data = data
  chart.update()
}

function initDataForChart() {
  showLoader() // Show loader at the beginning of processing
  const largeData = Array.from({ length: 1000 }, (_, i) => i)

  largeData.forEach((value) => {
    if (value % 2 === 0) {
      // If the number is even, process with delay
      setTimeout(() => {
        updateChart(value)
      }, Math.random() * 1000) // Random delay up to 1000 ms
    } else {
      updateChart(value)
    }
  })
  hideLoader() // Hide the loader after processing is complete
}

window.onload = () => {
  console.log('DOM fully loaded and parsed')
  initChart()
  initDataForChart()
}
