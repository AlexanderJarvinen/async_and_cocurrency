// Обработчик сообщений от основного потока
onmessage = function(e) {
  console.log("Received message from main thread:", e.data);
  
  const platforms = e.data.platforms;
  const sharedBuffer = e.data.buffer;
  const popularityData = new Float32Array(sharedBuffer);
  
  console.log("Shared buffer data:", Array.from(popularityData));
  console.log("Platforms before processing:", platforms);

  const processedPlatforms = platforms.map(platform => {
    const data = platform.customData ? platform.customData() : getRandomData(platform.maxData, 5000);
    console.log(`Generated data for platform ${platform.name || 'unknown'}:`, data);
    return { ...platform, data };
  });

  // Используем данные из SharedArrayBuffer для обработки
  processedPlatforms.forEach((platform, index) => {
    if (index === 0) {
      platform.data = Array.from(popularityData);
      console.log(`Data for platform ${platform.name || 'unknown'} replaced with shared buffer data:`, platform.data);
    }
  });

  console.log("Processed platforms:", processedPlatforms);
  
  // Отправляем результат обратно в основной поток
  postMessage({ platforms: processedPlatforms });
};

// Функция генерации случайных данных (аналогична основной программе)
function getRandomData(baseValue, variance) {
  const randomData = Array.from({ length: 12 }, () => {
    const randomVariation = Math.floor(Math.random() * variance) - (variance / 2);
    return Math.max(0, baseValue + randomVariation);
  });
  console.log("Generated random data:", randomData);
  return randomData;
}
