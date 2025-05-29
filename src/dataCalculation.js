export function getRandom(dataLength) {
  return Array.from({ length: dataLength }, () =>
    Math.floor(Math.random() * dataLength));
}

// Function of random data generation (similar to the main program)
export function getRandomData(baseValue, variance) {
  const randomData = Array.from({ length: 12 }, () => {
    const randomVariation = Math.floor(Math.random() * variance) - variance / 2
    return Math.max(0, baseValue + randomVariation)
  })

  return randomData
}

export function getSpotifyData(sharedBuffer) {
  const spotifyData = new Float32Array(sharedBuffer, 0, 12) // Spotify — the first platform, offset 0
  let month = 0
  const spotifyDataProceed = []

  // Initial values
  let monthlyListeners = 100_000
  let totalStreams = 2_000_000
  let followers = 50_000

  const playlistAdds = 10_000
  const saveRate = 60 // %
  const skipRate = 20 // %
  const virality = 1.2

  const spotifyWeights = [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05]
  const spotifyInverseIndices = [5]

  const interval = setInterval(() => {
    // Simulating growth
    monthlyListeners += Math.floor(Math.random() * 5_000)
    totalStreams += Math.floor(Math.random() * 100_000)
    followers += Math.floor(Math.random() * 1_000)

    const metrics = [
      monthlyListeners,
      totalStreams,
      followers,
      playlistAdds,
      saveRate,
      skipRate,
      virality
    ]

    spotifyData[month] = Math.floor(
      calculatePopularity(metrics, spotifyWeights, spotifyInverseIndices) *
      (1 + (Math.random() - 0.5) / 5)
    )

    spotifyDataProceed.push(spotifyData[month])
    postMessage(spotifyDataProceed)

    month++
    if (month >= 12) {
      clearInterval(interval)
      postMessage(spotifyDataProceed)
    }
  }, 1000)
}

export function getTikTokData(sharedBuffer) {
  const offset = 12 * 4 * 8 // TikTok — ninth platform (index 8)
  const tiktokData = new Float32Array(sharedBuffer, offset, 12)
  let month = 0
  const tiktokDataProceed = []

  // Initial values
  let activeUsers = 1_500_000_000 // 1.5 billion active users
  let totalViews = 5_000_000_000 // 5 billion views
  let followers = 100_000_000 // 100 million followers

  const engagementRate = 3.4 // %
  const retentionRate = 50 // %
  const skipRate = 20 // %
  const virality = 1.2

  const tikTokWeights = [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05]
  const tikTokInverseIndices = [5]

  const interval = setInterval(() => {
    // Simulating growth
    activeUsers += Math.floor(Math.random() * 10_000_000)
    totalViews += Math.floor(Math.random() * 100_000_000)
    followers += Math.floor(Math.random() * 1_000_000)

    const metrics = [
      activeUsers,
      totalViews,
      followers,
      engagementRate,
      retentionRate,
      skipRate,
      virality
    ]

    tiktokData[month] = Math.floor(
      calculatePopularity(metrics, tikTokWeights, tikTokInverseIndices) *
      (1 + (Math.random() - 0.5) / 5)
    )

    tiktokDataProceed.push(tiktokData[month])
    postMessage(tiktokDataProceed)

    month++
    if (month >= 12) {
      clearInterval(interval)
      postMessage(tiktokDataProceed)
    }
  }, 1000)
}

export function getTwitterData(sharedBuffer) {
  const offset = 12 * 4 * 4 // Twitter — fifth platform (0-based index: 4)
  const twitterData = new Float32Array(sharedBuffer, offset, 12)
  let month = 0
  const twitterDataProceed = []

  // Initial values
  let followers = 80_000
  const likes = 7_000
  const retweets = 3_000
  const quoteTweets = 1_200
  let impressions = 40_000
  let engagementRate = 3.8 // %
  const virality = 1.3

  const twitterWeights = [0.3, 0.2, 0.15, 0.1, 0.1, 0.1, 0.05]
  const twitterInverseIndices = []

  const interval = setInterval(() => {
    // Value growth
    followers += Math.floor(Math.random() * 1_800)
    impressions += Math.floor(Math.random() * 5_000)
    engagementRate += (Math.random() - 0.5) * 0.25

    const metrics = [
      followers,
      likes,
      retweets,
      quoteTweets,
      impressions,
      engagementRate,
      virality
    ]

    twitterData[month] = Math.floor(
      calculatePopularity(metrics, twitterWeights, twitterInverseIndices) *
      (1 + (Math.random() - 0.5) / 5)
    )

    twitterDataProceed.push(twitterData[month])
    postMessage(twitterDataProceed)

    month++
    if (month >= 12) {
      clearInterval(interval)
      postMessage(twitterDataProceed)
    }
  }, 1000)
}

export function getDeezerData(sharedBuffer) {
  const offset = 12 * 4 * 7 // Deezer — eighth platform
  const deezerData = new Float32Array(sharedBuffer, offset, 12)
  let month = 0
  const deezerDataProceed = []

  // Initial values
  let activeUsers = 18_000_000
  let totalStreams = 200_000_000
  let followers = 10_000_000

  const playlistAdds = 500_000
  const saveRate = 60 // %
  const skipRate = 20 // %
  const virality = 1.1

  const deezerWeights = [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05]
  const deezerInverseIndices = [5] // skipRate

  const interval = setInterval(() => {
    // Growth
    activeUsers += Math.floor(Math.random() * 1_000_000)
    totalStreams += Math.floor(Math.random() * 5_000_000)
    followers += Math.floor(Math.random() * 50_000)

    const metrics = [
      activeUsers,
      totalStreams,
      followers,
      playlistAdds,
      saveRate,
      skipRate,
      virality
    ]

    deezerData[month] = Math.floor(
      calculatePopularity(metrics, deezerWeights, deezerInverseIndices) *
      (1 + (Math.random() - 0.5) / 5)
    )

    deezerDataProceed.push(deezerData[month])
    postMessage(deezerDataProceed)

    month++
    if (month >= 12) {
      clearInterval(interval)
      postMessage(deezerDataProceed)
    }
  }, 1000)
}

export function getFacebookData(sharedBuffer) {
  const offset = 12 * 4 * 3 // offset after YouTube, Spotify, Instagram (3 platforms)
  const facebookData = new Float32Array(sharedBuffer, offset, 12)
  let month = 0
  const facebookDataProceed = []

  // Initial values
  let followers = 120000
  let engagementRate = 5.2 // %
  let reach = 60000
  const likes = 10000
  const shares = 3000
  const comments = 1500
  const virality = 1.0

  const facebookWeights = [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05]
  const inverseIndices = [] // All metrics are positive

  const interval = setInterval(() => {
    // Growth simulation
    followers += Math.floor(Math.random() * 2500)
    engagementRate += (Math.random() - 0.5) * 0.3
    reach += Math.floor(Math.random() * 3000)

    const metrics = [
      followers,
      engagementRate,
      reach,
      likes,
      shares,
      comments,
      virality
    ]

    facebookData[month] = Math.floor(
      calculatePopularity(metrics, facebookWeights, inverseIndices) *
      (1 + (Math.random() - 0.5) / 6) // fluctuation
    )

    facebookDataProceed.push(facebookData[month])
    postMessage(facebookDataProceed)

    month++
    if (month >= 12) {
      clearInterval(interval)
      postMessage(facebookDataProceed)
    }
  }, 1000)
}


export function getInstagramData(sharedBuffer) {
  const offset = 12 * 4 * 2 // third slot (if starting from 0)
  const instagramData = new Float32Array(sharedBuffer, offset, 12)
  let month = 0
  const instagramDataProceed = []

  // Initial values
  let followers = 80000
  let engagementRate = 6.5 // %
  let reach = 50000
  const storyViews = 15000
  const saves = 3000
  const shares = 2000
  const virality = 1.1

  // Weight coefficients for Instagram
  const instagramWeights = [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05]
  const inverseIndices = [] // All metrics have a positive effect

  const interval = setInterval(() => {
    // Growth simulation
    followers += Math.floor(Math.random() * 2000)
    engagementRate += (Math.random() - 0.5) * 0.3
    reach += Math.floor(Math.random() * 2000)

    const metrics = [
      followers,
      engagementRate,
      reach,
      storyViews,
      saves,
      shares,
      virality
    ]

    instagramData[month] = Math.floor(
      calculatePopularity(metrics, instagramWeights, inverseIndices) *
      (1 + (Math.random() - 0.5) / 6) // slight fluctuation
    )

    instagramDataProceed.push(instagramData[month])
    postMessage(instagramDataProceed)

    month++
    if (month >= 12) {
      clearInterval(interval)
      postMessage(instagramDataProceed)
    }
  }, 1000)
}

export function getPandoraData(sharedBuffer) {
  const offset = 12 * 4 * 5 // sixth platform
  const pandoraData = new Float32Array(sharedBuffer, offset, 12)
  let month = 0
  const pandoraDataProceed = []

  // Initial values
  let activeUsers = 46000000
  let totalStreams = 100000000
  let followers = 5000000
  const playlistAdds = 100000
  const saveRate = 60
  const skipRate = 20
  const virality = 1.1

  // Weight coefficients
  const weights = [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05]
  const inverse = [5] // skipRate has a negative effect

  const interval = setInterval(() => {
    // Growth emulation
    activeUsers += Math.floor(Math.random() * 100000)
    totalStreams += Math.floor(Math.random() * 5000000)
    followers += Math.floor(Math.random() * 50000)

    const metrics = [
      activeUsers,
      totalStreams,
      followers,
      playlistAdds,
      saveRate,
      skipRate,
      virality
    ]

    pandoraData[month] = Math.floor(
      calculatePopularity(metrics, weights, inverse) *
      (1 + (Math.random() - 0.5) / 5) // slight fluctuation
    )

    pandoraDataProceed.push(pandoraData[month])
    postMessage(pandoraDataProceed)

    month++
    if (month >= 12) {
      clearInterval(interval)
      postMessage(pandoraDataProceed)
    }
  }, 1000)
}

export function getSoundCloudData(sharedBuffer) {
  const offset = 12 * 4 * 6 // SoundCloud as the seventh platform
  const soundCloudData = new Float32Array(sharedBuffer, offset, 12)
  let month = 0
  const soundCloudDataProceed = []

  // Initial values
  let activeUsers = 175_000_000
  let totalStreams = 200_000_000
  let followers = 10_000_000

  const playlistAdds = 500_000
  const saveRate = 60 // %
  const skipRate = 20 // %
  const virality = 1.1

  const soundCloudWeights = [0.3, 0.25, 0.15, 0.1, 0.1, 0.05, 0.05]
  const soundCloudInverseIndices = [5]

  const interval = setInterval(() => {
    // Growth simulation
    activeUsers += Math.floor(Math.random() * 1_000_000)
    totalStreams += Math.floor(Math.random() * 5_000_000)
    followers += Math.floor(Math.random() * 50_000)

    const metrics = [
      activeUsers,
      totalStreams,
      followers,
      playlistAdds,
      saveRate,
      skipRate,
      virality
    ]

    soundCloudData[month] = Math.floor(
      calculatePopularity(metrics, soundCloudWeights, soundCloudInverseIndices) *
      (1 + (Math.random() - 0.5) / 5) // fluctuation
    )

    soundCloudDataProceed.push(soundCloudData[month])
    postMessage(soundCloudDataProceed)

    month++
    if (month >= 12) {
      clearInterval(interval)
      postMessage(soundCloudDataProceed)
    }
  }, 1000)
}

export function calculatePopularity(metrics, weights, inverse = []) {
  return metrics.reduce((acc, val, idx) => {
    const effect = inverse.includes(idx) ? -1 : 1
    return acc + effect * weights[idx] * val
  }, 0)
}


