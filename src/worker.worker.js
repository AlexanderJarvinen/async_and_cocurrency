// Обработчик сообщений от основного потока
onmessage = function (e) {
  const { batch, dataLength } = e.data

  // Генерация массива случайных чисел
  const randomArray = Array.from({ length: dataLength }, () =>
    Math.floor(Math.random() * dataLength)
  )

  // Находим индексы элементов из batch в randomArray
  const indices = batch.map((item) => {
    const indexInRandomArray = randomArray.indexOf(item)
    const indicesResult = indexInRandomArray === -1 ? null : indexInRandomArray
    return indicesResult
  })

  // Отправляем результат обратно в основной поток
  postMessage({ randomArray, indices })
}
