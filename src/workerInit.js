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

// Web Worker message handler
workers.worker.onmessage = function (e) {
  randomArray = e.data.randomArray
  indices = e.data.indices

  // Update graphs with results from Web Worker
  indexData.push(indices)
}

const progressYoutubeBar = document.getElementById('youtube-chart-progress-bar')
const progressYoutubeText = document.getElementById(
  'youtube-chart-progress-text'
)

const progressSpotifyBar = document.getElementById('spotify-chart-progress-bar')
const progressSpotifyText = document.getElementById(
  'spotify-chart-progress-text'
)

const progressInstaBar = document.getElementById('instagram-chart-progress-bar')
const progressInstaText = document.getElementById(
  'instagram-chart-progress-text'
)

const progressFacebookBar = document.getElementById(
  'facebook-chart-progress-bar'
)
const progressFacebookText = document.getElementById(
  'facebook-chart-progress-text'
)

const progressTwitterBar = document.getElementById('twitter-chart-progress-bar')
const progressTwitterText = document.getElementById(
  'twitter-chart-progress-text'
)

const progressPandoraBar = document.getElementById('pandora-chart-progress-bar')
const progressPandoraText = document.getElementById(
  'pandora-chart-progress-text'
)

const progressSoundcloudBar = document.getElementById(
  'soundcloud-chart-progress-bar'
)
const progressSoundcloudText = document.getElementById(
  'soundcloud-chart-progress-text'
)

const progressDeezerBar = document.getElementById('deezer-chart-progress-bar')
const progressDeezerText = document.getElementById('deezer-chart-progress-text')

const progressTiktokBar = document.getElementById('tiktok-chart-progress-bar')
const progressTiktokText = document.getElementById('tiktok-chart-progress-text')

// Message handler for youtube_chart_worker
export function youtubeChartWorkerOnMessaheHandler(e) {
  if (e.data.length) {
    const progressValue = (e.data.length / 12) * 100
    progressYoutubeBar.value = progressValue
    progressYoutubeText.textContent = `${Math.round(progressValue)}%`

    platformCharts['youtubeChart'].data.datasets[0].data = e.data
    platformCharts['youtubeChart'].update()
  }
}

// Message handler for spotify_chart_worker
export function spotifyChartWorkerOnMessaheHandler(e) {
  if (e.data.length) {
    const progressValue = (e.data.length / 12) * 100
    progressSpotifyBar.value = progressValue
    progressSpotifyText.textContent = `${Math.round(progressValue)}%`

    platformCharts['spotifyChart'].data.datasets[0].data = e.data
    platformCharts['spotifyChart'].update()
  }
}

// Message handler for insta_chart_worker
export function instaChartWorkerOnMessaheHandler(e) {
  if (e.data.length) {
    const progressValue = (e.data.length / 12) * 100
    progressInstaBar.value = progressValue
    progressInstaText.textContent = `${Math.round(progressValue)}%`

    platformCharts['instagramChart'].data.datasets[0].data = e.data
    platformCharts['instagramChart'].update()
  }
}

// Message handler for facebook_chart_worker
export function facebookChartWorkerOnMessaheHandler(e) {
  if (e.data.length) {
    const progressValue = (e.data.length / 12) * 100
    progressFacebookBar.value = progressValue
    progressFacebookText.textContent = `${Math.round(progressValue)}%`

    platformCharts['facebookChart'].data.datasets[0].data = e.data
    platformCharts['facebookChart'].update()
  }
}

// Message handler for twitter_chart_worker
export function twitterChartWorkerOnMessaheHandler(e) {
  if (e.data.length) {
    const progressValue = (e.data.length / 12) * 100
    progressTwitterBar.value = progressValue
    progressTwitterText.textContent = `${Math.round(progressValue)}%`

    platformCharts['twitterChart'].data.datasets[0].data = e.data
    platformCharts['twitterChart'].update()
  }
}

// Message handler for pandora_chart_worker
export function pandoraChartWorkerOnMessaheHandler(e) {
  if (e.data.length) {
    const progressValue = (e.data.length / 12) * 100
    progressPandoraBar.value = progressValue
    progressPandoraText.textContent = `${Math.round(progressValue)}%`

    platformCharts['pandoraChart'].data.datasets[0].data = e.data
    platformCharts['pandoraChart'].update()
  }
}

// Message handler for soundcloud_chart_worker
export function soundcloudChartWorkerOnMessaheHandler(e) {
  if (e.data.length) {
    const progressValue = (e.data.length / 12) * 100
    progressSoundcloudBar.value = progressValue
    progressSoundcloudText.textContent = `${Math.round(progressValue)}%`

    platformCharts['soundcloudChart'].data.datasets[0].data = e.data
    platformCharts['soundcloudChart'].update()
  }
}

// Message handler for deezer_chart_worker
export function deezerChartWorkerOnMessaheHandler(e) {
  if (e.data.length) {
    const progressValue = (e.data.length / 12) * 100
    progressDeezerBar.value = progressValue
    progressDeezerText.textContent = `${Math.round(progressValue)}%`

    platformCharts['deezerChart'].data.datasets[0].data = e.data
    platformCharts['deezerChart'].update()
  }
}

// Message handler for tiktok_chart_worker
export function tiktokChartWorkerOnMessaheHandler(e) {
  if (e.data.length) {
    const progressValue = (e.data.length / 12) * 100
    progressTiktokBar.value = progressValue
    progressTiktokText.textContent = `${Math.round(progressValue)}%`

    platformCharts['tiktokChart'].data.datasets[0].data = e.data
    platformCharts['tiktokChart'].update()
  }
}

workers.youtube_chart_worker.onmessage = youtubeChartWorkerOnMessaheHandler
workers.spotify_chart_worker.onmessage = spotifyChartWorkerOnMessaheHandler
workers.insta_chart_worker.onmessage = instaChartWorkerOnMessaheHandler
workers.facebook_chart_worker.onmessage - facebookChartWorkerOnMessaheHandler
workers.twitter_chart_worker.onmessage = twitterChartWorkerOnMessaheHandler
workers.pandora_chart_worker.onmessage = pandoraChartWorkerOnMessaheHandler
workers.soundcloud_chart_worker.onmessage =
  soundcloudChartWorkerOnMessaheHandler
workers.deezer_chart_worker.onmessage = deezerChartWorkerOnMessaheHandler
workers.tiktok_chart_worker.onmessage = tiktokChartWorkerOnMessaheHandler

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
