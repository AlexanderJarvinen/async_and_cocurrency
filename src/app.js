import './style.css'



import { logMetrics, processLargeData, dataLength, processDataForMainFlow, initDataForWorker } from './utils.js'
import { initCharts } from './chartsUpdate.js'


// Create Web Worker











window.onload = () => {
  initCharts()
  // initDataForChart();
  document
    .getElementById('startMainChartDataLoadingButton')
    .addEventListener('click', processDataForMainFlow)

  document
    .getElementById('startWorkersButton')
    .addEventListener('click', initDataForWorker)
}
