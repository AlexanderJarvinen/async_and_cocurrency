import { months } from './initData';
import {
  updateMainThreadChart,
  updateMainWorkerChart,
} from './chartsUpdate.js';
import { processBatch, processDataInWorker } from './utils';
import { data, sharedBuffer } from './initData.js';

export const mainChartConfig = {
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
};

export const mainWorkerChartConfig = {
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
};

// Charts settings for each platform
export const chartConfig = (label, data, borderColor, backgroundColor) => ({
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
});

export const mainFlowDataConfig = {
  loaderId: 'mainThreadLoader',
  progressBarId: 'main-thread-progress-bar',
  progressTextId: 'main-thread-progress-text',
  logId: 'mainThreadLog',
  updateChartCallback: updateMainThreadChart,
  batchProcessor: processBatch,
  dataContainer: data, // Main data array
};

export const mainWorkerDataConfig = {
  loaderId: 'mainWorkerLoader',
  progressBarId: 'main-worker-progress-bar',
  progressTextId: 'main-worker-progress-text',
  logId: 'mainWorkerLog',
  updateChartCallback: updateMainWorkerChart,
  batchProcessor: processBatch,
  workerProcessor: processDataInWorker, // Transmit data to the Warker
};

export const platforms = [
  'youtube',
  'spotify',
  'instagram',
  'facebook',
  'twitter',
  'pandora',
  'soundcloud',
  'deezer',
  'tiktok',
];

export const chartWorkerConfigs = {
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
