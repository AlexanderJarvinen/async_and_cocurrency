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
function getTwitterData(sharedBuffer) {
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
      ) * (1 + (Math.random() - 0.5) / 5) // slight random fluctuation
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

// Message handler from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getTwitterData(e.data.buffer)
  }
}
