// Gradient cache for performance
let cpuGradient: CanvasGradient | null = null;
let lastChartWidth = 0;
let lastChartHeight = 0;
let lastCpuLineType: string | null = null;

/**
 * Creates a CPU gradient for the chart
 * @param ctx - The canvas rendering context
 * @param chartArea - The chart area dimensions
 * @param lineType - The type of line to render ('normal', 'gradient', or 'gradient_no_fill')
 * @returns A CanvasGradient object for CPU visualization
 */
export function getCpuGradient(
  ctx: CanvasRenderingContext2D,
  chartArea: { left: number; right: number; top: number; bottom: number },
  lineType: 'normal' | 'gradient' | 'gradient_no_fill' = 'normal',
): CanvasGradient {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;

  if (
    !cpuGradient ||
    lastChartWidth !== chartWidth ||
    lastChartHeight !== chartHeight ||
    lastCpuLineType !== lineType
  ) {
    lastChartWidth = chartWidth;
    lastChartHeight = chartHeight;
    lastCpuLineType = lineType;
    cpuGradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top,
    );

    if (lineType === 'gradient_no_fill') {
      // Cool colors at bottom, warm colors at top
      cpuGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)'); // Blue at bottom
      cpuGradient.addColorStop(0.3, 'rgba(34, 197, 94, 0.8)'); // Green in lower middle
      cpuGradient.addColorStop(0.6, 'rgba(251, 191, 36, 0.8)'); // Yellow in upper middle
      cpuGradient.addColorStop(1, 'rgba(239, 68, 68, 0.8)'); // Red at top
    } else {
      // Blue gradient for CPU
      cpuGradient.addColorStop(0, 'rgba(33, 150, 243, 0.1)'); // Light blue at bottom
      cpuGradient.addColorStop(0.5, 'rgba(33, 150, 243, 0.6)'); // Medium blue in middle
      cpuGradient.addColorStop(1, 'rgba(33, 150, 243, 1)'); // Full blue at top
    }
  }
  return cpuGradient;
}
