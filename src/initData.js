export const dataLength = 100; // Length of the data array
export const largeData = Array.from({ length: dataLength }, (_, i) => i);
export const batchSize = Math.floor(dataLength / 100); // Bulk
export let indexData = [];
export const platformCharts = {};
export let data = [];
const tiktokOffset = 12 * 4 * 8; // TikTok — девятая платформа (индекс 8)
const twitterOffset = 12 * 4 * 4; // Twitter — пятая платформа (индекс 4)
const deezerOffset = 12 * 4 * 7; // Deezer — восьмая платформа (index 7)
const facebookOffset = 12 * 4 * 3; // Facebook — четвёртая платформа (index 3)
const instagrammOffset = 12 * 4 * 2; // Instagram — третья платформа (index 2)
const pandoraOffset = 12 * 4 * 5; // шестая платформа (индекс 5)
const soundcloudOffset = 12 * 4 * 6; // седьмая платформа (индекс 6)
const totalPlatforms = 9;
const monthsPerPlatform = 12;
const bytesPerElement = 4; // Float32
const bufferSize = totalPlatforms * monthsPerPlatform * bytesPerElement; // 9 * 12 * 4 = 432 байта
export const sharedBuffer = new SharedArrayBuffer(bufferSize);
// Rendering of  charts
export const platforms = [
  {
    id: 'spotifyChart',
    label: 'Spotify',
    maxData: 50000,
    color: 'rgba(30, 215, 96, 1)',
    bg: 'rgba(30, 215, 96, 0.2)',
  },
  {
    id: 'youtubeChart',
    label: 'YouTube',
    maxData: 100000,
    color: 'rgba(255, 0, 0, 1)',
    bg: 'rgba(255, 0, 0, 0.2)',
  },
  {
    id: 'instagramChart',
    label: 'Instagram',
    maxData: 30000,
    color: 'rgba(193, 53, 132, 1)',
    bg: 'rgba(193, 53, 132, 0.2)',
  },
  {
    id: 'facebookChart',
    label: 'Facebook',
    maxData: 25000,
    color: 'rgba(59, 89, 152, 1)',
    bg: 'rgba(59, 89, 152, 0.2)',
  },
  {
    id: 'twitterChart',
    label: 'Twitter',
    maxData: 20000,
    color: 'rgba(29, 161, 242, 1)',
    bg: 'rgba(29, 161, 242, 0.2)',
  },
  {
    id: 'pandoraChart',
    label: 'Pandora',
    maxData: 15000,
    color: 'rgba(0, 123, 255, 1)',
    bg: 'rgba(0, 123, 255, 0.2)',
  },
  {
    id: 'soundcloudChart',
    label: 'SoundCloud',
    maxData: 10000,
    color: 'rgba(255, 85, 0, 1)',
    bg: 'rgba(255, 85, 0, 0.2)',
  },
  {
    id: 'deezerChart',
    label: 'Deezer',
    maxData: 5000,
    color: 'rgba(0, 176, 255, 1)',
    bg: 'rgba(0, 176, 255, 0.2)',
  },
  {
    id: 'tiktokChart',
    label: 'TikTok',
    maxData: 30000,
    color: 'rgba(255, 255, 0, 1)',
    bg: 'rgba(255, 255, 0, 0.2)',
  },
];

// Data emulation for 12 months
export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const spotifySourceData = {
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
}

export const tiktokSourceData = {
  tiktokOffset,
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
}

export const twitterSourceData = {
    twitterOffset,
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
}

export const deezerSourceData = {
    deezerOffset,
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
}

export const facebookSourceData = {
    facebookOffset,
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
}

export const instagrammSourceData = {
    instagrammOffset,
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
}

export const pandoraSourceData = {
    pandoraOffset,
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
}

export const soundcloudSourceData = {
    soundcloudOffset ,
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
}

export const youtubeSourceData = {
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
}



