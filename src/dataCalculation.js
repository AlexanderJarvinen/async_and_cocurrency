
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

// Formula for calculating Deezer popularity
function calculateDeezerPopularity(
  activeUsers,
  totalStreams,
  followers,
  playlistAdds,
  saveRate,
  skipRate,
  virality
) {
  const w1 = 0.3 // Active users
  const w2 = 0.25 // Total number of streams
  const w3 = 0.15 // Followers
  const w4 = 0.1 // Playlist additions
  const w5 = 0.1 // Save rate
  const w6 = 0.05 // Skip rate (inverse effect)
  const w7 = 0.05 // Virality

  return (
    w1 * activeUsers +
    w2 * totalStreams +
    w3 * followers +
    w4 * playlistAdds +
    w5 * saveRate -
    w6 * skipRate + // Skip rate decreases rating
    w7 * virality
  )
}

// Generating data for Deezer over 12 months
export function getDeezerData(sharedBuffer) {
  const offset = 12 * 4 * 7 // Assume Deezer is the eighth platform
  const deezerData = new Float32Array(sharedBuffer, offset, 12)
  let month = 0
  const deezerDataProceed = []

  // Starting values
  let activeUsers = 18000000 // 18 million active users
  let totalStreams = 200000000 // 200 million streams
  let followers = 10000000 // 10 million followers

  const playlistAdds = 500000 // 500 thousand playlist additions
  const saveRate = 60 // 60%
  const skipRate = 20 // 20%
  const virality = 1.1

  const interval = setInterval(() => {
    // Increase in values
    activeUsers += Math.floor(Math.random() * 1000000)
    totalStreams += Math.floor(Math.random() * 5000000)
    followers += Math.floor(Math.random() * 50000)

    deezerData[month] = Math.floor(
      calculateDeezerPopularity(
        activeUsers,
        totalStreams,
        followers,
        playlistAdds,
        saveRate,
        skipRate,
        virality
      ) *
      (1 + (Math.random() - 0.5) / 5) // slight random fluctuation
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

// Formula for calculating Facebook popularity
function calculateFacebookPopularity(
  followers,
  engagementRate,
  reach,
  likes,
  shares,
  comments,
  virality
) {
  const w1 = 0.3 // Followers
  const w2 = 0.25 // Engagement Rate
  const w3 = 0.15 // Reach
  const w4 = 0.1 // Likes
  const w5 = 0.1 // Shares
  const w6 = 0.05 // Comments
  const w7 = 0.05 // Virality

  return (
    w1 * followers +
    w2 * engagementRate +
    w3 * reach +
    w4 * likes +
    w5 * shares +
    w6 * comments +
    w7 * virality
  )
}

// Generate data for Facebook for 12 months
export function getFacebookData(sharedBuffer) {
  const facebookData = new Float32Array(sharedBuffer, 12 * 3 * 4, 12) // offset after YouTube + Spotify + Instagram (3 arrays * 12 float * 4 bytes)
  let month = 0
  let facebookDataProceed = []

  // Start values
  let followers = 120000
  let engagementRate = 5.2 // %
  let reach = 60000
  const likes = 10000
  const shares = 3000
  const comments = 1500
  const virality = 1.0

  const interval = setInterval(() => {
    // Growth Simulation
    followers += Math.floor(Math.random() * 2500)
    engagementRate += (Math.random() - 0.5) * 0.3
    reach += Math.floor(Math.random() * 3000)

    facebookData[month] = Math.floor(
      calculateFacebookPopularity(
        followers,
        engagementRate,
        reach,
        likes,
        shares,
        comments,
        virality
      ) *
      (1 + (Math.random() - 0.5) / 6)
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

// Formula for calculating Instagram popularity
function calculateInstagramPopularity(
  followers,
  engagementRate,
  reach,
  storyViews,
  saves,
  shares,
  virality
) {
  const w1 = 0.3 // Followers
  const w2 = 0.25 // Engagement Rate
  const w3 = 0.15 // Reach
  const w4 = 0.1 // Story Views
  const w5 = 0.1 // Saves
  const w6 = 0.05 // Shares
  const w7 = 0.05 // Virality

  return (
    w1 * followers +
    w2 * engagementRate +
    w3 * reach +
    w4 * storyViews +
    w5 * saves +
    w6 * shares +
    w7 * virality
  )
}

// Generate data for Instagram for 12 months
export function getInstagramData(sharedBuffer) {
  const instagramData = new Float32Array(sharedBuffer, 12 * 2, 12) // for example, start with offset (24 bytes per float * 12 * 2)
  let month = 0
  let instagramDataProceed = []

  // Start values
  let followers = 80000
  let engagementRate = 6.5 // %
  let reach = 50000
  const storyViews = 15000
  const saves = 3000
  const shares = 2000
  const virality = 1.1

  const interval = setInterval(() => {
    // Simulate growth
    followers += Math.floor(Math.random() * 2000)
    engagementRate += (Math.random() - 0.5) * 0.3
    reach += Math.floor(Math.random() * 2000)

    instagramData[month] = Math.floor(
      calculateInstagramPopularity(
        followers,
        engagementRate,
        reach,
        storyViews,
        saves,
        shares,
        virality
      ) *
      (1 + (Math.random() - 0.5) / 6)
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

// Formula for calculating Pandora popularity
function calculatePandoraPopularity(
  activeUsers,
  totalStreams,
  followers,
  playlistAdds,
  saveRate,
  skipRate,
  virality
) {
  const w1 = 0.3 // Active users
  const w2 = 0.25 // Total number of streams
  const w3 = 0.15 // Followers
  const w4 = 0.1 // Playlist additions
  const w5 = 0.1 // Save rate
  const w6 = 0.05 // Skip rate (inverse effect)
  const w7 = 0.05 // Virality

  return (
    w1 * activeUsers +
    w2 * totalStreams +
    w3 * followers +
    w4 * playlistAdds +
    w5 * saveRate -
    w6 * skipRate + // Skip rate decreases rating
    w7 * virality
  )
}

// Generating data for Pandora over 12 months
export function getPandoraData(sharedBuffer) {
  const offset = 12 * 4 * 5 // Assume Pandora is the sixth platform
  const pandoraData = new Float32Array(sharedBuffer, offset, 12)
  let month = 0
  const pandoraDataProceed = []

  // Starting values
  let activeUsers = 46000000 // 46 million active users
  let totalStreams = 100000000 // 100 million streams
  let followers = 5000000 // 5 million followers

  const playlistAdds = 100000 // 100 thousand playlist additions
  const saveRate = 60 // 60%
  const skipRate = 20 // 20%
  const virality = 1.1

  const interval = setInterval(() => {
    // Simulate growth
    activeUsers += Math.floor(Math.random() * 100000)
    totalStreams += Math.floor(Math.random() * 5000000)
    followers += Math.floor(Math.random() * 50000)

    pandoraData[month] = Math.floor(
      calculatePandoraPopularity(
        activeUsers,
        totalStreams,
        followers,
        playlistAdds,
        saveRate,
        skipRate,
        virality
      ) *
      (1 + (Math.random() - 0.5) / 5) // slight random fluctuation
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

// Formula for calculating SoundCloud popularity
function calculateSoundCloudPopularity(
  activeUsers,
  totalStreams,
  followers,
  playlistAdds,
  saveRate,
  skipRate,
  virality
) {
  const w1 = 0.3 // Active users
  const w2 = 0.25 // Total number of streams
  const w3 = 0.15 // Followers
  const w4 = 0.1 // Playlist additions
  const w5 = 0.1 // Save rate
  const w6 = 0.05 // Skip rate (inverse effect)
  const w7 = 0.05 // Virality

  return (
    w1 * activeUsers +
    w2 * totalStreams +
    w3 * followers +
    w4 * playlistAdds +
    w5 * saveRate -
    w6 * skipRate + // Skip rate decreases the rating
    w7 * virality
  )
}

// Generating data for SoundCloud over 12 months
export function getSoundCloudData(sharedBuffer) {
  const offset = 12 * 4 * 6 // Assume SoundCloud is the seventh platform
  const soundCloudData = new Float32Array(sharedBuffer, offset, 12)
  let month = 0
  const soundCloudDataProceed = []

  // Starting values
  let activeUsers = 175000000 // 175 million active users
  let totalStreams = 200000000 // 200 million streams
  let followers = 10000000 // 10 million followers

  const playlistAdds = 500000 // 500 thousand playlist additions
  const saveRate = 60 // 60%
  const skipRate = 20 // 20%
  const virality = 1.1

  const interval = setInterval(() => {
    // Simulate growth
    activeUsers += Math.floor(Math.random() * 1000000)
    totalStreams += Math.floor(Math.random() * 5000000)
    followers += Math.floor(Math.random() * 50000)

    soundCloudData[month] = Math.floor(
      calculateSoundCloudPopularity(
        activeUsers,
        totalStreams,
        followers,
        playlistAdds,
        saveRate,
        skipRate,
        virality
      ) *
      (1 + (Math.random() - 0.5) / 5) // slight random fluctuation
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

// Formula for calculating Spotify popularity
export function calculateSpotifyPopularity(
  monthlyListeners,
  totalStreams,
  followers,
  playlistAdds,
  saveRate,
  skipRate,
  virality
) {
  const w1 = 0.3 // Monthly listeners
  const w2 = 0.25 // Total streams
  const w3 = 0.15 // Followers
  const w4 = 0.1 // Playlist adds
  const w5 = 0.1 // Save rate
  const w6 = 0.05 // Skip rate (inverse effect)
  const w7 = 0.05 // Virality

  return (
    w1 * monthlyListeners +
    w2 * totalStreams +
    w3 * followers +
    w4 * playlistAdds +
    w5 * saveRate -
    w6 * skipRate + // Skip rate decreases the rating
    w7 * virality
  )
}

// Generating data for Spotify over 12 months
export function getSpotifyData(sharedBuffer) {
  const spotifyData = new Float32Array(sharedBuffer, 0, 12)
  let month = 0
  let spotifyDataProceed = []

  // Starting values
  let monthlyListeners = 100000
  let totalStreams = 2000000
  let followers = 50000

  const playlistAdds = 10000
  const saveRate = 60 // %
  const skipRate = 20 // %
  const virality = 1.2

  const interval = setInterval(() => {
    // Simulate growth
    monthlyListeners += Math.floor(Math.random() * 5000)
    totalStreams += Math.floor(Math.random() * 100000)
    followers += Math.floor(Math.random() * 1000)

    spotifyData[month] = Math.floor(
      calculateSpotifyPopularity(
        monthlyListeners,
        totalStreams,
        followers,
        playlistAdds,
        saveRate,
        skipRate,
        virality
      ) *
      (1 + (Math.random() - 0.5) / 5) // slight random fluctuation
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

// Formula for calculating TikTok popularity
function calculateTikTokPopularity(
  activeUsers,
  totalViews,
  followers,
  engagementRate,
  retentionRate,
  skipRate,
  virality
) {
  const w1 = 0.3 // Active users
  const w2 = 0.25 // Total views
  const w3 = 0.15 // Followers
  const w4 = 0.1 // Engagement rate
  const w5 = 0.1 // Retention rate
  const w6 = 0.05 // Skip rate (inverse effect)
  const w7 = 0.05 // Virality

  return (
    w1 * activeUsers +
    w2 * totalViews +
    w3 * followers +
    w4 * engagementRate +
    w5 * retentionRate -
    w6 * skipRate + // Skip rate decreases the rating
    w7 * virality
  )
}

// Generate TikTok data for 12 months
export function getTikTokData(sharedBuffer) {
  const offset = 12 * 4 * 8 // Assuming TikTok is the ninth platform
  const tiktokData = new Float32Array(sharedBuffer, offset, 12)
  let month = 0
  const tiktokDataProceed = []

  // Initial values
  let activeUsers = 1500000000 // 1.5 billion active users
  let totalViews = 5000000000 // 5 billion views
  let followers = 100000000 // 100 million followers

  const engagementRate = 3.4 // Average engagement rate in %
  const retentionRate = 50 // Retention rate in %
  const skipRate = 20 // Skip rate in %
  const virality = 1.2

  const interval = setInterval(() => {
    // Simulate growth
    activeUsers += Math.floor(Math.random() * 10000000)
    totalViews += Math.floor(Math.random() * 100000000)
    followers += Math.floor(Math.random() * 1000000)

    tiktokData[month] = Math.floor(
      calculateTikTokPopularity(
        activeUsers,
        totalViews,
        followers,
        engagementRate,
        retentionRate,
        skipRate,
        virality
      ) *
      (1 + (Math.random() - 0.5) / 5) // slight random fluctuation
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

// Formula for calculating Twitter popularity
function calculateTwitterPopularity(
  followers,
  likes,
  retweets,
  quoteTweets,
  impressions,
  engagementRate,
  virality
) {
  const w1 = 0.3 // Followers
  const w2 = 0.2 // Likes
  const w3 = 0.15 // Retweets
  const w4 = 0.1 // Quote tweets
  const w5 = 0.1 // Impressions
  const w6 = 0.1 // Engagement rate
  const w7 = 0.05 // Virality

  return (
    w1 * followers +
    w2 * likes +
    w3 * retweets +
    w4 * quoteTweets +
    w5 * impressions +
    w6 * engagementRate +
    w7 * virality
  )
}

// Generate Twitter data for 12 months
export function getTwitterData(sharedBuffer) {
  const twitterData = new Float32Array(sharedBuffer, 12 * 4 * 4, 12) // offset after 4 platforms * 12 values * 4 bytes (float32)
  let month = 0
  let twitterDataProceed = []

  // Initial values
  let followers = 80000
  const likes = 7000
  const retweets = 3000
  const quoteTweets = 1200
  let impressions = 40000
  let engagementRate = 3.8 // %
  const virality = 1.3

  const interval = setInterval(() => {
    // Value growth
    followers += Math.floor(Math.random() * 1800)
    impressions += Math.floor(Math.random() * 5000)
    engagementRate += (Math.random() - 0.5) * 0.25

    twitterData[month] = Math.floor(
      calculateTwitterPopularity(
        followers,
        likes,
        retweets,
        quoteTweets,
        impressions,
        engagementRate,
        virality
      ) *
      (1 + (Math.random() - 0.5) / 5) // slight random fluctuation
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