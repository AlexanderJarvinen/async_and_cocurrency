import './style.css'
import MyWorker from './worker.worker.js'

import YoutubeChartWorker from './workers/youtubeWorker.worker.js'
import { logMetrics, processLargeData, dataLength, processDataForMainFlow } from './utils.js'
import { initCharts } from './chartsUpdate.js'

// Creating a new SharedArrayBuffer
const sharedBuffer = new SharedArrayBuffer(12 * Float32Array.BYTES_PER_ELEMENT) // 12 months

// Create Web Worker
const worker = new MyWorker()

const youtube_chart_worker = new YoutubeChartWorker()

let indexData = []
let randomArray = []
let indices = []

function updateMainWorkerChart() {
  chart2.data.labels = indexData.map((_, i) => i + 1)
  chart2.data.datasets[0].data = indexData
  chart2.update()
}

// Send data to Web Worker for processing
function processDataInWorker(batch) {
  worker.postMessage({ batch, dataLength })
  artist_charts_worker.postMessage({ platforms, buffer: sharedBuffer })
  youtube_chart_worker.postMessage({ buffer: sharedBuffer })
}

youtube_chart_worker.onmessage = function (e) {
  const youtubePopularityData = e.data

  // Check if there is a chart for YouTube in platformCharts and update its data
  if (platformCharts['youtubeChart']) {
    platformCharts['youtubeChart'].data.datasets[0].data = youtubePopularityData
    platformCharts['youtubeChart'].update()
  }
}

// Web Worker message handler
worker.onmessage = function (e) {
  randomArray = e.data.randomArray
  indices = e.data.indices

  // Update graphs with results from Web Worker
  indexData.push(indices)
}


// Initialize data and start processing
function initDataForWorker() {
  processLargeData({
    loaderId: 'mainWorkerLoader',
    progressBarId: 'main-worker-progress-bar',
    progressTextId: 'main-worker-progress-text',
    logId: 'mainWorkerLog',
    updateChartCallback: updateMainWorkerChart,
    batchProcessor: processBatch,
    workerProcessor: processDataInWorker, // Transmit data to the Warker
  })
}

window.onload = () => {
  initCharts()
  // initDataForChart();
  document
    .getElementById('startMainChartDataLoadingButton')
    .addEventListener('click', processDataForMainFlow)

  document
    .getElementById('startWorkersButton')
    .addEventListener('click', initDataForWorker)
}
