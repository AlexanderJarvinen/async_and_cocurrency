
import Chart from 'chart.js/auto';

import { platforms, artist_charts_worker, months } from './initData.js';

let chart, chart2;
const platformCharts = {};
let ctx = document.getElementById('chart').getContext('2d');
let ctx2 = document.getElementById('chart2').getContext('2d');

// Function for charts initialization
export function initCharts() {
  performance.mark('initCharts-start')
  if (chart) {
    chart.destroy()
  }
  if (chart2) {
    chart2.destroy()
  }

  platforms.forEach((platform) => {
    if (platformCharts[platform.id]) {
      platformCharts[platform.id].destroy()
    }
  })

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Data Points',
          data: [],
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

  chart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Index of Data Points',
          data: [],
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
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
  })

  // Charts settings for each platform
  const chartConfig = (label, data, borderColor, backgroundColor) => ({
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: label,
          data: data,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  })

  platforms.forEach((platform) => {
    const ctx = document.getElementById(platform.id).getContext('2d')
    platformCharts[platform.id] = new Chart(
      ctx,
      chartConfig(platform.label, platform.data, platform.color, platform.bg)
    )
  })

  artist_charts_worker.onmessage = function (e) {
    const processedPlatforms = e.data.platforms

    processedPlatforms.forEach((platform) => {
      const ctx = document.getElementById(platform.id).getContext('2d')

      if (platformCharts[platform.id]) {
        platformCharts[platform.id].destroy()
      }

      platformCharts[platform.id] = new Chart(
        ctx,
        chartConfig(platform.label, platform.data, platform.color, platform.bg)
      )
    })
  }
}