import { getPandoraData } from '../dataCalculation';

// Handler of messages from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getPandoraData(e.data.buffer);
  }
};
