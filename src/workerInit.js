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
export const sharedBuffer = new SharedArrayBuffer(12 * Float32Array.BYTES_PER_ELEMENT) // 12 months

// Web Worker message handler
worker.onmessage = function (e) {
  randomArray = e.data.randomArray
  indices = e.data.indices

  // Update graphs with results from Web Worker
  indexData.push(indices)
}


youtube_chart_worker.onmessage = function (e) {
  const youtubePopularityData = e.data

  // Check if there is a chart for YouTube in platformCharts and update its data
  if (platformCharts['youtubeChart']) {
    platformCharts['youtubeChart'].data.datasets[0].data = youtubePopularityData
    platformCharts['youtubeChart'].update()
  }
}

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


