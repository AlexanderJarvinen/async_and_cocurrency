import './style.css';
import { initData, initDataFunctions } from './utils.js';
import { initCharts } from './chartsUpdate.js';

window.onload = () => {
  initCharts();

  const platformInitMap = {
    startMainChart: () => initData(true),
    startWorkers: () => initData(),
    youtube: initDataFunctions.initDataForYoutubeChart,
    spotify: initDataFunctions.initDataForSpotifyChart,
    instagram: initDataFunctions.initDataForInstagramChart,
    facebook: initDataFunctions.initDataForFacebookChart,
    twitter: initDataFunctions.initDataForTwitterChart,
    pandora: initDataFunctions.initDataForPandoraChart,
    soundcloud: initDataFunctions.initDataForSoundcloudChart,
    deezer: initDataFunctions.initDataForDeezerChart,
    tiktok: initDataFunctions.initDataForTiktokChart,
  };

  Object.entries(platformInitMap).forEach(([platform, handler]) => {
    const button = document.getElementById(`${platform}DataLoadingButton`);
    if (button) {
      button.addEventListener('click', handler);
    }
  });
};
