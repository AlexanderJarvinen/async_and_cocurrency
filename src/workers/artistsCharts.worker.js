// Обработчик сообщений от основного потока
onmessage = function(e) {
  const platforms = e.data.platforms;
   const sharedBuffer = e.data.buffer;
  const popularityData = new Float32Array(sharedBuffer);

  const processedPlatforms = platforms.map(platform => {
    const data = platform.customData ? platform.customData() : getRandomData(platform.maxData, 5000);
    return { ...platform, data };
  });

    // Используем данные из SharedArrayBuffer для обработки
  processedPlatforms.forEach((platform, index) => {
    if (index === 0) {
      platform.data = Array.from(popularityData);
    }
  });

  // Отправляем результат обратно в основной поток
  postMessage({ platforms: processedPlatforms });
};

// Функция генерации случайных данных (аналогична основной программе)
function getRandomData(baseValue, variance) {
  return Array.from({ length: 12 }, () => {
    const randomVariation = Math.floor(Math.random() * variance) - (variance / 2);
    return Math.max(0, baseValue + randomVariation);
  });
}