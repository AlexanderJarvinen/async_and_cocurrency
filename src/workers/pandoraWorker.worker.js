// Formula for calculating Pandora popularity
function calculatePandoraPopularity(
  activeUsers,
  totalStreams,
  followers,
  playlistAdds,
  saveRate,
  skipRate,
  virality
) {
  const w1 = 0.3; // Active users
  const w2 = 0.25; // Total number of streams
  const w3 = 0.15; // Followers
  const w4 = 0.1; // Playlist additions
  const w5 = 0.1; // Save rate
  const w6 = 0.05; // Skip rate (inverse effect)
  const w7 = 0.05; // Virality

  return (
    w1 * activeUsers +
    w2 * totalStreams +
    w3 * followers +
    w4 * playlistAdds +
    w5 * saveRate -
    w6 * skipRate + // Skip rate decreases rating
    w7 * virality
  );
}

// Generating data for Pandora over 12 months
function getPandoraData(sharedBuffer) {
  const offset = 12 * 4 * 5; // Assume Pandora is the sixth platform
  const pandoraData = new Float32Array(sharedBuffer, offset, 12);
  let month = 0;
  const pandoraDataProceed = [];

  // Starting values
  let activeUsers = 46000000; // 46 million active users
  let totalStreams = 100000000; // 100 million streams
  let followers = 5000000; // 5 million followers

  const playlistAdds = 100000; // 100 thousand playlist additions
  const saveRate = 60; // 60%
  const skipRate = 20; // 20%
  const virality = 1.1;

  const interval = setInterval(() => {
    // Simulate growth
    activeUsers += Math.floor(Math.random() * 100000);
    totalStreams += Math.floor(Math.random() * 5000000);
    followers += Math.floor(Math.random() * 50000);

    pandoraData[month] = Math.floor(
      calculatePandoraPopularity(
        activeUsers,
        totalStreams,
        followers,
        playlistAdds,
        saveRate,
        skipRate,
        virality
      ) * (1 + (Math.random() - 0.5) / 5) // slight random fluctuation
    );

    pandoraDataProceed.push(pandoraData[month]);

    postMessage(pandoraDataProceed);

    month++;

    if (month >= 12) {
      clearInterval(interval);
      postMessage(pandoraDataProceed);
    }
  }, 1000);
}

// Handler of messages from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getPandoraData(e.data.buffer);
  }
};
