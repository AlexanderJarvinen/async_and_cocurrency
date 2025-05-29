import { getYouTubeData } from '../dataCalculation';

onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getYouTubeData(e.data.buffer);
  }
};
