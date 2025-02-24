import YoutubeChartWorker from './workers/youtubeWorker.worker.js'
import ArtistChartsWorker from './workers/artistsCharts.worker.js';
import MyWorker from './worker.worker.js';

export const dataLength = 100; // Length of the data array
export const largeData = Array.from({ length: dataLength }, (_, i) => i)
export const batchSize = Math.floor(dataLength / 100) // Bulk
export let indexData = [];
export const platformCharts = {};
export let data = [];

// Rendering of  charts
export const platforms = [
  {
    id: 'spotifyChart',
    label: 'Spotify',
    maxData: 50000,
    color: 'rgba(30, 215, 96, 1)',
    bg: 'rgba(30, 215, 96, 0.2)',
  },
  {
    id: 'youtubeChart',
    label: 'YouTube',
    maxData: 100000,
    color: 'rgba(255, 0, 0, 1)',
    bg: 'rgba(255, 0, 0, 0.2)',
  },
  {
    id: 'instagramChart',
    label: 'Instagram',
    maxData: 30000,
    color: 'rgba(193, 53, 132, 1)',
    bg: 'rgba(193, 53, 132, 0.2)',
  },
  {
    id: 'facebookChart',
    label: 'Facebook',
    maxData: 25000,
    color: 'rgba(59, 89, 152, 1)',
    bg: 'rgba(59, 89, 152, 0.2)',
  },
  {
    id: 'twitterChart',
    label: 'Twitter',
    maxData: 20000,
    color: 'rgba(29, 161, 242, 1)',
    bg: 'rgba(29, 161, 242, 0.2)',
  },
  {
    id: 'pandoraChart',
    label: 'Pandora',
    maxData: 15000,
    color: 'rgba(0, 123, 255, 1)',
    bg: 'rgba(0, 123, 255, 0.2)',
  },
  {
    id: 'soundcloudChart',
    label: 'SoundCloud',
    maxData: 10000,
    color: 'rgba(255, 85, 0, 1)',
    bg: 'rgba(255, 85, 0, 0.2)',
  },
  {
    id: 'deezerChart',
    label: 'Deezer',
    maxData: 5000,
    color: 'rgba(0, 176, 255, 1)',
    bg: 'rgba(0, 176, 255, 0.2)',
  },
  {
    id: 'tiktokChart',
    label: 'TikTok',
    maxData: 30000,
    color: 'rgba(255, 255, 0, 1)',
    bg: 'rgba(255, 255, 0, 0.2)',
  },
];

// Data emulation for 12 months
export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];



export const artist_charts_worker = new ArtistChartsWorker();
export const youtube_chart_worker = new YoutubeChartWorker()
export const worker = new MyWorker();

// Creating a new SharedArrayBuffer
export const sharedBuffer = new SharedArrayBuffer(12 * Float32Array.BYTES_PER_ELEMENT) // 12 months