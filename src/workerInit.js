import { platformCharts, indexData } from './initData.js';

import { chartConfig, platforms } from './config';

let randomArray = [];
let indices = [];
const totalPlatforms = 9;
const monthsPerPlatform = 12;
const bytesPerElement = 4; // Float32
const bufferSize = totalPlatforms * monthsPerPlatform * bytesPerElement; // 9 * 12 * 4 = 432 байта

export const workers = {
  artist_charts_worker: new Worker('./workers/artistsCharts.worker.js', {
    type: 'module',
  }),
  youtube_chart_worker: new Worker('./workers/youtubeWorker.worker.js', {
    type: 'module',
  }),
  spotify_chart_worker: new Worker('./workers/spotifyWorker.worker.js', {
    type: 'module',
  }),
  insta_chart_worker: new Worker('./workers/instaWorker.worker.js', {
    type: 'module',
  }),
  facebook_chart_worker: new Worker('./workers/facebookWorker.worker.js', {
    type: 'module',
  }),
  twitter_chart_worker: new Worker('./workers/twitterWorker.worker.js', {
    type: 'module',
  }),
  pandora_chart_worker: new Worker('./workers/pandoraWorker.worker.js', {
    type: 'module',
  }),
  soundcloud_chart_worker: new Worker('./workers/soundcloudWorker.worker.js', {
    type: 'module',
  }),
  deezer_chart_worker: new Worker('./workers/deezerWorker.worker.js', {
    type: 'module',
  }),
  tiktok_chart_worker: new Worker('./workers/tiktokWorker.worker.js', {
    type: 'module',
  }),
  worker: new Worker('./worker.worker.js', { type: 'module' }),
};

export const sharedBuffer = new SharedArrayBuffer(bufferSize);

const progressElements = {};

platforms.forEach((platform) => {
  progressElements[platform] = {
    bar: document.getElementById(`${platform}-chart-progress-bar`),
    text: document.getElementById(`${platform}-chart-progress-text`),
  };
});

export function createChartWorkerHandler(platformKey, chartKey) {
  return function (e) {
    if (e.data.length) {
      const progressValue = (e.data.length / 12) * 100;
      progressElements[platformKey].bar.value = progressValue;
      progressElements[platformKey].text.textContent =
        `${Math.round(progressValue)}%`;

      platformCharts[chartKey].data.datasets[0].data = e.data;
      platformCharts[chartKey].update();
    }
  };
}

workers.youtube_chart_worker.onmessage = createChartWorkerHandler(
  'youtube',
  'youtubeChart',
);
workers.spotify_chart_worker.onmessage = createChartWorkerHandler(
  'spotify',
  'spotifyChart',
);
workers.insta_chart_worker.onmessage = createChartWorkerHandler(
  'instagram',
  'instagramChart',
);
workers.facebook_chart_worker.onmessage = createChartWorkerHandler(
  'facebook',
  'facebookChart',
);
workers.twitter_chart_worker.onmessage = createChartWorkerHandler(
  'twitter',
  'twitterChart',
);
workers.pandora_chart_worker.onmessage = createChartWorkerHandler(
  'pandora',
  'pandoraChart',
);
workers.soundcloud_chart_worker.onmessage = createChartWorkerHandler(
  'soundcloud',
  'soundcloudChart',
);
workers.deezer_chart_worker.onmessage = createChartWorkerHandler(
  'deezer',
  'deezerChart',
);
workers.tiktok_chart_worker.onmessage = createChartWorkerHandler(
  'tiktok',
  'tiktokChart',
);

workers.artist_charts_worker.onmessage = function (e) {
  const processedPlatforms = e.data.platforms;

  processedPlatforms.forEach((platform) => {
    const ctx = document.getElementById(platform.id).getContext('2d');

    if (platformCharts[platform.id]) {
      platformCharts[platform.id].destroy();
    }

    platformCharts[platform.id] = new Chart(
      ctx,
      chartConfig(platform.label, platform.data, platform.color, platform.bg),
    );
  });
};

// Web Worker message handler
workers.worker.onmessage = function (e) {
  randomArray = e.data.randomArray;
  indices = e.data.indices;

  // Update graphs with results from Web Worker
  indexData.push(indices);
};
