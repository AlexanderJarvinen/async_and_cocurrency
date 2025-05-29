import { getInstagramData } from '../dataCalculation';

onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getInstagramData(e.data.buffer);
  }
};
