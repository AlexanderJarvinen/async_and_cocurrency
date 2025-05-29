import { getPandoraData } from '../dataCalculation';

onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getPandoraData(e.data.buffer);
  }
};
