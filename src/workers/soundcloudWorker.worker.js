// Formula for calculating SoundCloud popularity
function calculateSoundCloudPopularity(
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
    w6 * skipRate + // Skip rate decreases the rating
    w7 * virality
  );
}

// Generating data for SoundCloud over 12 months
function getSoundCloudData(sharedBuffer) {
  const offset = 12 * 4 * 6; // Assume SoundCloud is the seventh platform
  const soundCloudData = new Float32Array(sharedBuffer, offset, 12);
  let month = 0;
  const soundCloudDataProceed = [];

  // Starting values
  let activeUsers = 175000000; // 175 million active users
  let totalStreams = 200000000; // 200 million streams
  let followers = 10000000; // 10 million followers

  const playlistAdds = 500000; // 500 thousand playlist additions
  const saveRate = 60; // 60%
  const skipRate = 20; // 20%
  const virality = 1.1;

  const interval = setInterval(() => {
    // Simulate growth
    activeUsers += Math.floor(Math.random() * 1000000);
    totalStreams += Math.floor(Math.random() * 5000000);
    followers += Math.floor(Math.random() * 50000);

    soundCloudData[month] = Math.floor(
      calculateSoundCloudPopularity(
        activeUsers,
        totalStreams,
        followers,
        playlistAdds,
        saveRate,
        skipRate,
        virality
      ) * (1 + (Math.random() - 0.5) / 5) // slight random fluctuation
    );

    soundCloudDataProceed.push(soundCloudData[month]);

    postMessage(soundCloudDataProceed);

    month++;

    if (month >= 12) {
      clearInterval(interval);
      postMessage(soundCloudDataProceed);
    }
  }, 1000);
}

// Handler of messages from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getSoundCloudData(e.data.buffer);
  }
};
