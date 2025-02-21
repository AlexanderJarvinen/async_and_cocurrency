// Handler of messages from the main thread
onmessage = function (e) {
  const platforms = e.data.platforms
  const sharedBuffer = e.data.buffer
  const popularityData = new Float32Array(sharedBuffer)

  const processedPlatforms = platforms.map((platform) => {
    const data = platform.customData
      ? platform.customData()
      : getRandomData(platform.maxData, 5000)
    return { ...platform, data }
  })

  // Use data from SharedArrayBuffer for processing
  processedPlatforms.forEach((platform, index) => {
    if (index === 0) {
      platform.data = Array.from(popularityData)
    }
  })

  // Send the result back to the main thread
  postMessage({ platforms: processedPlatforms })
}

// Function of random data generation (similar to the main program)
function getRandomData(baseValue, variance) {
  const randomData = Array.from({ length: 12 }, () => {
    const randomVariation = Math.floor(Math.random() * variance) - variance / 2
    return Math.max(0, baseValue + randomVariation)
  })

  return randomData
}
