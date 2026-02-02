import type { ChartConfig } from '@type/config';
import type { ChartDataset } from 'chart.js';

type LineType = ChartConfig['line_type'] | undefined;

/**
 * Creates Chart.js datasets for CPU and memory usage
 * @param cpuValues - Array of CPU values (or null) for each timestamp
 * @param memoryValues - Array of memory values (or null) for each timestamp
 * @param lineType - The line type configuration ('normal', 'gradient', 'gradient_no_fill', or 'no_fill')
 * @param getCpuGradient - Function to get CPU gradient
 * @param getMemoryGradient - Function to get memory gradient
 * @returns Array of Chart.js dataset configurations
 */
export const createChartDatasets = (
  cpuValues: Array<number | null>,
  memoryValues: Array<number | null>,
  lineType: LineType,
  getCpuGradient: (
    ctx: CanvasRenderingContext2D,
    chartArea: { left: number; right: number; top: number; bottom: number },
    lineType: 'normal' | 'gradient' | 'gradient_no_fill',
  ) => CanvasGradient,
  getMemoryGradient: (
    ctx: CanvasRenderingContext2D,
    chartArea: { left: number; right: number; top: number; bottom: number },
    lineType: 'normal' | 'gradient' | 'gradient_no_fill',
  ) => CanvasGradient,
): ChartDataset<'line', Array<number | null>>[] => {
  const effectiveLineType = lineType || 'normal';
  const shouldFill =
    effectiveLineType !== 'no_fill' && effectiveLineType !== 'gradient_no_fill';

  const isGradient =
    effectiveLineType === 'gradient' ||
    effectiveLineType === 'gradient_no_fill';

  const isNoFill =
    effectiveLineType === 'gradient_no_fill' || effectiveLineType === 'no_fill';

  const getCpuBackgroundColor = ():
    | string
    | ((context: any) => string | CanvasGradient) => {
    if (effectiveLineType === 'gradient') {
      return function (context: any) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) {
          return 'rgba(33, 150, 243, 0.1)';
        }
        return getCpuGradient(ctx, chartArea, effectiveLineType);
      };
    }
    if (isNoFill) {
      return 'transparent';
    }
    return 'rgba(33, 150, 243, 0.1)';
  };

  const getMemoryBackgroundColor = ():
    | string
    | ((context: any) => string | CanvasGradient) => {
    if (effectiveLineType === 'gradient') {
      return function (context: any) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) {
          return 'rgba(76, 175, 80, 0.1)';
        }
        return getMemoryGradient(ctx, chartArea, effectiveLineType);
      };
    }
    if (isNoFill) {
      return 'transparent';
    }
    return 'rgba(76, 175, 80, 0.1)';
  };

  return [
    {
      label: 'CPU Usage',
      data: cpuValues,
      borderColor: isGradient
        ? function (context: any) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              return 'rgb(33, 150, 243)';
            }
            return getCpuGradient(ctx, chartArea, effectiveLineType);
          }
        : 'rgb(33, 150, 243)',
      backgroundColor: getCpuBackgroundColor(),
      fill: shouldFill,
    },
    {
      label: 'Memory Usage',
      data: memoryValues,
      borderColor: isGradient
        ? function (context: any) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              return 'rgb(76, 175, 80)';
            }
            return getMemoryGradient(ctx, chartArea, effectiveLineType);
          }
        : 'rgb(76, 175, 80)',
      backgroundColor: getMemoryBackgroundColor(),
      fill: shouldFill,
    },
  ];
};
