import './style.css'
import { logMetrics, processLargeData, dataLength, processDataForMainFlow, initDataForWorker, initDataForYoutubeChart } from './utils.js'
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
}
