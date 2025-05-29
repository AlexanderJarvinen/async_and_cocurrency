import { getTikTokData } from '../dataCalculation'

// Message handler from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getTikTokData(e.data.buffer)
  }
}
