import * as showSectionModule from '@common/show-section';
import type { HomeAssistant } from '@hass/types';
import { createSystemMetricsGraph } from '@html/components/create-system-metrics-graph';
import { SystemMetricsGraph } from '@html/components/system-metrics-graph';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('create-system-metrics-graph.ts', () => {
  // Register the custom element before tests
  before(() => {
    if (!customElements.get('system-metrics-graph')) {
      customElements.define('system-metrics-graph', SystemMetricsGraph);
    }
  });
  let mockHass: HomeAssistant;
  let mockDevice: PiHoleDevice;
  let mockConfig: Config;
  let showSectionStub: sinon.SinonStub;

  beforeEach(() => {
    // Create stub for show function
    showSectionStub = stub(showSectionModule, 'show');
    showSectionStub.returns(true); // Default to showing sections

    mockHass = {} as HomeAssistant;

    // Create mock device with CPU and memory sensors as first-class properties
    const createSensor = (entity_id: string, translation_key?: string) => ({
      entity_id,
      state: '42',
      attributes: {},
      translation_key: translation_key || 'test_key',
    });

    mockDevice = {
      device_id: 'pi_hole_device',
      cpu_use: createSensor('sensor.pi_hole_cpu_use', 'cpu_use'),
      memory_use: createSensor('sensor.pi_hole_memory_use', 'memory_use'),
      sensors: [createSensor('sensor.seen_clients')],
    } as PiHoleDevice;

    mockConfig = {
      device_id: 'pi_hole_device',
    };
  });

  afterEach(() => {
    showSectionStub.restore();
  });

  it('should return nothing when chart section is excluded', () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(false);

    const result = createSystemMetricsGraph(mockHass, mockDevice, mockConfig);

    expect(result).to.equal(nothing);
  });

  it('should return nothing when no graph sensors are present', () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);
    mockDevice.cpu_use = undefined;
    mockDevice.memory_use = undefined;
    mockDevice.sensors = [
      {
        entity_id: 'sensor.seen_clients',
        state: '42',
        attributes: {},
        translation_key: 'test_key',
      },
    ];

    const result = createSystemMetricsGraph(mockHass, mockDevice, mockConfig);

    expect(result).to.equal(nothing);
  });

  it('should return HTML template when chart section is shown and graph sensors exist', async () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);

    const result = createSystemMetricsGraph(mockHass, mockDevice, mockConfig);

    expect(result).to.not.equal(nothing);
    const el = await fixture(result as TemplateResult);
    await customElements.whenDefined('system-metrics-graph');
    expect(el.tagName.toLowerCase()).to.equal('system-metrics-graph');
  });

  it('should pass correct properties to system-metrics-graph element', async () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);

    const result = createSystemMetricsGraph(mockHass, mockDevice, mockConfig);
    const el = await fixture(result as TemplateResult);
    await customElements.whenDefined('system-metrics-graph');
    const graphElement = el as any;

    expect(graphElement.tagName.toLowerCase()).to.equal('system-metrics-graph');
    expect(graphElement.hass).to.equal(mockHass);
    expect(graphElement.device).to.equal(mockDevice);
    expect(graphElement.config).to.equal(mockConfig);
  });

  it('should work with only CPU sensor', async () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);
    mockDevice.cpu_use = {
      entity_id: 'sensor.pi_hole_cpu_use',
      state: '42',
      attributes: {},
      translation_key: 'cpu_use',
    };
    mockDevice.memory_use = undefined;

    const result = createSystemMetricsGraph(mockHass, mockDevice, mockConfig);

    // Should return nothing because both CPU and memory are required
    expect(result).to.equal(nothing);
  });

  it('should work with only memory sensor', async () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);
    mockDevice.cpu_use = undefined;
    mockDevice.memory_use = {
      entity_id: 'sensor.pi_hole_memory_use',
      state: '42',
      attributes: {},
      translation_key: 'memory_use',
    };

    const result = createSystemMetricsGraph(mockHass, mockDevice, mockConfig);

    // Should return nothing because both CPU and memory are required
    expect(result).to.equal(nothing);
  });

  it('should work with both CPU and memory sensors', async () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);
    mockDevice.cpu_use = {
      entity_id: 'sensor.pi_hole_cpu_use',
      state: '42',
      attributes: {},
      translation_key: 'cpu_use',
    };
    mockDevice.memory_use = {
      entity_id: 'sensor.pi_hole_memory_use',
      state: '42',
      attributes: {},
      translation_key: 'memory_use',
    };

    const result = createSystemMetricsGraph(mockHass, mockDevice, mockConfig);

    expect(result).to.not.equal(nothing);
    const el = await fixture(result as TemplateResult);
    await customElements.whenDefined('system-metrics-graph');
    expect(el.tagName.toLowerCase()).to.equal('system-metrics-graph');
  });

  it('should filter out non-graph sensors correctly', async () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);
    mockDevice.cpu_use = {
      entity_id: 'sensor.pi_hole_cpu_use',
      state: '42',
      attributes: {},
      translation_key: 'cpu_use',
    };
    mockDevice.memory_use = {
      entity_id: 'sensor.pi_hole_memory_use',
      state: '42',
      attributes: {},
      translation_key: 'memory_use',
    };
    mockDevice.sensors = [
      {
        entity_id: 'sensor.seen_clients',
        state: '42',
        attributes: {},
        translation_key: 'test_key',
      },
    ];

    const result = createSystemMetricsGraph(mockHass, mockDevice, mockConfig);

    // Should still return HTML because graph sensors exist
    expect(result).to.not.equal(nothing);
    const el = await fixture(result as TemplateResult);
    await customElements.whenDefined('system-metrics-graph');
    expect(el.tagName.toLowerCase()).to.equal('system-metrics-graph');
  });
});
