import Chart from 'chart.js/auto'
import {
  platforms,
  indexData,
  platformCharts,
  data,
} from './initData.js'
import { mainChartConfig, mainWorkerChartConfig, chartConfig } from './config';

let chart, chart2
let ctx = document.getElementById('chart').getContext('2d')
let ctx2 = document.getElementById('chart2').getContext('2d')

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

  chart = new Chart(ctx, mainChartConfig);

  chart2 = new Chart(ctx2, mainWorkerChartConfig);

  platforms.forEach((platform) => {
    const ctx = document.getElementById(platform.id).getContext('2d')
    platformCharts[platform.id] = new Chart(
      ctx,
      chartConfig(platform.label, platform.data, platform.color, platform.bg)
    )
  })
}

// Update charts after receiving data from Web Worker
export function updateMainThreadChart() {
  chart.data.labels = data.map((_, i) => i + 1)
  chart.data.datasets[0].data = data
  chart.update()
}

export function updateMainWorkerChart() {
  chart2.data.labels = indexData.map((_, i) => i + 1)
  chart2.data.datasets[0].data = indexData
  chart2.update()
}
