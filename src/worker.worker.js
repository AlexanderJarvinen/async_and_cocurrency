console.log('Web Worker запущен');
// Обработчик сообщений от основного потока
onmessage = function(e) {
  const { data, dataLength } = e.data;

  // Генерация массива случайных чисел
  const randomArray = Array.from({ length: dataLength }, () => Math.floor(Math.random() * dataLength));

  // Находим индексы элементов из data в randomArray
  const indices = data.map(item => {
    const indexInRandomArray = randomArray.indexOf(item);
    const indicesResult = indexInRandomArray === -1 ? null : indexInRandomArray;
    console.log(indicesResult)
    return indicesResult;
  });

  // Отправляем результат обратно в основной поток
  postMessage({ randomArray, indices });
};