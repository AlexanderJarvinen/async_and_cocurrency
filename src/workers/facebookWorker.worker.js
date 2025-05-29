import { getFacebookData } from '../dataCalculation';

onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getFacebookData(e.data.buffer);
  }
};
