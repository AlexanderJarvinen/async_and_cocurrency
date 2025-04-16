// Формула для расчета популярности Pandora
function calculatePandoraPopularity(
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

// Генерация данных для Pandora на 12 месяцев
function getPandoraData(sharedBuffer) {
  const offset = 12 * 4 * 5; // Предполагаем, что Pandora — шестая платформа
  const pandoraData = new Float32Array(sharedBuffer, offset, 12);
  let month = 0;
  const pandoraDataProceed = [];

  // Стартовые значения
  let activeUsers = 46000000; // 46 млн активных пользователей
  let totalStreams = 100000000; // 100 млн прослушиваний
  let followers = 5000000; // 5 млн подписчиков

  const playlistAdds = 100000; // 100 тыс. добавлений в плейлисты
  const saveRate = 60; // 60%
  const skipRate = 20; // 20%
  const virality = 1.1;

  const interval = setInterval(() => {
    // Рост значений
    activeUsers += Math.floor(Math.random() * 100000);
    totalStreams += Math.floor(Math.random() * 5000000);
    followers += Math.floor(Math.random() * 50000);

    pandoraData[month] = Math.floor(
      calculatePandoraPopularity(
        activeUsers,
        totalStreams,
        followers,
        playlistAdds,
        saveRate,
        skipRate,
        virality
      ) * (1 + (Math.random() - 0.5) / 5) // небольшое случайное колебание
    );

    pandoraDataProceed.push(pandoraData[month]);

    postMessage(pandoraDataProceed);

    month++;

    if (month >= 12) {
      clearInterval(interval);
      postMessage(pandoraDataProceed);
    }
  }, 1000);
}

// Обработчик сообщений из основного потока
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getPandoraData(e.data.buffer);
  }
};
