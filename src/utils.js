import {
  platforms,
  dataLength,
  largeData,
  batchSize,
  indexData,
  platformCharts,
  data,
  chartConfig
} from './initData.js';
import { updateMainThreadChart, updateMainWorkerChart } from './chartsUpdate.js';
import { worker, artist_charts_worker, sharedBuffer, youtube_chart_worker } from './workerInit.js';

let globalProgress = 0;


export function logMetrics(logPanel, memoryUsed, timeElapsed) {
  const logDiv = document.getElementById(logPanel)

  // Get or create the first line for memory
  let memoryRow = logDiv.querySelector('.memory-row')
  if (!memoryRow) {
    memoryRow = document.createElement('tr')
    memoryRow.classList.add('memory-row')
    logDiv.appendChild(memoryRow)
  }

  // Get or create a second string for the time
  let timeRow = logDiv.querySelector('.time-row')
  if (!timeRow) {
    timeRow = document.createElement('tr')
    timeRow.classList.add('time-row')
    logDiv.appendChild(timeRow)
  }

  // Add the memory cell to the first line
  const memoryCell = document.createElement('td')
  memoryCell.textContent = `${(memoryUsed / 1024 / 1024).toFixed(2)} MB` // Convert bytes to MB
  memoryRow.appendChild(memoryCell)

  // Add the cell with time to the second row
  const timeCell = document.createElement('td')
  timeCell.textContent = `${timeElapsed.toFixed(2)} ms` // Time in milliseconds
  timeRow.appendChild(timeCell)
}

export function processLargeData({
  loaderId,
  progressBarId,
  progressTextId,
  logId,
  updateChartCallback,
  batchProcessor,
  workerProcessor = null,
  dataContainer = [],
}) {
  showLoader(loaderId)
  let index = 0

  function processNextChunk() {
    if (index >= largeData.length) {
      hideLoader(loaderId)
      updateChartCallback()
      return
    }

    const batch = largeData.slice(index, index + batchSize)

    // Start time measurement
    const startTime = performance.now()
    const initialMemory = performance.memory.usedJSHeapSize

    batchProcessor(batch, dataContainer).then((resp) => {
      if (resp) {
        dataContainer.push(...resp)
      }

      if (workerProcessor) {
        workerProcessor(batch)
      }

      index += batchSize
      updateProgressBar(index, progressBarId, progressTextId)

      // End of time measurement
      const endTime = performance.now()
      const finalMemory = performance.memory.usedJSHeapSize

      // Logging metrics
      const timeElapsed = endTime - startTime
      const memoryUsed = finalMemory - initialMemory

      logMetrics(logId, memoryUsed, timeElapsed)

      // Go to the next stack of data
      setTimeout(processNextChunk, 0)
    })
  }

  processNextChunk()
}

// Show loader
function showLoader(id) {
  document.getElementById(id).style.display = 'block'
}

// Hide the loader
function hideLoader(id) {
  document.getElementById(id).style.display = 'none'
}

// Update the progress bar
function updateProgressBar(index, progressBarId, progressTextId) {
  const progressBar = document.getElementById(progressBarId)
  const progressText = document.getElementById(progressTextId)

  const progress = (index / dataLength) * 100
  progressBar.value = progress
  progressText.innerText = `${Math.floor(progress)}%`
  globalProgress = progress
}

// Function for data processing using macrotasks and Performance API
export function processDataForMainFlow() {
  processLargeData({
    loaderId: 'mainThreadLoader',
    progressBarId: 'main-thread-progress-bar',
    progressTextId: 'main-thread-progress-text',
    logId: 'mainThreadLog',
    updateChartCallback: updateMainThreadChart,
    batchProcessor: processBatch,
    dataContainer: data,  // Main data array
  })
}

export function initDataForWorker() {
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

// Data processing in batches using macrotasks (setTimeout)
async function processBatch(batch) {
  const results = []

  for (const value of batch) {
    if (value % 2 === 0) {
      const result = await processEvenNumber(value)
      results.push(result)
    } else {
      results.push(value)
    }
  }

  return results
}

// Function for processing even numbers with delay
function processEvenNumber(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value) // Return value after delay
    }, Math.random() * 1000) // Random delay up to 1000 ms
  })
}

// Send data to Web Worker for processing
export function processDataInWorker(batch) {

  worker.postMessage({ batch, dataLength })
  // artist_charts_worker.postMessage({ platforms, buffer: sharedBuffer })
  console.log('sharedBuffer', sharedBuffer);
  if (globalProgress === 1) {
    youtube_chart_worker.postMessage({ buffer: sharedBuffer })
  }
}

export function initDataForYoutubeChart () {
  youtube_chart_worker.postMessage({ buffer: sharedBuffer });
}