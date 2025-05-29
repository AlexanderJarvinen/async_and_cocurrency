import { getYouTubeData } from '../dataCalculation';

// Handler of messages from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    console.log('getYouTubeData', e.data.buffer);
    getYouTubeData(e.data.buffer);
  }
};
