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
import { updateMainThreadChart, updateMainWorkerChart, initCharts } from './chartsUpdate.js';
import {
  workers,
  sharedBuffer,
  youtubeChartWorkerOnMessaheHandler,
  spotifyChartWorkerOnMessaheHandler,
  instaChartWorkerOnMessaheHandler,
  facebookChartWorkerOnMessaheHandler,
  twitterChartWorkerOnMessaheHandler,
  pandoraChartWorkerOnMessaheHandler,
  soundcloudChartWorkerOnMessaheHandler,
  deezerChartWorkerOnMessaheHandler,
  tiktokChartWorkerOnMessaheHandler
} from './workerInit.js';
import YoutubeChartWorker from './workers/youtubeWorker.worker.js'
import SpotifyChartWorker from './workers/spotifyWorker.worker.js';
import InstaChartWorker from './workers/instaWorker.worker.js';
import FacebookChartWorker from './workers/facebookWorker.worker.js';
import TwitterChartWorker from './workers/twitterWorker.worker.js';
import PandoraChartWorker from './workers/pandoraWorker.worker.js';
import SoundcloudChartWorker from './workers/soundcloudWorker.worker.js';
import DeezerChartWorker from './workers/deezerWorker.worker.js';
import TiktokChartWorker from './workers/tiktokWorker.worker';

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
  initCharts()
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
  initCharts()
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

// Функция для перезапуска youtube_chart_worker
function restartYoutubeWorker() {
  // Завершаем текущий экземпляр
  if (workers.youtube_chart_worker) {
    workers.youtube_chart_worker.terminate();
  }
  // Создаем новый экземпляр и переназначаем обработчик
  workers.youtube_chart_worker = new YoutubeChartWorker();
  workers.youtube_chart_worker.onmessage = youtubeChartWorkerOnMessaheHandler;
}

// Функция для перезапуска spotify_chart_worker
function restartSpotifyWorker() {
  // Завершаем текущий экземпляр
  if (workers.spotify_chart_worker) {
    workers.spotify_chart_worker.terminate();
  }
  // Создаем новый экземпляр и переназначаем обработчик
  workers.spotify_chart_worker = new SpotifyChartWorker();
  workers.spotify_chart_worker.onmessage = spotifyChartWorkerOnMessaheHandler;
}

// Функция для перезапуска insta_chart_worker
function restartInstaWorker() {
  // Завершаем текущий экземпляр
  if (workers.insta_chart_worker) {
    workers.insta_chart_worker.terminate();
  }
  // Создаем новый экземпляр и переназначаем обработчик
  workers.insta_chart_worker = new InstaChartWorker();
  workers.insta_chart_worker.onmessage = instaChartWorkerOnMessaheHandler;
}

// Функция для перезапуска facebook_chart_worker
function restartFacebookWorker() {
  // Завершаем текущий экземпляр
  if (workers.facebook_chart_worker) {
    workers.facebook_chart_worker.terminate();
  }
  // Создаем новый экземпляр и переназначаем обработчик
  workers.facebook_chart_worker = new FacebookChartWorker();
  workers.facebook_chart_worker.onmessage = facebookChartWorkerOnMessaheHandler;
}

// Функция для перезапуска twitter_chart_worker
function restartTwitterWorker() {
  // Завершаем текущий экземпляр
  if (workers.twitter_chart_worker) {
    workers.twitter_chart_worker.terminate();
  }
  // Создаем новый экземпляр и переназначаем обработчик
  workers.twitter_chart_worker = new TwitterChartWorker();
  workers.twitter_chart_worker.onmessage = twitterChartWorkerOnMessaheHandler;
}

// Функция для перезапуска pandora_chart_worker
function restartPandoraWorker() {
  // Завершаем текущий экземпляр
  if (workers.pandora_chart_worker) {
    workers.pandora_chart_worker.terminate();
  }
  // Создаем новый экземпляр и переназначаем обработчик
  workers.pandora_chart_worker = new PandoraChartWorker();
  workers.pandora_chart_worker.onmessage = pandoraChartWorkerOnMessaheHandler;
}

// Функция для перезапуска soundcloud_chart_worker
function restartSoundcloudWorker() {
  // Завершаем текущий экземпляр
  if (workers.soundcloud_chart_worker) {
    workers.soundcloud_chart_worker.terminate();
  }
  // Создаем новый экземпляр и переназначаем обработчик
  workers.soundcloud_chart_worker = new SoundcloudChartWorker();
  workers.soundcloud_chart_worker.onmessage = soundcloudChartWorkerOnMessaheHandler;
}

// Функция для перезапуска deezer_chart_worker
function restartDeezerWorker() {
  // Завершаем текущий экземпляр
  if (workers.deezer_chart_worker) {
    workers.deezer_chart_worker.terminate();
  }
  // Создаем новый экземпляр и переназначаем обработчик
  workers.deezer_chart_worker = new DeezerChartWorker();
  workers.deezer_chart_worker.onmessage = deezerChartWorkerOnMessaheHandler;
}

// Функция для перезапуска tiktok_chart_worker
function restartTiktokWorker() {
  // Завершаем текущий экземпляр
  if (workers.tiktok_chart_worker) {
    workers.tiktok_chart_worker.terminate();
  }
  // Создаем новый экземпляр и переназначаем обработчик
  workers.tiktok_chart_worker = new TiktokChartWorker();
  workers.tiktok_chart_worker.onmessage = tiktokChartWorkerOnMessaheHandler;
}

// Отправка данных в воркеры
export function processDataInWorker(batch) {
  // Отправляем данные в другой воркер, если нужно
  workers.worker.postMessage({ batch, dataLength });
  // artist_charts_worker.postMessage({ platforms, buffer: sharedBuffer })
  if (globalProgress === 1) {
    restartYoutubeWorker();
    workers.youtube_chart_worker.postMessage({ buffer: sharedBuffer });

    restartSpotifyWorker();
    workers.spotify_chart_worker.postMessage({ buffer: sharedBuffer });

    restartInstaWorker();
    workers.insta_chart_worker.postMessage({ buffer: sharedBuffer });

    restartFacebookWorker();
    workers.facebook_chart_worker.postMessage({ buffer: sharedBuffer });

    restartTwitterWorker();
    workers.twitter_chart_worker.postMessage({ buffer: sharedBuffer });

    restartPandoraWorker();
    workers.pandora_chart_worker.postMessage({ buffer: sharedBuffer });

    restartSoundcloudWorker();
    workers.soundcloud_chart_worker.postMessage({ buffer: sharedBuffer });

    restartDeezerWorker();
    workers.deezer_chart_worker.postMessage({ buffer: sharedBuffer });

    restartTiktokWorker();
    workers.tiktok_chart_worker.postMessage({ buffer: sharedBuffer });
  }
}

export function initDataForYoutubeChart() {
  restartYoutubeWorker();
  workers.youtube_chart_worker.postMessage({ buffer: sharedBuffer });
}

export function initDataForSpotifyChart() {
  restartSpotifyWorker();
  workers.spotify_chart_worker.postMessage({ buffer: sharedBuffer });
}

export function initDataForInstaChart() {
  restartInstaWorker();
  workers.insta_chart_worker.postMessage({ buffer: sharedBuffer });
}

export function initDataForFacebookChart() {
  restartFacebookWorker();
  workers.facebook_chart_worker.postMessage({ buffer: sharedBuffer });
}

export function initDataForTwitterChart() {
  restartTwitterWorker();
  workers.twitter_chart_worker.postMessage({ buffer: sharedBuffer });
}

export function initDataForPandoraChart() {
  restartPandoraWorker();
  workers.pandora_chart_worker.postMessage({ buffer: sharedBuffer });
}

export function initDataForSoundcloudChart() {
  restartSoundcloudWorker();
  workers.soundcloud_chart_worker.postMessage({ buffer: sharedBuffer });
}

export function initDataForDeezerChart() {
  restartDeezerWorker();
  workers.deezer_chart_worker.postMessage({ buffer: sharedBuffer });
}

export function initDataForTiktokChart() {
  restartTiktokWorker();
  workers.tiktok_chart_worker.postMessage({ buffer: sharedBuffer });
}