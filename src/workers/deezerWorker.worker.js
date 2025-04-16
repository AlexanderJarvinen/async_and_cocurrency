// Формула для расчета популярности Deezer
function calculateDeezerPopularity(
  activeUsers,
  totalStreams,
  followers,
  playlistAdds,
  saveRate,
  skipRate,
  virality
) {
  const w1 = 0.3; // Активные пользователи
  const w2 = 0.25; // Общее количество прослушиваний
  const w3 = 0.15; // Подписчики
  const w4 = 0.1; // Добавления в плейлисты
  const w5 = 0.1; // Коэффициент сохранения
  const w6 = 0.05; // Коэффициент пропусков (обратный эффект)
  const w7 = 0.05; // Вирусность

  return (
    w1 * activeUsers +
    w2 * totalStreams +
    w3 * followers +
    w4 * playlistAdds +
    w5 * saveRate -
    w6 * skipRate + // Коэффициент пропусков уменьшает рейтинг
    w7 * virality
  );
}

// Генерация данных для Deezer на 12 месяцев
function getDeezerData(sharedBuffer) {
  const offset = 12 * 4 * 7; // Предполагаем, что Deezer — восьмая платформа
  const deezerData = new Float32Array(sharedBuffer, offset, 12);
  let month = 0;
  const deezerDataProceed = [];

  // Стартовые значения
  let activeUsers = 18000000; // 18 млн активных пользователей
  let totalStreams = 200000000; // 200 млн прослушиваний
  let followers = 10000000; // 10 млн подписчиков

  const playlistAdds = 500000; // 500 тыс. добавлений в плейлисты
  const saveRate = 60; // 60%
  const skipRate = 20; // 20%
  const virality = 1.1;

  const interval = setInterval(() => {
    // Рост значений
    activeUsers += Math.floor(Math.random() * 1000000);
    totalStreams += Math.floor(Math.random() * 5000000);
    followers += Math.floor(Math.random() * 50000);

    deezerData[month] = Math.floor(
      calculateDeezerPopularity(
        activeUsers,
        totalStreams,
        followers,
        playlistAdds,
        saveRate,
        skipRate,
        virality
      ) * (1 + (Math.random() - 0.5) / 5) // небольшое случайное колебание
    );

    deezerDataProceed.push(deezerData[month]);

    postMessage(deezerDataProceed);

    month++;

    if (month >= 12) {
      clearInterval(interval);
      postMessage(deezerDataProceed);
    }
  }, 1000);
}

// Обработчик сообщений из основного потока
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getDeezerData(e.data.buffer);
  }
};
