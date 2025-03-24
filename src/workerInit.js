import YoutubeChartWorker from './workers/youtubeWorker.worker.js'
import ArtistChartsWorker from './workers/artistsCharts.worker.js';
import MyWorker from './worker.worker.js';
import { platformCharts, platforms, indexData, chartConfig  } from './initData.js';

let randomArray = [];
let indices = [];

export const workers = {
  artist_charts_worker: new ArtistChartsWorker(),
  youtube_chart_worker: new YoutubeChartWorker(),
  worker: new MyWorker()
};

// Creating a new SharedArrayBuffer
export const sharedBuffer = new SharedArrayBuffer(24 * Float32Array.BYTES_PER_ELEMENT)
// 12 months for every platform:
//YouTube: 1 - 12

// Web Worker message handler
workers.worker.onmessage = function (e) {
  randomArray = e.data.randomArray
  indices = e.data.indices

  // Update graphs with results from Web Worker
  indexData.push(indices)
}


const progressBar = document.getElementById("youtube-chart-progress-bar");
const progressText = document.getElementById("youtube-chart-progress-text");

// Обработчик сообщений для youtube_chart_worker
export function youtubeChartWorkerOnMessaheHandler(e) {
  if (e.data.length) {
    const progressValue = (e.data.length / 12) * 100;
    progressBar.value = progressValue;
    progressText.textContent = `${Math.round(progressValue)}%`;

    platformCharts["youtubeChart"].data.datasets[0].data = e.data;
    platformCharts["youtubeChart"].update();
  }
}

workers.youtube_chart_worker.onmessage = youtubeChartWorkerOnMessaheHandler;

workers.artist_charts_worker.onmessage = function (e) {
  const processedPlatforms = e.data.platforms;

  processedPlatforms.forEach((platform) => {
    const ctx = document.getElementById(platform.id).getContext('2d');

    if (platformCharts[platform.id]) {
      platformCharts[platform.id].destroy();
    }

    platformCharts[platform.id] = new Chart(
      ctx,
      chartConfig(platform.label, platform.data, platform.color, platform.bg)
    );
  });
};


