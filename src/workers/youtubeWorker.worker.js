// Function for generating random data with fluctuations
function getRandomData(baseValue, variance) {
  return Array.from({ length: 12 }, () => {
    const randomVariation = Math.floor(Math.random() * variance) - variance / 2
    return Math.max(0, baseValue + randomVariation)
  })
}

// Formula for calculating YouTube popularity
function calculateYouTubePopularity(
  subscribers,
  views,
  engagement,
  mentions,
  retention,
  growth,
  virality
) {
  const w1 = 0.25 // weight for Subscribers
  const w2 = 0.2 // weight for Views
  const w3 = 0.2 // weight for Engagement
  const w4 = 0.1 // weight for Mentions
  const w5 = 0.1 // weight for Retention
  const w6 = 0.1 // weight for Growth
  const w7 = 0.05 // weight for Virality

  return (
    w1 * subscribers +
    w2 * views +
    w3 * engagement +
    w4 * mentions +
    w5 * retention +
    w6 * growth +
    w7 * virality
  )
}

// Generate data for YouTube based on 12 months popularity formula
function getYouTubeData(sharedBuffer) {
  const youtubeData = new Float32Array(sharedBuffer, 0, 12);
  let subscribers = Math.floor(Math.random() * 100) + 1
  let s = 0;
  let month = 0

  // Emulation of long calculations
  setTimeout(() => {
    while (s <= 1000000) {
      subscribers += Math.floor(Math.random() * 100) + 1
      s++
    }

    const views = 50000000
    const engagement = 5 // 5% engagement
    const mentions = 10000
    const retention = 60 // 60% retention
    const growth = 10 // 10% growth
    const virality = 1 // 1 viral video

    // Calculation of popularity for 12 months and writing to SharedArrayBuffer
    while (month < 12) {
      youtubeData[month] = Math.floor(
        calculateYouTubePopularity(
          subscribers,
          views,
          engagement,
          mentions,
          retention,
          growth,
          virality
        ) *
          (1 + (Math.random() - 0.5) / 5)
      )
      month++;
    }

    // Notify the main thread of completion
    postMessage(youtubeData)
  }, 1000)
}

// Handler of messages from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getYouTubeData(e.data.buffer)
  }
}
