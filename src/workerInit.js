import YoutubeChartWorker from './workers/youtubeWorker.worker.js'
import ArtistChartsWorker from './workers/artistsCharts.worker.js'
import SpotifyChartWorker from './workers/spotifyWorker.worker.js'
import InstaChartWorker from './workers/instaWorker.worker.js'
import FacebookChartWorker from './workers/facebookWorker.worker.js'
import TwitterChartWorker from './workers/twitterWorker.worker.js'
import PandoraChartWorker from './workers/pandoraWorker.worker.js'
import SoundcloudChartWorker from './workers/soundcloudWorker.worker.js'
import DeezerChartWorker from './workers/deezerWorker.worker.js'
import TiktokChartWorker from './workers/tiktokWorker.worker.js'
import MyWorker from './worker.worker.js'
import {
  platformCharts,
  indexData,
} from './initData.js'

import { chartConfig } from './config'

let randomArray = [];
let indices = [];
const totalPlatforms = 9;
const monthsPerPlatform = 12;
const bytesPerElement = 4; // Float32
const bufferSize = totalPlatforms * monthsPerPlatform * bytesPerElement; // 9 * 12 * 4 = 432 байта

export const workers = {
  artist_charts_worker: new ArtistChartsWorker(),
  youtube_chart_worker: new YoutubeChartWorker(),
  spotify_chart_worker: new SpotifyChartWorker(),
  insta_chart_worker: new InstaChartWorker(),
  facebook_chart_worker: new FacebookChartWorker(),
  twitter_chart_worker: new TwitterChartWorker(),
  pandora_chart_worker: new PandoraChartWorker(),
  soundcloud_chart_worker: new SoundcloudChartWorker(),
  deezer_chart_worker: new DeezerChartWorker(),
  tiktok_chart_worker: new TiktokChartWorker(),
  worker: new MyWorker(),
}

export const sharedBuffer = new SharedArrayBuffer(bufferSize)

const platforms = [
  'youtube',
  'spotify',
  'instagram',
  'facebook',
  'twitter',
  'pandora',
  'soundcloud',
  'deezer',
  'tiktok',
]

const progressElements = {}

platforms.forEach((platform) => {
  progressElements[platform] = {
    bar: document.getElementById(`${platform}-chart-progress-bar`),
    text: document.getElementById(`${platform}-chart-progress-text`),
  }
})

export function createChartWorkerHandler(platformKey, chartKey) {
  return function (e) {
    if (e.data.length) {
      const progressValue = (e.data.length / 12) * 100
      progressElements[platformKey].bar.value = progressValue
      progressElements[platformKey].text.textContent = `${Math.round(progressValue)}%`

      platformCharts[chartKey].data.datasets[0].data = e.data
      platformCharts[chartKey].update()
    }
  }
}

workers.youtube_chart_worker.onmessage = createChartWorkerHandler('youtube', 'youtubeChart')
workers.spotify_chart_worker.onmessage = createChartWorkerHandler('spotify', 'spotifyChart')
workers.insta_chart_worker.onmessage = createChartWorkerHandler('instagram', 'instagramChart')
workers.facebook_chart_worker.onmessage = createChartWorkerHandler('facebook', 'facebookChart')
workers.twitter_chart_worker.onmessage = createChartWorkerHandler('twitter', 'twitterChart')
workers.pandora_chart_worker.onmessage = createChartWorkerHandler('pandora', 'pandoraChart')
workers.soundcloud_chart_worker.onmessage = createChartWorkerHandler('soundcloud', 'soundcloudChart')
workers.deezer_chart_worker.onmessage = createChartWorkerHandler('deezer', 'deezerChart')
workers.tiktok_chart_worker.onmessage = createChartWorkerHandler('tiktok', 'tiktokChart')

workers.artist_charts_worker.onmessage = function (e) {
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


// Web Worker message handler
workers.worker.onmessage = function (e) {
  randomArray = e.data.randomArray
  indices = e.data.indices

  // Update graphs with results from Web Worker
  indexData.push(indices)
}

