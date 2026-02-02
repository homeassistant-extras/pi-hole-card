import { SystemMetricsGraph } from '@cards/components/graph/system-metrics-graph';
import * as showSectionModule from '@common/show-section';
import * as fetchStatisticsDataModule from '@cards/components/graph/utils/fetch-statistics-data';
import * as processStatisticsResponseModule from '@cards/components/graph/utils/process-statistics-response';
import * as renderChartModule from '@cards/components/graph/utils/render-chart';
import type { HomeAssistant } from '@hass/types';
import { fixture, html } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { expect } from 'chai';
import { nothing } from 'lit';
import { restore, stub } from 'sinon';

describe('SystemMetricsGraph', () => {
  let component: SystemMetricsGraph;
  let mockHass: HomeAssistant;
  let mockDevice: PiHoleDevice;
  let mockConfig: Config;
  let showStub: sinon.SinonStub;
  let fetchStatisticsDataStub: sinon.SinonStub;
  let processStatisticsResponseStub: sinon.SinonStub;
  let renderChartStub: sinon.SinonStub;

  beforeEach(() => {
    restore();

    mockHass = {
      language: 'en',
    } as HomeAssistant;

    mockDevice = {
      device_id: 'pi_hole_device',
      cpu_use: {
        entity_id: 'sensor.cpu_use',
        state: '25',
        attributes: {},
        translation_key: 'cpu_use',
      },
      memory_use: {
        entity_id: 'sensor.memory_use',
        state: '50',
        attributes: {},
        translation_key: 'memory_use',
      },
    } as unknown as PiHoleDevice;

    mockConfig = {
      device_id: 'pi_hole_device',
    };

    showStub = stub(showSectionModule, 'show');
    showStub.returns(true);

    fetchStatisticsDataStub = stub(
      fetchStatisticsDataModule,
      'fetchStatisticsData',
    );
    fetchStatisticsDataStub.resolves({ response: {}, error: null });

    processStatisticsResponseStub = stub(
      processStatisticsResponseModule,
      'processStatisticsResponse',
    );

    renderChartStub = stub(renderChartModule, 'renderChart');
    renderChartStub.returns(null);

    component = new SystemMetricsGraph();
    component.hass = mockHass;
    component.device = mockDevice;
    component.config = mockConfig;
  });

  afterEach(() => {
    restore();
  });

  it('should render nothing when show returns false for chart section', () => {
    showStub.withArgs(mockConfig, 'chart').returns(false);

    const result = component.render();

    expect(result).to.equal(nothing);
  });

  it('should render nothing when device has no cpu_use sensor', () => {
    mockDevice.cpu_use = undefined as any;
    component.device = mockDevice;

    const result = component.render();

    expect(result).to.equal(nothing);
  });

  it('should render nothing when device has no memory_use sensor', () => {
    mockDevice.memory_use = undefined as any;
    component.device = mockDevice;

    const result = component.render();

    expect(result).to.equal(nothing);
  });

  it('should call fetchStatisticsData on connectedCallback when chart is shown', () => {
    showStub.withArgs(mockConfig, 'chart').returns(true);

    component.connectedCallback();

    expect(fetchStatisticsDataStub.calledOnce).to.be.true;
    expect(fetchStatisticsDataStub.firstCall.args[0]).to.deep.include({
      hass: mockHass,
      device: mockDevice,
    });
  });

  it('should not call fetchStatisticsData on connectedCallback when chart is hidden', () => {
    showStub.withArgs(mockConfig, 'chart').returns(false);

    component.connectedCallback();

    expect(fetchStatisticsDataStub.called).to.be.false;
  });

  it('should destroy chart on disconnectedCallback', () => {
    const mockChart = {
      destroy: stub(),
    };
    (component as any)._chart = mockChart;

    component.disconnectedCallback();

    expect(mockChart.destroy.calledOnce).to.be.true;
    expect((component as any)._chart).to.be.null;
  });

  it('should render chart container when sensors are available', async () => {
    showStub.returns(true);

    const result = component.render();
    const el = await fixture(html`${result}`);

    expect(el.classList.contains('chart-container')).to.be.true;
    expect(el.querySelector('canvas')).to.exist;
  });
});
