import { getDeezerData } from '../dataCalculation';

onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getDeezerData(e.data.buffer);
  }
};
