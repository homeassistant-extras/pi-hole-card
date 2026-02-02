import type { ChartConfiguration } from 'chart.js';

/**
 * Chart.js configuration options for the system metrics graph
 */
export const CHART_CONFIG: ChartConfiguration<'line'>['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 0,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 8,
      titleFont: { size: 12 },
      bodyFont: { size: 11 },
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
  elements: {
    point: {
      radius: 0,
      hoverRadius: 4,
    },
    line: {
      borderWidth: 2,
      tension: 0.3,
    },
  },
};
