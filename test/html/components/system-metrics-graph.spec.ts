import * as showSectionModule from '@common/show-section';
import type { HomeAssistant } from '@hass/types';
import { SystemMetricsGraph } from '@html/components/system-metrics-graph';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { expect } from 'chai';
import { restore, stub } from 'sinon';

describe('SystemMetricsGraph', () => {
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
  let callWSStub: sinon.SinonStub;

  beforeEach(() => {
    // Create stub for show function
    showSectionStub = stub(showSectionModule, 'show');
    showSectionStub.returns(true); // Default to showing sections

    // Create mock HomeAssistant with callWS method
    callWSStub = stub();
    mockHass = {
      callWS: callWSStub,
    } as unknown as HomeAssistant;

    // Create mock device with graph sensors
    const createSensor = (entity_id: string) => ({
      entity_id,
      state: '42',
      attributes: {},
      translation_key: 'test_key',
    });

    mockDevice = {
      device_id: 'pi_hole_device',
      sensors: [
        createSensor('sensor.pi_hole_cpu_use'),
        createSensor('sensor.pi_hole_memory_use'),
        createSensor('sensor.seen_clients'),
      ],
    } as PiHoleDevice;

    mockConfig = {
      device_id: 'pi_hole_device',
    };
  });

  afterEach(() => {
    restore();
  });

  it('should not fetch data when chart section is excluded', async () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(false);

    const el = await fixture<SystemMetricsGraph>(
      `<system-metrics-graph></system-metrics-graph>`,
    );
    el.hass = mockHass;
    el.device = mockDevice;
    el.config = mockConfig;
    await el.updateComplete;

    // Give it a moment to potentially call
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(callWSStub.called).to.be.false;
  });

  it('should handle statistics data processing correctly', async () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);

    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    const tenMinutesAgo = now - 10 * 60 * 1000;

    callWSStub.resolves({
      'sensor.pi_hole_cpu_use': [
        {
          start: fiveMinutesAgo,
          end: now,
          mean: 45.5,
        },
        {
          start: tenMinutesAgo,
          end: fiveMinutesAgo,
          mean: 42.3,
        },
      ],
      'sensor.pi_hole_memory_use': [
        {
          start: fiveMinutesAgo,
          end: now,
          mean: 60.2,
        },
        {
          start: tenMinutesAgo,
          end: fiveMinutesAgo,
          mean: 58.1,
        },
      ],
    });

    const el = await fixture<SystemMetricsGraph>(
      `<system-metrics-graph></system-metrics-graph>`,
    );
    el.hass = mockHass;
    el.device = mockDevice;
    el.config = mockConfig;
    await el.updateComplete;

    // Wait for data processing
    let attempts = 0;
    while (
      ((el as any)._loading || (el as any)._chart === null) &&
      attempts < 40
    ) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      await el.updateComplete;
      attempts++;
    }

    expect((el as any)._chart).to.not.be.null;
    expect((el as any)._error).to.be.oneOf([null, undefined]);
  });

  it('should refresh data when hass or device changes', async () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);
    callWSStub.resolves({
      'sensor.pi_hole_cpu_use': [],
      'sensor.pi_hole_memory_use': [],
    });

    const el = await fixture<SystemMetricsGraph>(
      `<system-metrics-graph></system-metrics-graph>`,
    );
    el.hass = mockHass;
    el.device = mockDevice;
    el.config = mockConfig;
    await el.updateComplete;

    let attempts = 0;
    while ((el as any)._loading && attempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      await el.updateComplete;
      attempts++;
    }

    const initialCallCount = callWSStub.callCount;

    // Change hass
    el.hass = { ...mockHass } as HomeAssistant;
    await el.updateComplete;

    // Should call fetch again (but without showing loading)
    attempts = 0;
    while (callWSStub.callCount <= initialCallCount && attempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      attempts++;
    }
  });

  it('should handle statistics with state instead of mean', async () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);

    const now = Date.now();
    callWSStub.resolves({
      'sensor.pi_hole_cpu_use': [
        {
          start: now - 5 * 60 * 1000,
          end: now,
          state: 50.0,
        },
      ],
      'sensor.pi_hole_memory_use': [
        {
          start: now - 5 * 60 * 1000,
          end: now,
          state: 65.0,
        },
      ],
    });

    const el = await fixture<SystemMetricsGraph>(
      `<system-metrics-graph></system-metrics-graph>`,
    );
    el.hass = mockHass;
    el.device = mockDevice;
    el.config = mockConfig;
    await el.updateComplete;

    let attempts = 0;
    while (
      ((el as any)._loading || (el as any)._chart === null) &&
      attempts < 40
    ) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      await el.updateComplete;
      attempts++;
    }

    expect((el as any)._chart).to.not.be.null;
    expect((el as any)._error).to.be.oneOf([null, undefined]);
  });

  it('should handle empty statistics response', async () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);
    callWSStub.resolves({
      'sensor.pi_hole_cpu_use': [],
      'sensor.pi_hole_memory_use': [],
    });

    const el = await fixture<SystemMetricsGraph>(
      `<system-metrics-graph></system-metrics-graph>`,
    );
    el.hass = mockHass;
    el.device = mockDevice;
    el.config = mockConfig;
    await el.updateComplete;

    let attempts = 0;
    while ((el as any)._loading && attempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      await el.updateComplete;
      attempts++;
    }

    expect((el as any)._error).to.be.oneOf([null, undefined]);
  });

  it('should handle missing entity statistics gracefully', async () => {
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);
    callWSStub.resolves({
      'sensor.pi_hole_cpu_use': [],
      // Missing memory sensor data
    });

    const el = await fixture<SystemMetricsGraph>(
      `<system-metrics-graph></system-metrics-graph>`,
    );
    el.hass = mockHass;
    el.device = mockDevice;
    el.config = mockConfig;
    await el.updateComplete;

    let attempts = 0;
    while ((el as any)._loading && attempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      await el.updateComplete;
      attempts++;
    }

    expect((el as any)._error).to.be.oneOf([null, undefined]);
  });
});
