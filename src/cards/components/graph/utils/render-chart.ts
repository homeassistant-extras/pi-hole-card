import { Chart, registerables } from 'chart.js';
import { CHART_CONFIG } from './chart-config';

// Register Chart.js components
Chart.register(...registerables);

/**
 * Creates and initializes a new Chart.js instance
 * @param canvas - The canvas element to render the chart on
 * @param existingChart - Optional existing chart to destroy before creating new one
 * @returns The new Chart instance, or null if canvas or context is invalid
 */
export const renderChart = (
  canvas: HTMLCanvasElement | null,
  existingChart: Chart | null = null,
): Chart | null => {
  if (!canvas) {
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  if (existingChart) {
    existingChart.destroy();
  }

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [],
    },
    options: CHART_CONFIG,
  });
};
