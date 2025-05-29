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

// export const spotifySourceData = {
//   sharedBuffer,
//   offset: 0,
//   weights: [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05],
//   inverseIndices: [5],
//   initialMetrics: {
//     monthlyListeners: 100_000,
//     totalStreams: 2_000_000,
//     followers: 50_000,
//   },
//   constantMetrics: {
//     playlistAdds: 10_000,
//     saveRate: 60,
//     skipRate: 20,
//     virality: 1.2,
//   },
//   updateMetrics: {
//     monthlyListeners: (val) => val + Math.floor(Math.random() * 5_000),
//     totalStreams: (val) => val + Math.floor(Math.random() * 100_000),
//     followers: (val) => val + Math.floor(Math.random() * 1_000),
//   },
// }
