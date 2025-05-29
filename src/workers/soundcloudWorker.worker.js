import { getSoundCloudData } from '../dataCalculation';

onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getSoundCloudData(e.data.buffer);
  }
};
