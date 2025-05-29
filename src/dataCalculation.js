import {
  spotifySourceData,
  tiktokSourceData,
  twitterSourceData,
  deezerSourceData,
  facebookSourceData,
  instagrammSourceData,
  pandoraSourceData,
  soundcloudSourceData,
  youtubeSourceData
} from './initData';


export function getRandom(dataLength) {
  return Array.from({ length: dataLength }, () =>
    Math.floor(Math.random() * dataLength),
  );
}

// Function of random data generation (similar to the main program)
export function getRandomData(baseValue, variance) {
  const randomData = Array.from({ length: 12 }, () => {
    const randomVariation = Math.floor(Math.random() * variance) - variance / 2;
    return Math.max(0, baseValue + randomVariation);
  });

  return randomData;
}

export function getSpotifyData(sharedBuffer) {
  generatePlatformData({
    sharedBuffer,
    ...spotifySourceData
  });
}

export function getTikTokData(sharedBuffer) {
  generatePlatformData({
    sharedBuffer,
    ...tiktokSourceData
  });
}

export function getTwitterData(sharedBuffer) {

  generatePlatformData({
    sharedBuffer,
    ...twitterSourceData
  });
}

export function getDeezerData(sharedBuffer) {

  generatePlatformData({
    sharedBuffer,
    ...deezerSourceData
  });
}

export function getFacebookData(sharedBuffer) {

  generatePlatformData({
    sharedBuffer,
    ...facebookSourceData
  });
}

export function getInstagramData(sharedBuffer) {

  generatePlatformData({
    sharedBuffer,
    ...instagrammSourceData
  });
}

export function getPandoraData(sharedBuffer) {

  generatePlatformData({
    sharedBuffer,
    ...pandoraSourceData
  });
}

export function getSoundCloudData(sharedBuffer) {

  generatePlatformData({
    sharedBuffer,
    ...soundcloudSourceData
  });
}

export function getYouTubeData(sharedBuffer) {
  generatePlatformData({
    sharedBuffer,
    ...youtubeSourceData
  });
}

function calculatePopularity(metrics, weights, inverse = []) {
  return metrics.reduce((acc, val, idx) => {
    const effect = inverse.includes(idx) ? -1 : 1;
    return acc + effect * weights[idx] * val;
  }, 0);
}

function generatePlatformData({
  sharedBuffer,
  offset,
  weights,
  inverseIndices,
  initialMetrics,
  constantMetrics,
  updateMetrics,
  fluctuation = 5, // default oscillation
  onFinish = () => {},
}) {
  const data = new Float32Array(sharedBuffer, offset, 12);
  let month = 0;
  const result = [];

  const interval = setInterval(() => {
    // Updating metrics
    for (const key in updateMetrics) {
      initialMetrics[key] = updateMetrics[key](initialMetrics[key]);
    }

    const allMetrics = [
      ...Object.values(initialMetrics),
      ...Object.values(constantMetrics),
    ];

    data[month] = Math.floor(
      calculatePopularity(allMetrics, weights, inverseIndices) *
        (1 + (Math.random() - 0.5) / fluctuation),
    );

    result.push(data[month]);
    postMessage(result);

    month++;
    if (month >= 12) {
      clearInterval(interval);
      postMessage(result);
      onFinish(result);
    }
  }, 1000);
}
