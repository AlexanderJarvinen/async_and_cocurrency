
import { months } from './initData';

export const mainChartConfig = {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Data Points',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 0,
    },
  },
};

export const mainWorkerChartConfig = {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Index of Data Points',
        data: [],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 0,
    },
  },
}

// Charts settings for each platform
export const chartConfig = (label, data, borderColor, backgroundColor) => ({
  type: 'line',
  data: {
    labels: months,
    datasets: [
      {
        label: label,
        data: data,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
})