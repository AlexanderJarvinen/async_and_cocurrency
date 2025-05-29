import { getTikTokData } from '../dataCalculation';

onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getTikTokData(e.data.buffer);
  }
};
