import { getSpotifyData } from '../dataCalculation'

// Message handler from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    console.log('getSpotifyData', e.data.buffer)
    getSpotifyData(e.data.buffer)
  }
}
