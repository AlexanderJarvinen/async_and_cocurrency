import { getRandomData } from '../dataCalculation';

onmessage = function (e) {
  const platforms = e.data.platforms;
  const sharedBuffer = e.data.buffer;
  const popularityData = new Float32Array(sharedBuffer);

  const processedPlatforms = platforms.map((platform) => {
    const data = platform.customData
      ? platform.customData()
      : getRandomData(platform.maxData, 5000);
    return { ...platform, data };
  });

  processedPlatforms.forEach((platform, index) => {
    if (index === 0) {
      platform.data = Array.from(popularityData);
    }
  });

  postMessage({ platforms: processedPlatforms });
};
