import { getTwitterData } from '../dataCalculation';

onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getTwitterData(e.data.buffer);
  }
};
