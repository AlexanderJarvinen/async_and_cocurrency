console.log('Web Worker запущен');
// Обработчик сообщений от основного потока
onmessage = function(e) {
  const { batch, dataLength } = e.data;
  console.log('Web Worker', e.data );

  // Генерация массива случайных чисел
  const randomArray = Array.from({ length: dataLength }, () => Math.floor(Math.random() * dataLength));

    console.log('randomArray', randomArray);

  // Находим индексы элементов из data в randomArray
  const indices = batch.map(item => {
    console.log('item', item);
    const indexInRandomArray = randomArray.indexOf(item);
    const indicesResult = indexInRandomArray === -1 ? null : indexInRandomArray;
    console.log(indicesResult)
    return indicesResult;
  });

  // Отправляем результат обратно в основной поток
  postMessage({ randomArray, indices });
};