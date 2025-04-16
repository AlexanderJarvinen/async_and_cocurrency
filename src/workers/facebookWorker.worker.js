// Формула для расчета популярности Facebook
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

// Генерация данных для Facebook на 12 месяцев
function getFacebookData(sharedBuffer) {
  const facebookData = new Float32Array(sharedBuffer, 12 * 3 * 4, 12) // оффсет после YouTube + Spotify + Instagram (3 массива * 12 float * 4 байта)
  let month = 0
  let facebookDataProceed = []

  // Стартовые значения
  let followers = 120000
  let engagementRate = 5.2 // %
  let reach = 60000
  const likes = 10000
  const shares = 3000
  const comments = 1500
  const virality = 1.0

  const interval = setInterval(() => {
    // Имитация роста
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
      ) * (1 + (Math.random() - 0.5) / 6)
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

// Обработчик сообщений из основного потока
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getFacebookData(e.data.buffer)
  }
}
