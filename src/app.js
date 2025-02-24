import Chart from 'chart.js/auto';
import './style.css';
import {
  addMemoryLog,
  formatMemoryUsage,
  showLoader,
  hideLoader,
  initializeMemoryLogTable,
  fetchDataChunk,
  logMetrics
} from './utils.js';
import {
  initChart,
  resetChartData,
  updateChart,
  resetAllProcesses,
  simulateProblemLargeDataProcessing,
  simulateLargeDataProcessingSolved,
  simulateLargeDataProcessingAsyncDelayProblem,
  simulateLargeDataProcessingAsyncDelaySolved
} from './chartInit.js'

window.simulateProblemLargeDataProcessing = simulateProblemLargeDataProcessing;

window.onload = () => {
  console.log('DOM fully loaded and parsed');
  initializeMemoryLogTable();
  addMemoryLog(true);
  initChart();
  document
      .getElementById("simulateProblemLargeDataProcessingButton")
      .addEventListener("click", simulateProblemLargeDataProcessing);
  document
      .getElementById("simulateProblemLargeDataProcessingButtonSolving")
      .addEventListener("click", simulateLargeDataProcessingSolved);
  document
      .getElementById("simulateLargeDataAsyncDelayButton")
      .addEventListener("click", simulateLargeDataProcessingAsyncDelayProblem);
  document
      .getElementById("simulateLargeDataAsyncDelayButtonSolving")
      .addEventListener("click", simulateLargeDataProcessingAsyncDelaySolved);
  document
      .getElementById("resetDataProcessingButton")
      .addEventListener("click", resetAllProcesses);
};


