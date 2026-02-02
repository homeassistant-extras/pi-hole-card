import { show } from '@common/show-section';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import type { Chart } from 'chart.js';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styles } from './styles';
import { fetchStatisticsData } from './utils/fetch-statistics-data';
import { processStatisticsResponse } from './utils/process-statistics-response';
import { renderChart } from './utils/render-chart';

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

  static override get styles() {
    return styles;
  }

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

  private async _fetchStatisticsData(showLoading = true) {
    // Only show loading state on initial load
    if (showLoading) {
      this._loading = true;
    }
    this._error = null;

    const result = await fetchStatisticsData({
      hass: this.hass,
      device: this.device,
    });

    if (result.error) {
      this._error = result.error;
      this._loading = false;
      return;
    }

    if (!result.response) {
      this._error = 'Failed to load statistics data';
      this._loading = false;
      return;
    }

    processStatisticsResponse({
      response: result.response,
      device: this.device,
      chart: this._chart,
      lineType: this.config?.chart?.line_type,
    });
    this._loading = false;

    // Ensure chart is rendered if it wasn't already
    if (!this._chart) {
      const canvas = this.shadowRoot?.querySelector(
        'canvas',
      ) as HTMLCanvasElement;
      this._chart = renderChart(canvas, this._chart);
      // Re-process data to update the chart
      processStatisticsResponse({
        response: result.response,
        device: this.device,
        chart: this._chart,
        lineType: this.config?.chart?.line_type,
      });
    }
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
