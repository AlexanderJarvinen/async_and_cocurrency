import { getInstagramData } from '../dataCalculation'

// Handler of messages from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getInstagramData(e.data.buffer)
  }
}
