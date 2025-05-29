// import { spotifySourceData } from './config'

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
    offset: 0,
    weights: [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05],
    inverseIndices: [5],
    initialMetrics: {
      monthlyListeners: 100_000,
      totalStreams: 2_000_000,
      followers: 50_000,
    },
    constantMetrics: {
      playlistAdds: 10_000,
      saveRate: 60,
      skipRate: 20,
      virality: 1.2,
    },
    updateMetrics: {
      monthlyListeners: (val) => val + Math.floor(Math.random() * 5_000),
      totalStreams: (val) => val + Math.floor(Math.random() * 100_000),
      followers: (val) => val + Math.floor(Math.random() * 1_000),
    },
  });
}

export function getTikTokData(sharedBuffer) {
  const offset = 12 * 4 * 8; // TikTok — девятая платформа (индекс 8)

  generatePlatformData({
    sharedBuffer,
    offset,
    weights: [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05],
    inverseIndices: [5], // skipRate инвертирован

    initialMetrics: {
      activeUsers: 1_500_000_000,
      totalViews: 5_000_000_000,
      followers: 100_000_000,
    },

    constantMetrics: {
      engagementRate: 3.4, // %
      retentionRate: 50, // %
      skipRate: 20, // %
      virality: 1.2,
    },

    updateMetrics: {
      activeUsers: (prev) => prev + Math.floor(Math.random() * 10_000_000),
      totalViews: (prev) => prev + Math.floor(Math.random() * 100_000_000),
      followers: (prev) => prev + Math.floor(Math.random() * 1_000_000),
    },

    fluctuation: 5,

    onFinish: (result) => {
      // Можно логировать или отправлять результат
      console.log('TikTok data generation finished', result);
    },
  });
}

export function getTwitterData(sharedBuffer) {
  const offset = 12 * 4 * 4; // Twitter — пятая платформа (индекс 4)

  generatePlatformData({
    sharedBuffer,
    offset,
    weights: [0.3, 0.2, 0.15, 0.1, 0.1, 0.1, 0.05],
    inverseIndices: [],

    initialMetrics: {
      followers: 80_000,
      impressions: 40_000,
      engagementRate: 3.8,
    },

    constantMetrics: {
      likes: 7000,
      retweets: 3000,
      quoteTweets: 1200,
      virality: 1.3,
    },

    updateMetrics: {
      followers: (prev) => prev + Math.floor(Math.random() * 1800),
      impressions: (prev) => prev + Math.floor(Math.random() * 5000),
      engagementRate: (prev) => prev + (Math.random() - 0.5) * 0.25,
    },

    fluctuation: 5,

    onFinish: (result) => {
      console.log('Twitter data generation finished', result);
    },
  });
}

export function getDeezerData(sharedBuffer) {
  const offset = 12 * 4 * 7; // Deezer — восьмая платформа (index 7)

  generatePlatformData({
    sharedBuffer,
    offset,
    weights: [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05],
    inverseIndices: [5], // skipRate

    initialMetrics: {
      activeUsers: 18_000_000,
      totalStreams: 200_000_000,
      followers: 10_000_000,
    },

    constantMetrics: {
      playlistAdds: 500_000,
      saveRate: 60,
      skipRate: 20,
      virality: 1.1,
    },

    updateMetrics: {
      activeUsers: (prev) => prev + Math.floor(Math.random() * 1_000_000),
      totalStreams: (prev) => prev + Math.floor(Math.random() * 5_000_000),
      followers: (prev) => prev + Math.floor(Math.random() * 50_000),
    },

    fluctuation: 5,

    onFinish: (result) => {
      console.log('Deezer data generation finished', result);
    },
  });
}

export function getFacebookData(sharedBuffer) {
  const offset = 12 * 4 * 3; // Facebook — четвёртая платформа (index 3)

  generatePlatformData({
    sharedBuffer,
    offset,
    weights: [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05],
    inverseIndices: [], // Все метрики положительные

    initialMetrics: {
      followers: 120_000,
      engagementRate: 5.2,
      reach: 60_000,
    },

    constantMetrics: {
      likes: 10_000,
      shares: 3_000,
      comments: 1_500,
      virality: 1.0,
    },

    updateMetrics: {
      followers: (prev) => prev + Math.floor(Math.random() * 2_500),
      engagementRate: (prev) => prev + (Math.random() - 0.5) * 0.3,
      reach: (prev) => prev + Math.floor(Math.random() * 3_000),
    },

    fluctuation: 6, // как в оригинале

    onFinish: (result) => {
      console.log('Facebook data generation finished', result);
    },
  });
}

export function getInstagramData(sharedBuffer) {
  const offset = 12 * 4 * 2; // Instagram — третья платформа (index 2)

  generatePlatformData({
    sharedBuffer,
    offset,
    weights: [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05],
    inverseIndices: [], // все метрики положительные

    initialMetrics: {
      followers: 80_000,
      engagementRate: 6.5,
      reach: 50_000,
    },

    constantMetrics: {
      storyViews: 15_000,
      saves: 3_000,
      shares: 2_000,
      virality: 1.1,
    },

    updateMetrics: {
      followers: (prev) => prev + Math.floor(Math.random() * 2_000),
      engagementRate: (prev) => prev + (Math.random() - 0.5) * 0.3,
      reach: (prev) => prev + Math.floor(Math.random() * 2_000),
    },

    fluctuation: 6, // как в оригинале

    onFinish: (result) => {
      console.log('Instagram data generation finished', result);
    },
  });
}

export function getPandoraData(sharedBuffer) {
  const offset = 12 * 4 * 5; // шестая платформа (индекс 5)

  generatePlatformData({
    sharedBuffer,
    offset,
    weights: [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05],
    inverseIndices: [5], // skipRate негативно влияет

    initialMetrics: {
      activeUsers: 46_000_000,
      totalStreams: 100_000_000,
      followers: 5_000_000,
    },

    constantMetrics: {
      playlistAdds: 100_000,
      saveRate: 60,
      skipRate: 20,
      virality: 1.1,
    },

    updateMetrics: {
      activeUsers: (prev) => prev + Math.floor(Math.random() * 100_000),
      totalStreams: (prev) => prev + Math.floor(Math.random() * 5_000_000),
      followers: (prev) => prev + Math.floor(Math.random() * 50_000),
    },

    fluctuation: 5,

    onFinish: (result) => {
      console.log('Pandora data generation finished', result);
    },
  });
}

export function getSoundCloudData(sharedBuffer) {
  const offset = 12 * 4 * 6; // седьмая платформа (индекс 6)

  generatePlatformData({
    sharedBuffer,
    offset,
    weights: [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05],
    inverseIndices: [5], // skipRate негативно влияет

    initialMetrics: {
      activeUsers: 175_000_000,
      totalStreams: 200_000_000,
      followers: 10_000_000,
    },

    constantMetrics: {
      playlistAdds: 500_000,
      saveRate: 60,
      skipRate: 20,
      virality: 1.1,
    },

    updateMetrics: {
      activeUsers: (prev) => prev + Math.floor(Math.random() * 1_000_000),
      totalStreams: (prev) => prev + Math.floor(Math.random() * 5_000_000),
      followers: (prev) => prev + Math.floor(Math.random() * 50_000),
    },

    fluctuation: 5,

    onFinish: (result) => {
      console.log('SoundCloud data generation finished', result);
    },
  });
}

export function getYouTubeData(sharedBuffer) {
  generatePlatformData({
    sharedBuffer,
    offset: 1 * 12 * 4, // YouTube offset
    weights: [0.25, 0.2, 0.2, 0.1, 0.1, 0.1, 0.05],
    inverseIndices: [], // Нет инверсий для YouTube метрик
    initialMetrics: {
      subscribers: Math.floor(Math.random() * 100) + 1,
    },
    constantMetrics: {
      views: 50000000,
      engagement: 5,
      mentions: 10000,
      retention: 60,
      growth: 10,
      virality: 1,
    },
    updateMetrics: {
      subscribers: (val) => val + Math.floor(Math.random() * 10) + 1,
    },
    fluctuation: 5,
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
  fluctuation = 5, // колебания по умолчанию
  onFinish = () => {},
}) {
  const data = new Float32Array(sharedBuffer, offset, 12);
  let month = 0;
  const result = [];

  const interval = setInterval(() => {
    // Обновляем метрики
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
