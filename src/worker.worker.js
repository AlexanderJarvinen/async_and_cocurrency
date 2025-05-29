import { getRandom } from './utils';
// Handler of messages from the main thread
onmessage = function (e) {
  const { batch, dataLength } = e.data;

  // Generation of random number array
  const randomArray = getRandom(dataLength);

  // Find indexes of elements from batch in randomArray
  const indices = batch.map((item) => {
    const indexInRandomArray = randomArray.indexOf(item);
    const indicesResult = indexInRandomArray === -1 ? null : indexInRandomArray;
    return indicesResult;
  });

  // Send the result back to the main thread
  postMessage({ randomArray, indices });
};
