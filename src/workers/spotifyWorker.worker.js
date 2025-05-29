import { getSpotifyData } from '../dataCalculation';

onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getSpotifyData(e.data.buffer);
  }
};
