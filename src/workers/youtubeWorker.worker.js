

// Функция для генерации случайных данных с колебаниями
function getRandomData(baseValue, variance) {
  return Array.from({ length: 12 }, () => {
    const randomVariation = Math.floor(Math.random() * variance) - (variance / 2);
    return Math.max(0, baseValue + randomVariation);
  });
}

// Формула для расчета популярности на YouTube
function calculateYouTubePopularity(subscribers, views, engagement, mentions, retention, growth, virality) {
  const w1 = 0.25; // weight for Subscribers
  const w2 = 0.2;  // weight for Views
  const w3 = 0.2;  // weight for Engagement
  const w4 = 0.1;  // weight for Mentions
  const w5 = 0.1;  // weight for Retention
  const w6 = 0.1;  // weight for Growth
  const w7 = 0.05; // weight for Virality

  return (w1 * subscribers) +
         (w2 * views) +
         (w3 * engagement) +
         (w4 * mentions) +
         (w5 * retention) +
         (w6 * growth) +
         (w7 * virality);
}

// Генерация данных для YouTube на основе формулы популярности за 12 месяцев
function getYouTubeData(sharedBuffer) {
  const popularityData = new Float32Array(sharedBuffer);
  let subscribers = Math.floor(Math.random() * 100) + 1;
  let s = 0;

  // Логируем начало вычислений
  console.log('Начало вычислений в воркере YouTube...');

  // Эмуляция долгих вычислений
  setTimeout(() => {
    while (s <= 1000000) {
      subscribers += Math.floor(Math.random() * 100) + 1;
      s++;

      // Логируем процесс каждые 200000 итераций
      if (s % 200000 === 0) {
        console.log(`Итерация YouTube: ${s}`);
      }
    }

    const views = 50000000;
    const engagement = 5; // 5% engagement
    const mentions = 10000;
    const retention = 60; // 60% retention
    const growth = 10; // 10% growth
    const virality = 1; // 1 viral video

    // Расчет популярности для 12 месяцев и запись в SharedArrayBuffer
    for (let month = 0; month < 12; month++) {
      popularityData[month] = Math.floor(calculateYouTubePopularity(subscribers, views, engagement, mentions, retention, growth, virality) * (1 + (Math.random() - 0.5) / 5));
    }

    // Логируем конец вычислений
    console.log('Вычисления завершены в воркере YouTube');

    // Уведомляем основной поток о завершении
    postMessage('done');
  }, 0);
}

// Обработчик сообщений от главного потока
onmessage = function(e) {
  if (e.data && e.data.buffer) {
    getYouTubeData(e.data.buffer);
  }
};