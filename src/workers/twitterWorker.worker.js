// Формула для расчета популярности Twitter
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

// Генерация данных для Twitter на 12 месяцев
function getTwitterData(sharedBuffer) {
  const twitterData = new Float32Array(sharedBuffer, 12 * 4 * 4, 12) // оффсет после 4 платформ * 12 значений * 4 байта (float32)
  let month = 0
  let twitterDataProceed = []

  // Стартовые значения
  let followers = 80000
  const likes = 7000
  const retweets = 3000
  const quoteTweets = 1200
  let impressions = 40000
  let engagementRate = 3.8 // %
  const virality = 1.3

  const interval = setInterval(() => {
    // Рост значений
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
      ) * (1 + (Math.random() - 0.5) / 5) // небольшое случайное колебание
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

// Обработчик сообщений из основного потока
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getTwitterData(e.data.buffer)
  }
}
