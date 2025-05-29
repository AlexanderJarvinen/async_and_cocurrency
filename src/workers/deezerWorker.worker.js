import { getDeezerData } from '../dataCalculation';

// Message handler from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getDeezerData(e.data.buffer);
  }
};
