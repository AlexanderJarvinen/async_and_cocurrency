export const dataLength = 100 // Length of the data array
const largeData = Array.from({ length: dataLength }, (_, i) => i)
const batchSize = Math.floor(dataLength / 100) // Bulk
let globalProgress = 0

export function logMetrics(logPanel, memoryUsed, timeElapsed) {
  const logDiv = document.getElementById(logPanel)

  // Get or create the first line for memory
  let memoryRow = logDiv.querySelector('.memory-row')
  if (!memoryRow) {
    memoryRow = document.createElement('tr')
    memoryRow.classList.add('memory-row')
    logDiv.appendChild(memoryRow)
  }

  // Get or create a second string for the time
  let timeRow = logDiv.querySelector('.time-row')
  if (!timeRow) {
    timeRow = document.createElement('tr')
    timeRow.classList.add('time-row')
    logDiv.appendChild(timeRow)
  }

  // Add the memory cell to the first line
  const memoryCell = document.createElement('td')
  memoryCell.textContent = `${(memoryUsed / 1024 / 1024).toFixed(2)} MB` // Convert bytes to MB
  memoryRow.appendChild(memoryCell)

  // Add the cell with time to the second row
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

    // Start time measurement
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

      // End of time measurement
      const endTime = performance.now()
      const finalMemory = performance.memory.usedJSHeapSize

      // Logging metrics
      const timeElapsed = endTime - startTime
      const memoryUsed = finalMemory - initialMemory

      logMetrics(logId, memoryUsed, timeElapsed)

      // Go to the next stack of data
      setTimeout(processNextChunk, 0)
    })
  }

  processNextChunk()
}

// Show loader
function showLoader(id) {
  document.getElementById(id).style.display = 'block'
}

// Hide the loader
function hideLoader(id) {
  document.getElementById(id).style.display = 'none'
}

// Update the progress bar
function updateProgressBar(index, progressBarId, progressTextId) {
  const progressBar = document.getElementById(progressBarId)
  const progressText = document.getElementById(progressTextId)

  const progress = (index / dataLength) * 100
  progressBar.value = progress
  progressText.innerText = `${Math.floor(progress)}%`
  globalProgress = progress
}
