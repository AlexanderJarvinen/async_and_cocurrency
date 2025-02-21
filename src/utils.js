export const dataLength = 100 // Длина массива данных
const largeData = Array.from({ length: dataLength }, (_, i) => i)
const batchSize = Math.floor(dataLength / 100) // Пачка
let globalProgress = 0

export function logMetrics(logPanel, memoryUsed, timeElapsed) {
  const logDiv = document.getElementById(logPanel)

  // Получаем или создаём первую строку для памяти
  let memoryRow = logDiv.querySelector('.memory-row')
  if (!memoryRow) {
    memoryRow = document.createElement('tr')
    memoryRow.classList.add('memory-row')
    logDiv.appendChild(memoryRow)
  }

  // Получаем или создаём вторую строку для времени
  let timeRow = logDiv.querySelector('.time-row')
  if (!timeRow) {
    timeRow = document.createElement('tr')
    timeRow.classList.add('time-row')
    logDiv.appendChild(timeRow)
  }

  // Добавляем ячейку с памятью в первую строку
  const memoryCell = document.createElement('td')
  memoryCell.textContent = `${(memoryUsed / 1024 / 1024).toFixed(2)} MB` // Convert bytes to MB
  memoryRow.appendChild(memoryCell)

  // Добавляем ячейку с временем во вторую строку
  const timeCell = document.createElement('td')
  timeCell.textContent = `${timeElapsed.toFixed(2)} ms` // Time in milliseconds
  timeRow.appendChild(timeCell)
}

export function processLargeData({
  loaderId,
  progressBarId,
  progressTextId,
  logId,
  updateChartCallback,
  batchProcessor,
  workerProcessor = null,
  dataContainer = [],
}) {
  showLoader(loaderId)
  let index = 0

  function processNextChunk() {
    if (index >= largeData.length) {
      hideLoader(loaderId)
      updateChartCallback()
      return
    }

    const batch = largeData.slice(index, index + batchSize)

    // Начало измерения времени
    const startTime = performance.now()
    const initialMemory = performance.memory.usedJSHeapSize

    batchProcessor(batch, dataContainer).then((resp) => {
      if (resp) {
        dataContainer.push(...resp)
      }

      if (workerProcessor) {
        workerProcessor(batch)
      }

      index += batchSize
      updateProgressBar(index, progressBarId, progressTextId)

      // Конец измерения времени
      const endTime = performance.now()
      const finalMemory = performance.memory.usedJSHeapSize

      // Логирование метрик
      const timeElapsed = endTime - startTime
      const memoryUsed = finalMemory - initialMemory

      logMetrics(logId, memoryUsed, timeElapsed)

      // Переход к следующей пачке данных
      setTimeout(processNextChunk, 0)
    })
  }

  processNextChunk()
}

// Показываем лоадер
function showLoader(id) {
  document.getElementById(id).style.display = 'block'
}

// Скрываем лоадер
function hideLoader(id) {
  document.getElementById(id).style.display = 'none'
}

// Обновляем прогресс-бар
function updateProgressBar(index, progressBarId, progressTextId) {
  const progressBar = document.getElementById(progressBarId)
  const progressText = document.getElementById(progressTextId)

  const progress = (index / dataLength) * 100
  progressBar.value = progress
  progressText.innerText = `${Math.floor(progress)}%`
  globalProgress = progress
}
