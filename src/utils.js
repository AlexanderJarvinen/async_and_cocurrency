import {
  dataLength,
  largeData,
  batchSize,
} from './initData.js'
import {
  updateMainThreadChart,
  updateMainWorkerChart,
  initCharts,
} from './chartsUpdate.js'
import { mainFlowDataConfig, mainWorkerDataConfig } from './config';
import {
  workers,
  sharedBuffer,
  createChartWorkerHandler
} from './workerInit.js'
import YoutubeChartWorker from './workers/youtubeWorker.worker.js'
import SpotifyChartWorker from './workers/spotifyWorker.worker.js'
import InstaChartWorker from './workers/instaWorker.worker.js'
import FacebookChartWorker from './workers/facebookWorker.worker.js'
import TwitterChartWorker from './workers/twitterWorker.worker.js'
import PandoraChartWorker from './workers/pandoraWorker.worker.js'
import SoundcloudChartWorker from './workers/soundcloudWorker.worker.js'
import DeezerChartWorker from './workers/deezerWorker.worker.js'
import TiktokChartWorker from './workers/tiktokWorker.worker'

let globalProgress = 0

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
    const batch = largeData.slice(index, index + batchSize)

    // Start time measurement
    const startTime = performance.now()
    const initialMemory = performance.memory.usedJSHeapSize

    if (index >= largeData.length) {
      hideLoader(loaderId)
      updateChartCallback()
      return
    }

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
  initCharts()
  processLargeData(mainFlowDataConfig)
}

export function initData(isInit = false) {
  initCharts()
  if (isInit) {
    processLargeData(mainFlowDataConfig)
  } else {
    processLargeData(mainWorkerDataConfig)
  }

}

// Data processing in batches using macrotasks (setTimeout)
export async function processBatch(batch) {
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

// Function for restarting youtube_chart_worker
function restartYoutubeWorker() {
  if (workers.youtube_chart_worker) {
    workers.youtube_chart_worker.terminate()
  }

  workers.youtube_chart_worker = new YoutubeChartWorker()
  workers.youtube_chart_worker.onmessage = createChartWorkerHandler('youtube', 'youtubeChart')
}

// Function for restarting spotify_chart_worker
function restartSpotifyWorker() {
  if (workers.spotify_chart_worker) {
    workers.spotify_chart_worker.terminate()
  }

  workers.spotify_chart_worker = new SpotifyChartWorker()
  workers.spotify_chart_worker.onmessage = createChartWorkerHandler('spotify', 'spotifyChart')
}

// Function for restarting insta_chart_worker
function restartInstaWorker() {
  if (workers.insta_chart_worker) {
    workers.insta_chart_worker.terminate()
  }

  workers.insta_chart_worker = new InstaChartWorker()
  workers.insta_chart_worker.onmessage = createChartWorkerHandler('instagram', 'instagramChart')
}

// Function for restarting facebook_chart_worker
function restartFacebookWorker() {
  if (workers.facebook_chart_worker) {
    workers.facebook_chart_worker.terminate()
  }

  workers.facebook_chart_worker = new FacebookChartWorker()
  workers.facebook_chart_worker.onmessage = createChartWorkerHandler('facebook', 'facebookChart')
}

// Function for restarting twitter_chart_worker
function restartTwitterWorker() {
  if (workers.twitter_chart_worker) {
    workers.twitter_chart_worker.terminate()
  }

  workers.twitter_chart_worker = new TwitterChartWorker()
  workers.twitter_chart_worker.onmessage = createChartWorkerHandler('twitter', 'twitterChart')
}

// Function for restarting pandora_chart_worker
function restartPandoraWorker() {
  if (workers.pandora_chart_worker) {
    workers.pandora_chart_worker.terminate()
  }

  workers.pandora_chart_worker = new PandoraChartWorker()
  workers.pandora_chart_worker.onmessage = createChartWorkerHandler('pandora', 'pandoraChart')
}

// Function for restarting soundcloud_chart_worker
function restartSoundcloudWorker() {
  if (workers.soundcloud_chart_worker) {
    workers.soundcloud_chart_worker.terminate()
  }

  workers.soundcloud_chart_worker = new SoundcloudChartWorker()
  workers.soundcloud_chart_worker.onmessage =
    createChartWorkerHandler('soundcloud', 'soundcloudChart')
}

// Function for restarting deezer_chart_worker
function restartDeezerWorker() {
  if (workers.deezer_chart_worker) {
    workers.deezer_chart_worker.terminate()
  }

  workers.deezer_chart_worker = new DeezerChartWorker()
  workers.deezer_chart_worker.onmessage = createChartWorkerHandler('deezer', 'deezerChart')
}

// Function for restarting tiktok_chart_worker
function restartTiktokWorker() {
  if (workers.tiktok_chart_worker) {
    workers.tiktok_chart_worker.terminate()
  }

  workers.tiktok_chart_worker = new TiktokChartWorker()
  workers.tiktok_chart_worker.onmessage = createChartWorkerHandler('tiktok', 'tiktokChart')
}

// Sending data to wokers
export function processDataInWorker(batch) {
  workers.worker.postMessage({ batch, dataLength })

  if (globalProgress === 1) {
    const chartWorkers = [
      ['youtube_chart_worker', restartYoutubeWorker],
      ['spotify_chart_worker', restartSpotifyWorker],
      ['insta_chart_worker', restartInstaWorker],
      ['facebook_chart_worker', restartFacebookWorker],
      ['twitter_chart_worker', restartTwitterWorker],
      ['pandora_chart_worker', restartPandoraWorker],
      ['soundcloud_chart_worker', restartSoundcloudWorker],
      ['deezer_chart_worker', restartDeezerWorker],
      ['tiktok_chart_worker', restartTiktokWorker],
    ]

    for (const [workerKey, restartFn] of chartWorkers) {
      restartFn()
      workers[workerKey].postMessage({ buffer: sharedBuffer })
    }
  }
}

export function initDataForYoutubeChart() {
  restartYoutubeWorker()
  workers.youtube_chart_worker.postMessage({ buffer: sharedBuffer })
}

export function initDataForSpotifyChart() {
  restartSpotifyWorker()
  workers.spotify_chart_worker.postMessage({ buffer: sharedBuffer })
}

export function initDataForInstaChart() {
  restartInstaWorker()
  workers.insta_chart_worker.postMessage({ buffer: sharedBuffer })
}

export function initDataForFacebookChart() {
  restartFacebookWorker()
  workers.facebook_chart_worker.postMessage({ buffer: sharedBuffer })
}

export function initDataForTwitterChart() {
  restartTwitterWorker()
  workers.twitter_chart_worker.postMessage({ buffer: sharedBuffer })
}

export function initDataForPandoraChart() {
  restartPandoraWorker()
  workers.pandora_chart_worker.postMessage({ buffer: sharedBuffer })
}

export function initDataForSoundcloudChart() {
  restartSoundcloudWorker()
  workers.soundcloud_chart_worker.postMessage({ buffer: sharedBuffer })
}

export function initDataForDeezerChart() {
  restartDeezerWorker()
  workers.deezer_chart_worker.postMessage({ buffer: sharedBuffer })
}

export function initDataForTiktokChart() {
  restartTiktokWorker()
  workers.tiktok_chart_worker.postMessage({ buffer: sharedBuffer })
}
