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
function getInstagramData(sharedBuffer) {
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
      ) * (1 + (Math.random() - 0.5) / 6)
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

// Handler of messages from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getInstagramData(e.data.buffer)
  }
}