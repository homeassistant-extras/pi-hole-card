// Gradient cache for performance
let memoryGradient: CanvasGradient | null = null;
let lastChartWidth = 0;
let lastChartHeight = 0;
let lastMemoryLineType: string | null = null;

/**
 * Creates a memory gradient for the chart
 * @param ctx - The canvas rendering context
 * @param chartArea - The chart area dimensions
 * @param lineType - The type of line to render ('normal', 'gradient', or 'gradient_no_fill')
 * @returns A CanvasGradient object for memory visualization
 */
export function getMemoryGradient(
  ctx: CanvasRenderingContext2D,
  chartArea: { left: number; right: number; top: number; bottom: number },
  lineType: 'normal' | 'gradient' | 'gradient_no_fill' = 'normal',
): CanvasGradient {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;

  if (
    !memoryGradient ||
    lastChartWidth !== chartWidth ||
    lastChartHeight !== chartHeight ||
    lastMemoryLineType !== lineType
  ) {
    lastChartWidth = chartWidth;
    lastChartHeight = chartHeight;
    lastMemoryLineType = lineType;
    memoryGradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top,
    );

    if (lineType === 'gradient_no_fill') {
      // Cool colors at bottom, warm colors at top (slightly different from CPU for distinction)
      memoryGradient.addColorStop(0, 'rgba(6, 182, 212, 0.8)'); // Cyan at bottom
      memoryGradient.addColorStop(0.3, 'rgba(34, 197, 94, 0.8)'); // Green in lower middle
      memoryGradient.addColorStop(0.6, 'rgba(251, 191, 36, 0.8)'); // Yellow in upper middle
      memoryGradient.addColorStop(1, 'rgba(239, 68, 68, 0.8)'); // Red at top
    } else {
      // Green gradient for memory
      memoryGradient.addColorStop(0, 'rgba(76, 175, 80, 0.1)'); // Light green at bottom
      memoryGradient.addColorStop(0.5, 'rgba(76, 175, 80, 0.6)'); // Medium green in middle
      memoryGradient.addColorStop(1, 'rgba(76, 175, 80, 1)'); // Full green at top
    }
  }
  return memoryGradient;
}

