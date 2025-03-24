import YoutubeChartWorker from './workers/youtubeWorker.worker.js'
import ArtistChartsWorker from './workers/artistsCharts.worker.js';
import MyWorker from './worker.worker.js';
import { platformCharts, platforms, indexData, chartConfig  } from './initData.js';

let randomArray = [];
let indices = [];

export const artist_charts_worker = new ArtistChartsWorker();
export const youtube_chart_worker = new YoutubeChartWorker()
export const worker = new MyWorker();

// Creating a new SharedArrayBuffer
export const sharedBuffer = new SharedArrayBuffer(24 * Float32Array.BYTES_PER_ELEMENT)
// 12 months for every platform:
//YouTube: 1 - 12

// Web Worker message handler
worker.onmessage = function (e) {
  randomArray = e.data.randomArray
  indices = e.data.indices

  // Update graphs with results from Web Worker
  indexData.push(indices)
}


const progressBar = document.getElementById("youtube-chart-progress-bar");
const progressText = document.getElementById("youtube-chart-progress-text");

youtube_chart_worker.onmessage = function (e) {
  if (e.data.length) {
    const progressValue = (e.data.length / 12) * 100;

    // Обновляем прогресс-бар и текст
    progressBar.value = progressValue;
    progressText.textContent = `${Math.round(progressValue)}%`;

    // Обновляем график
    platformCharts["youtubeChart"].data.datasets[0].data = e.data;
    platformCharts["youtubeChart"].update();
  }

};

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


