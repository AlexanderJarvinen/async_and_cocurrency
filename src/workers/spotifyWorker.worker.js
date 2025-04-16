// Формула для расчета популярности Spotify
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
  const w6 = 0.05 // Skip rate (обратный эффект)
  const w7 = 0.05 // Virality

  return (
    w1 * monthlyListeners +
    w2 * totalStreams +
    w3 * followers +
    w4 * playlistAdds +
    w5 * saveRate -
    w6 * skipRate + // Skip rate уменьшает рейтинг
    w7 * virality
  )
}

// Генерация данных для Spotify на 12 месяцев
function getSpotifyData(sharedBuffer) {
  const spotifyData = new Float32Array(sharedBuffer, 0, 12)
  let month = 0
  let spotifyDataProceed = []

  // Стартовые значения
  let monthlyListeners = 100000
  let totalStreams = 2000000
  let followers = 50000

  const playlistAdds = 10000
  const saveRate = 60 // %
  const skipRate = 20 // %
  const virality = 1.2

  const interval = setInterval(() => {
    // Рост значений
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
      ) * (1 + (Math.random() - 0.5) / 5) // небольшое случайное колебание
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

// Обработчик сообщений из основного потока
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    console.log('getSpotifyData', e.data.buffer);
    getSpotifyData(e.data.buffer)
  }
}
