import { getRandomData } from '../dataCalculation';

// Formula for calculating YouTube popularity
function calculateYouTubePopularity(
  subscribers,
  views,
  engagement,
  mentions,
  retention,
  growth,
  virality,
) {
  const w1 = 0.25; // weight for Subscribers
  const w2 = 0.2; // weight for Views
  const w3 = 0.2; // weight for Engagement
  const w4 = 0.1; // weight for Mentions
  const w5 = 0.1; // weight for Retention
  const w6 = 0.1; // weight for Growth
  const w7 = 0.05; // weight for Virality

  return (
    w1 * subscribers +
    w2 * views +
    w3 * engagement +
    w4 * mentions +
    w5 * retention +
    w6 * growth +
    w7 * virality
  );
}

// Generate data for YouTube based on 12 months popularity formula
function getYouTubeData(sharedBuffer) {
  const offset = 1 * 12 * 4; // Offset for YouTube
  const youtubeData = new Float32Array(sharedBuffer, offset, 12);
  let subscribers = Math.floor(Math.random() * 100) + 1;
  let youtubeDataProceed = [];

  const views = 50000000;
  const engagement = 5;
  const mentions = 10000;
  const retention = 60;
  const growth = 10;
  const virality = 1;

  let month = 0;

  const interval = setInterval(() => {
    for (let i = 0; i < 50000; i++) {
      subscribers += Math.floor(Math.random() * 10) + 1;
    }

    youtubeData[month] = Math.floor(
      calculateYouTubePopularity(
        subscribers,
        views,
        engagement,
        mentions,
        retention,
        growth,
        virality,
      ) *
        (1 + (Math.random() - 0.5) / 5),
    );

    youtubeDataProceed.push(youtubeData[month]);

    // Send only one month
    postMessage(youtubeDataProceed);

    month++;

    if (month >= 12) {
      clearInterval(interval);
      postMessage(youtubeDataProceed);
    }
  }, 1000); // Every second, a new month is added
}

// Handler of messages from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    console.log('getYouTubeData', e.data.buffer);
    getYouTubeData(e.data.buffer);
  }
};
