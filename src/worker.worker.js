console.log('Основной Web Worker запущен');

// Обработчик сообщений от основного потока
onmessage = function(e) {
  const { batch, dataLength } = e.data;
  console.log('Основной Web Worker: Получено сообщение от основного потока:', e.data);

  // Генерация массива случайных чисел
  const randomArray = Array.from({ length: dataLength }, () => Math.floor(Math.random() * dataLength));
  console.log('Основной Web Worker: Сгенерирован randomArray:', randomArray);

  // Находим индексы элементов из batch в randomArray
  const indices = batch.map(item => {
    console.log('Основной Web Worker: Обработка элемента из batch:', item);
    const indexInRandomArray = randomArray.indexOf(item);
    const indicesResult = indexInRandomArray === -1 ? null : indexInRandomArray;
    console.log(`Основной Web Worker: Индекс элемента ${item} в randomArray:`, indicesResult);
    return indicesResult;
  });

  console.log('Основной Web Worker: Вычисленные индексы:', indices);

  // Отправляем результат обратно в основной поток
  postMessage({ randomArray, indices });
};
