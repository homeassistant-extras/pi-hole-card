import { show } from '@common/show-section';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { Chart, registerables } from 'chart.js';
import { LitElement, css, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { getCpuGradient } from './get-cpu-gradient';
import { getMemoryGradient } from './get-memory-gradient';

// Register Chart.js components
Chart.register(...registerables);

interface StatisticsDataPoint {
  timestamp: Date;
  value: number;
}

interface StatisticsResponse {
  [entityId: string]: Array<{
    start: number;
    end: number;
    mean?: number;
    min?: number;
    max?: number;
    sum?: number;
    state?: number;
  }>;
}

/**
 * Lit component for rendering system metrics graph
 */
export class SystemMetricsGraph extends LitElement {
  @property({ attribute: false })
  hass!: HomeAssistant;

  @property({ attribute: false })
  device!: PiHoleDevice;

  @property({ attribute: false })
  config!: Config;

  @state()
  private _chart: Chart | null = null;

  @state()
  private _loading = true;

  @state()
  private _error: string | null = null;

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .chart-container {
      position: relative;
      height: 60px;
      width: 100%;
      padding: 0;
      margin: 0;
    }
    .loading,
    .error {
      text-align: center;
      padding: 20px;
      color: var(--secondary-text-color, #888);
      font-size: 0.9em;
    }
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      color: var(--secondary-text-color, #888);
      font-size: 0.9em;
    }
    canvas {
      display: block;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    // Don't fetch data if chart section is excluded
    if (!show(this.config, 'chart')) {
      return;
    }
    this._fetchStatisticsData();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    // Don't update if chart section is excluded
    if (!show(this.config, 'chart')) {
      return;
    }
    // Fetch data if config, hass, or device changes and we haven't fetched yet
    if (
      changedProperties.has('config') ||
      changedProperties.has('hass') ||
      changedProperties.has('device')
    ) {
      // Only fetch if we have all required properties
      if (this.hass && this.device && this.config) {
        // If chart already exists, just refresh data without showing loading state
        if (this._chart) {
          this._fetchStatisticsData(false);
        } else {
          this._fetchStatisticsData();
        }
      }
    }

    // Ensure chart is rendered when loading state changes
    if (changedProperties.has('_loading') && !this._loading && !this._chart) {
      this._renderChart();
    }
  }

  override firstUpdated() {
    // Don't render if chart section is excluded
    if (!show(this.config, 'chart')) {
      return;
    }
    // Fetch data if we haven't fetched yet and have all required properties
    if (this.hass && this.device && this.config && this._loading) {
      this._fetchStatisticsData();
    }
    // Render chart if not loading, otherwise wait for loading to complete
    if (!this._loading) {
      this._renderChart();
    }
  }

  private async _fetchStatisticsData(showLoading = true) {
    // Check if CPU and memory sensors are available
    if (!this.device.cpu_use || !this.device.memory_use) {
      this._loading = false;
      return;
    }

    const entityIds = [
      this.device.cpu_use.entity_id,
      this.device.memory_use.entity_id,
    ];

    try {
      // Only show loading state on initial load
      if (showLoading) {
        this._loading = true;
      }
      this._error = null;

      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

      const response = await this.hass.callWS<StatisticsResponse>({
        type: 'recorder/statistics_during_period',
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        statistic_ids: entityIds,
        period: '5minute',
      });

      this._processStatisticsData(response, entityIds);
      this._loading = false;

      // Ensure chart is rendered if it wasn't already
      if (!this._chart) {
        this._renderChart();
        // Re-process data to update the chart
        this._processStatisticsData(response, entityIds);
      }
    } catch (error) {
      this._error = 'Failed to load statistics data';
      this._loading = false;
    }
  }

  private _processStatisticsData(
    response: StatisticsResponse,
    entityIds: string[],
  ) {
    // Process statistics data and update chart
    const cpuData: StatisticsDataPoint[] = [];
    const memoryData: StatisticsDataPoint[] = [];

    if (!this.device.cpu_use || !this.device.memory_use) {
      return;
    }

    const cpuEntityId = this.device.cpu_use.entity_id;
    const memoryEntityId = this.device.memory_use.entity_id;

    entityIds.forEach((entityId) => {
      const entityStats = response[entityId];

      if (!entityStats || entityStats.length === 0) {
        return;
      }

      const isCpu = entityId === cpuEntityId;
      const dataArray = isCpu ? cpuData : memoryData;

      entityStats.forEach((stat) => {
        // Use mean if available, otherwise state, otherwise sum
        const value =
          stat.mean !== undefined
            ? stat.mean
            : stat.state !== undefined
              ? stat.state
              : stat.sum !== undefined
                ? stat.sum
                : null;

        if (value !== null && !isNaN(value)) {
          // The stat.start value can be in seconds or milliseconds depending on HA version
          // Check if it's already in milliseconds (> year 2000 in seconds = 946684800)
          const timestampMs =
            stat.start > 946684800000 ? stat.start : stat.start * 1000;

          dataArray.push({
            timestamp: new Date(timestampMs),
            value,
          });
        }
      });
    });

    // Sort by time
    cpuData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    memoryData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    this._updateChart(cpuData, memoryData);
  }

  private _renderChart() {
    const canvas = this.shadowRoot?.querySelector(
      'canvas',
    ) as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    if (this._chart) {
      this._chart.destroy();
    }

    this._chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [],
      },
      options: {
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
      },
    });
  }

  private _updateChart(
    cpuData: StatisticsDataPoint[],
    memoryData: StatisticsDataPoint[],
  ) {
    if (!this._chart) {
      return;
    }

    // Create time labels (use the union of all times)
    const allTimes = new Set<number>();
    cpuData.forEach((d) => allTimes.add(d.timestamp.getTime()));
    memoryData.forEach((d) => allTimes.add(d.timestamp.getTime()));
    const sortedTimes = Array.from(allTimes).sort((a, b) => a - b);

    // Format labels
    const labels = sortedTimes.map((time) => {
      const date = new Date(time);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    });

    // Interpolate data points
    const getValueAtTime = (
      data: StatisticsDataPoint[],
      targetTime: number,
    ): number | null => {
      if (data.length === 0) return null;

      // Find closest point
      let closest = data[0]!;
      let minDiff = Math.abs(data[0]!.timestamp.getTime() - targetTime);

      for (const point of data) {
        const diff = Math.abs(point.timestamp.getTime() - targetTime);
        if (diff < minDiff) {
          minDiff = diff;
          closest = point;
        }
      }

      // Only use if within 5 minutes
      if (minDiff < 5 * 60 * 1000) {
        return closest.value;
      }
      return null;
    };

    const cpuValues = sortedTimes.map((time) => getValueAtTime(cpuData, time));
    const memoryValues = sortedTimes.map((time) =>
      getValueAtTime(memoryData, time),
    );

    // Determine if we should fill based on config
    const lineType = this.config?.chart?.line_type || 'normal';
    const shouldFill =
      lineType !== 'no_fill' && lineType !== 'gradient_no_fill';

    this._chart.data.labels = labels;
    this._chart.data.datasets = [
      {
        label: 'CPU Usage',
        data: cpuValues,
        borderColor:
          lineType === 'gradient' || lineType === 'gradient_no_fill'
            ? function (context: any) {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) {
                  return 'rgb(33, 150, 243)';
                }
                return getCpuGradient(ctx, chartArea, lineType);
              }
            : 'rgb(33, 150, 243)',
        backgroundColor:
          lineType === 'gradient'
            ? function (context: any) {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) {
                  return 'rgba(33, 150, 243, 0.1)';
                }
                return getCpuGradient(ctx, chartArea, lineType);
              }
            : lineType === 'gradient_no_fill' || lineType === 'no_fill'
              ? 'transparent'
              : 'rgba(33, 150, 243, 0.1)',
        fill: shouldFill,
      },
      {
        label: 'Memory Usage',
        data: memoryValues,
        borderColor:
          lineType === 'gradient' || lineType === 'gradient_no_fill'
            ? function (context: any) {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) {
                  return 'rgb(76, 175, 80)';
                }
                return getMemoryGradient(ctx, chartArea, lineType);
              }
            : 'rgb(76, 175, 80)',
        backgroundColor:
          lineType === 'gradient'
            ? function (context: any) {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) {
                  return 'rgba(76, 175, 80, 0.1)';
                }
                return getMemoryGradient(ctx, chartArea, lineType);
              }
            : lineType === 'gradient_no_fill' || lineType === 'no_fill'
              ? 'transparent'
              : 'rgba(76, 175, 80, 0.1)',
        fill: shouldFill,
      },
    ];

    this._chart.update('none');
  }

  override render() {
    // Return nothing if chart section is excluded
    if (!show(this.config, 'chart')) {
      return nothing;
    }

    // Check if CPU and memory sensors are available
    if (!this.device.cpu_use || !this.device.memory_use) {
      return nothing;
    }

    if (this._error) {
      return html`<div class="error">${this._error}</div>`;
    }

    // Always render canvas so it's available for chart creation
    // Show loading overlay initially
    return html`
      <div class="chart-container">
        <canvas></canvas>
        ${this._loading && !this._chart
          ? html`<div class="loading-overlay">Loading chart...</div>`
          : nothing}
      </div>
    `;
  }
}
