// Формула для расчета популярности TikTok
function calculateTikTokPopularity(
  activeUsers,
  totalViews,
  followers,
  engagementRate,
  retentionRate,
  skipRate,
  virality
) {
  const w1 = 0.3; // Активные пользователи
  const w2 = 0.25; // Общее количество просмотров
  const w3 = 0.15; // Подписчики
  const w4 = 0.1; // Коэффициент вовлеченности
  const w5 = 0.1; // Коэффициент удержания
  const w6 = 0.05; // Коэффициент пропусков (обратный эффект)
  const w7 = 0.05; // Вирусность

  return (
    w1 * activeUsers +
    w2 * totalViews +
    w3 * followers +
    w4 * engagementRate +
    w5 * retentionRate -
    w6 * skipRate + // Коэффициент пропусков уменьшает рейтинг
    w7 * virality
  );
}

// Генерация данных для TikTok на 12 месяцев
function getTikTokData(sharedBuffer) {
  const offset = 12 * 4 * 8; // Предполагаем, что TikTok — девятая платформа
  const tiktokData = new Float32Array(sharedBuffer, offset, 12);
  let month = 0;
  const tiktokDataProceed = [];

  // Стартовые значения
  let activeUsers = 1500000000; // 1.5 млрд активных пользователей
  let totalViews = 5000000000; // 5 млрд просмотров
  let followers = 100000000; // 100 млн подписчиков

  const engagementRate = 3.4; // Средний коэффициент вовлеченности в %
  const retentionRate = 50; // Коэффициент удержания в %
  const skipRate = 20; // Коэффициент пропусков в %
  const virality = 1.2;

  const interval = setInterval(() => {
    // Рост значений
    activeUsers += Math.floor(Math.random() * 10000000);
    totalViews += Math.floor(Math.random() * 100000000);
    followers += Math.floor(Math.random() * 1000000);

    tiktokData[month] = Math.floor(
      calculateTikTokPopularity(
        activeUsers,
        totalViews,
        followers,
        engagementRate,
        retentionRate,
        skipRate,
        virality
      ) * (1 + (Math.random() - 0.5) / 5) // небольшое случайное колебание
    );

    tiktokDataProceed.push(tiktokData[month]);

    postMessage(tiktokDataProceed);

    month++;

    if (month >= 12) {
      clearInterval(interval);
      postMessage(tiktokDataProceed);
    }
  }, 1000);
}

// Обработчик сообщений из основного потока
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getTikTokData(e.data.buffer);
  }
};
