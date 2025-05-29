import './style.css'
import {
  initData,
  initDataForYoutubeChart,
  initDataForSpotifyChart,
  initDataForInstaChart,
  initDataForFacebookChart,
  initDataForTwitterChart,
  initDataForPandoraChart,
  initDataForSoundcloudChart,
  initDataForDeezerChart,
  initDataForTiktokChart,
} from './utils.js'
import { initCharts } from './chartsUpdate.js'

window.onload = () => {
  initCharts()

  const platformInitMap = {
    startMainChart: () => initData(),
    startWorkers: () => initData(true),
    youtube: initDataForYoutubeChart,
    spotify: initDataForSpotifyChart,
    instagram: initDataForInstaChart,
    facebook: initDataForFacebookChart,
    twitter: initDataForTwitterChart,
    pandora: initDataForPandoraChart,
    soundcloud: initDataForSoundcloudChart,
    deezer: initDataForDeezerChart,
    tiktok: initDataForTiktokChart,
  }

  Object.entries(platformInitMap).forEach(([platform, handler]) => {
    const button = document.getElementById(`${platform}DataLoadingButton`)
    if (button) {
      button.addEventListener('click', handler)
    }
  })
}