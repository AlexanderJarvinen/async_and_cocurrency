import { getTwitterData( } from '../dataCalculation'

// Message handler from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getTwitterData(e.data.buffer)
  }
}
