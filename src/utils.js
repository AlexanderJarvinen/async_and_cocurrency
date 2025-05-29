import { dataLength, largeData, batchSize } from './initData.js';
import {
  updateMainThreadChart,
  updateMainWorkerChart,
  initCharts,
} from './chartsUpdate.js';
import { mainFlowDataConfig, mainWorkerDataConfig } from './config';
import {
  workers,
  sharedBuffer,
  createChartWorkerHandler,
} from './workerInit.js';

let globalProgress = 0;

const chartWorkerConfigs = {
  youtube: {
    workerKey: 'youtube_chart_worker',
    chartId: 'youtubeChart',
    WorkerClass: () =>
      new Worker('./workers/youtubeWorker.worker.js', { type: 'module' }),
  },
  spotify: {
    workerKey: 'spotify_chart_worker',
    chartId: 'spotifyChart',
    WorkerClass: () =>
      new Worker('./workers/spotifyWorker.worker.js', { type: 'module' }),
  },
  instagram: {
    workerKey: 'insta_chart_worker',
    chartId: 'instagramChart',
    WorkerClass: () =>
      new Worker('./workers/instaWorker.worker.js', { type: 'module' }),
  },
  facebook: {
    workerKey: 'facebook_chart_worker',
    chartId: 'facebookChart',
    WorkerClass: () =>
      new Worker('./workers/facebookWorker.worker.js', { type: 'module' }),
  },
  twitter: {
    workerKey: 'twitter_chart_worker',
    chartId: 'twitterChart',
    WorkerClass: () =>
      new Worker('./workers/twitterWorker.worker.js', { type: 'module' }),
  },
  pandora: {
    workerKey: 'pandora_chart_worker',
    chartId: 'pandoraChart',
    WorkerClass: () =>
      new Worker('./workers/pandoraWorker.worker.js', { type: 'module' }),
  },
  soundcloud: {
    workerKey: 'soundcloud_chart_worker',
    chartId: 'soundcloudChart',
    WorkerClass: () =>
      new Worker('./workers/pandoraWorker.worker.js', { type: 'module' }),
  },
  deezer: {
    workerKey: 'deezer_chart_worker',
    chartId: 'deezerChart',
    WorkerClass: () =>
      new Worker('./workers/soundcloudWorker.worker.js', { type: 'module' }),
  },
  tiktok: {
    workerKey: 'tiktok_chart_worker',
    chartId: 'tiktokChart',
    WorkerClass: () =>
      new Worker('./workers/tiktokWorker.worker.js', { type: 'module' }),
  },
};

// const workers = {}
export const restartWorkerFunctions = {};
export const initDataFunctions = {};

for (const [platform, { workerKey, chartId, WorkerClass }] of Object.entries(
  chartWorkerConfigs,
)) {
  restartWorkerFunctions[`restart${capitalize(platform)}Worker`] = function () {
    if (workers[workerKey]) {
      workers[workerKey].terminate();
    }

    workers[workerKey] = WorkerClass();
    workers[workerKey].onmessage = createChartWorkerHandler(platform, chartId);
  };

  initDataFunctions[`initDataFor${capitalize(platform)}Chart`] = function () {
    restartWorkerFunctions[`restart${capitalize(platform)}Worker`]();
    workers[workerKey].postMessage({ buffer: sharedBuffer });
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function logMetrics(logPanel, memoryUsed, timeElapsed) {
  const logDiv = document.getElementById(logPanel);

  // Get or create the first line for memory
  let memoryRow = logDiv.querySelector('.memory-row');
  if (!memoryRow) {
    memoryRow = document.createElement('tr');
    memoryRow.classList.add('memory-row');
    logDiv.appendChild(memoryRow);
  }

  // Get or create a second string for the time
  let timeRow = logDiv.querySelector('.time-row');
  if (!timeRow) {
    timeRow = document.createElement('tr');
    timeRow.classList.add('time-row');
    logDiv.appendChild(timeRow);
  }

  // Add the memory cell to the first line
  const memoryCell = document.createElement('td');
  memoryCell.textContent = `${(memoryUsed / 1024 / 1024).toFixed(2)} MB`; // Convert bytes to MB
  memoryRow.appendChild(memoryCell);

  // Add the cell with time to the second row
  const timeCell = document.createElement('td');
  timeCell.textContent = `${timeElapsed.toFixed(2)} ms`; // Time in milliseconds
  timeRow.appendChild(timeCell);
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
  showLoader(loaderId);
  let index = 0;

  function processNextChunk() {
    const batch = largeData.slice(index, index + batchSize);

    // Start time measurement
    const startTime = performance.now();
    const initialMemory = performance.memory.usedJSHeapSize;

    if (index >= largeData.length) {
      hideLoader(loaderId);
      updateChartCallback();
      return;
    }

    batchProcessor(batch, dataContainer).then((resp) => {
      if (resp) {
        dataContainer.push(...resp);
      }

      if (workerProcessor) {
        workerProcessor(batch);
      }

      index += batchSize;
      updateProgressBar(index, progressBarId, progressTextId);

      // End of time measurement
      const endTime = performance.now();
      const finalMemory = performance.memory.usedJSHeapSize;

      // Logging metrics
      const timeElapsed = endTime - startTime;
      const memoryUsed = finalMemory - initialMemory;

      logMetrics(logId, memoryUsed, timeElapsed);

      // Go to the next stack of data
      setTimeout(processNextChunk, 0);
    });
  }

  processNextChunk();
}

// Show loader
function showLoader(id) {
  document.getElementById(id).style.display = 'block';
}

// Hide the loader
function hideLoader(id) {
  document.getElementById(id).style.display = 'none';
}

// Update the progress bar
function updateProgressBar(index, progressBarId, progressTextId) {
  const progressBar = document.getElementById(progressBarId);
  const progressText = document.getElementById(progressTextId);

  const progress = (index / dataLength) * 100;
  progressBar.value = progress;
  progressText.innerText = `${Math.floor(progress)}%`;
  globalProgress = progress;
}

// Function for data processing using macrotasks and Performance API
export function processDataForMainFlow() {
  initCharts();
  processLargeData(mainFlowDataConfig);
}

export function initData(isInit = false) {
  const config = isInit ? mainFlowDataConfig : mainWorkerDataConfig;

  initCharts();
  processLargeData(config);
}

// Data processing in batches using macrotasks (setTimeout)
export async function processBatch(batch) {
  const results = [];

  for (const value of batch) {
    if (value % 2 === 0) {
      const result = await processEvenNumber(value);
      results.push(result);
    } else {
      results.push(value);
    }
  }

  return results;
}

// Function for processing even numbers with delay
function processEvenNumber(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value); // Return value after delay
    }, Math.random() * 1000); // Random delay up to 1000 ms
  });
}

// Sending data to wokers
export function processDataInWorker(batch) {
  workers.worker.postMessage({ batch, dataLength });

  if (globalProgress === 1) {
    const chartWorkers = [
      [
        'youtube_chart_worker',
        () => restartWorkerFunctions.restartYoutubeWorker,
      ],
      [
        'spotify_chart_worker',
        () => restartWorkerFunctions.restartSpotifyWorker,
      ],
      ['insta_chart_worker', () => restartWorkerFunctions.restartInstaWorker],
      [
        'facebook_chart_worker',
        () => restartWorkerFunctions.restartFacebookWorker,
      ],
      [
        'twitter_chart_worker',
        () => restartWorkerFunctions.restartTwitterWorker,
      ],
      [
        'pandora_chart_worker',
        () => restartWorkerFunctions.restartPandoraWorker,
      ],
      [
        'soundcloud_chart_worker',
        () => restartWorkerFunctions.restartSoundcloudWorker,
      ],
      ['deezer_chart_worker', () => restartWorkerFunctions.restartDeezerWorker],
      ['tiktok_chart_worker', () => restartWorkerFunctions.restartTiktokWorker],
    ];

    for (const [workerKey, restartFn] of chartWorkers) {
      restartFn();
      workers[workerKey].postMessage({ buffer: sharedBuffer });
    }
  }
}
