import './style.css'
import { logMetrics, processLargeData, dataLength, processDataForMainFlow, initDataForWorker } from './utils.js'
import { initCharts } from './chartsUpdate.js'

window.onload = () => {
  initCharts()
  document
    .getElementById('startMainChartDataLoadingButton')
    .addEventListener('click', processDataForMainFlow)

  document
    .getElementById('startWorkersButton')
    .addEventListener('click', initDataForWorker)
}
