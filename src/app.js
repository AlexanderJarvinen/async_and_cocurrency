import './style.css'
import {
  processDataForMainFlow,
  initDataForWorker,
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
  document
    .getElementById('startMainChartDataLoadingButton')
    .addEventListener('click', processDataForMainFlow)

  document
    .getElementById('startWorkersButton')
    .addEventListener('click', initDataForWorker)

  document
    .getElementById('youtubeDataLoadingButton')
    .addEventListener('click', initDataForYoutubeChart)

  document
    .getElementById('spotifyDataLoadingButton')
    .addEventListener('click', initDataForSpotifyChart)

  document
    .getElementById('instagramDataLoadingButton')
    .addEventListener('click', initDataForInstaChart)

  document
    .getElementById('facebookDataLoadingButton')
    .addEventListener('click', initDataForFacebookChart)

  document
    .getElementById('twitterDataLoadingButton')
    .addEventListener('click', initDataForTwitterChart)

  document
    .getElementById('pandoraDataLoadingButton')
    .addEventListener('click', initDataForPandoraChart)

  document
    .getElementById('soundcloudDataLoadingButton')
    .addEventListener('click', initDataForSoundcloudChart)

  document
    .getElementById('deezerDataLoadingButton')
    .addEventListener('click', initDataForDeezerChart)

  document
    .getElementById('tiktokDataLoadingButton')
    .addEventListener('click', initDataForTiktokChart)
}
