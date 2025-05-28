// Formula for calculating TikTok popularity
function calculateTikTokPopularity(
  activeUsers,
  totalViews,
  followers,
  engagementRate,
  retentionRate,
  skipRate,
  virality
) {
  const w1 = 0.3; // Active users
  const w2 = 0.25; // Total views
  const w3 = 0.15; // Followers
  const w4 = 0.1; // Engagement rate
  const w5 = 0.1; // Retention rate
  const w6 = 0.05; // Skip rate (inverse effect)
  const w7 = 0.05; // Virality

  return (
    w1 * activeUsers +
    w2 * totalViews +
    w3 * followers +
    w4 * engagementRate +
    w5 * retentionRate -
    w6 * skipRate + // Skip rate decreases the rating
    w7 * virality
  );
}

// Generate TikTok data for 12 months
function getTikTokData(sharedBuffer) {
  const offset = 12 * 4 * 8; // Assuming TikTok is the ninth platform
  const tiktokData = new Float32Array(sharedBuffer, offset, 12);
  let month = 0;
  const tiktokDataProceed = [];

  // Initial values
  let activeUsers = 1500000000; // 1.5 billion active users
  let totalViews = 5000000000; // 5 billion views
  let followers = 100000000; // 100 million followers

  const engagementRate = 3.4; // Average engagement rate in %
  const retentionRate = 50; // Retention rate in %
  const skipRate = 20; // Skip rate in %
  const virality = 1.2;

  const interval = setInterval(() => {
    // Simulate growth
    activeUsers += Math.floor(Math.random() * 10000000);
    totalViews += Math.floor(Math.random() * 100000000);
    followers += Math.floor(Math.random() * 1000000);

    tiktokData[month] = Math.floor(
      calculateTikTokPopularity(
        activeUsers,
        totalViews,
        followers,
        engagementRate,
        retentionRate,
        skipRate,
        virality
      ) * (1 + (Math.random() - 0.5) / 5) // slight random fluctuation
    );

    tiktokDataProceed.push(tiktokData[month]);

    postMessage(tiktokDataProceed);

    month++;

    if (month >= 12) {
      clearInterval(interval);
      postMessage(tiktokDataProceed);
    }
  }, 1000);
}

// Message handler from the main thread
onmessage = function (e) {
  if (e.data && e.data.buffer) {
    getTikTokData(e.data.buffer);
  }
};
