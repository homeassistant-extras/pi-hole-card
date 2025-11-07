import * as showSectionModule from '@common/show-section';
import type { HomeAssistant } from '@hass/types';
import * as createAdditionalStatModule from '@html/components/additional-stat';
import { createAdditionalStats } from '@html/pi-toppings';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { expect } from 'chai';
import { html, nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('pi-toppings.ts', () => {
  let mockDevice: PiHoleDevice;
  let mockElement: HTMLElement;
  let mockHass: HomeAssistant;
  let mockConfig: Config;
  let createAdditionalStatStub: sinon.SinonStub;
  let showSectionStub: sinon.SinonStub;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockHass = {} as HomeAssistant;

    // Create stub for show function
    showSectionStub = stub(showSectionModule, 'show');
    showSectionStub.returns(true); // Default to showing sections

    // Create stub for createAdditionalStat
    createAdditionalStatStub = stub(
      createAdditionalStatModule,
      'createAdditionalStat',
    );

    // Mock return value with minimal data for testing
    createAdditionalStatStub.callsFake((hass, element, config, sensor) => {
      return html`<div class="mocked-additional-stat">
        ${sensor.entity_id}
      </div>`;
    });

    // Create mock device with minimal sensors array
    const createSensor = (entity_id: string) => ({
      entity_id,
      state: '42',
      attributes: {},
      translation_key: 'test_key',
    });

    mockDevice = {
      device_id: 'pi_hole_device',
      sensors: [
        createSensor('sensor.seen_clients'),
        createSensor('sensor.dns_unique_domains'),
        createSensor('sensor.dns_queries_cached'),
      ],
    } as PiHoleDevice;

    // Mock config with info section
    mockConfig = {
      device_id: 'pi_hole_device',
      info: {
        tap_action: { action: 'more-info' },
      },
    };
  });

  afterEach(() => {
    createAdditionalStatStub.restore();
    showSectionStub.restore();
  });

  it('should return nothing when show returns false for sensors section', async () => {
    // Configure show to return false for sensors section
    showSectionStub.withArgs(mockConfig, 'sensors').returns(false);

    // Call createAdditionalStats
    const result = createAdditionalStats(
      mockElement,
      mockHass,
      mockDevice,
      mockConfig,
    );

    // Assert that nothing is returned
    expect(result).to.equal(nothing);

    // Verify that createAdditionalStat was not called
    expect(createAdditionalStatStub.called).to.be.false;
  });

  it('should call createAdditionalStat for each sensor in the device', async () => {
    // Ensure show returns true for sensors section
    showSectionStub.withArgs(mockConfig, 'sensors').returns(true);

    const result = createAdditionalStats(
      mockElement,
      mockHass,
      mockDevice,
      mockConfig,
    );
    await fixture(result as TemplateResult);

    expect(createAdditionalStatStub.callCount).to.equal(
      mockDevice.sensors.length,
    );

    // Verify each sensor was passed correctly
    mockDevice.sensors.forEach((sensor, index) => {
      const call = createAdditionalStatStub.getCall(index);
      expect(call.args[0]).to.equal(mockHass);
      expect(call.args[1]).to.equal(mockElement);
      expect(call.args[2]).to.equal(mockConfig.info);
      expect(call.args[3]).to.equal(sensor);
    });
  });

  it('should render container with all sensor items', async () => {
    const result = createAdditionalStats(
      mockElement,
      mockHass,
      mockDevice,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    expect(el.tagName.toLowerCase()).to.equal('div');
    expect(el.classList.contains('additional-stats')).to.be.true;
    expect(el.querySelectorAll('.mocked-additional-stat').length).to.equal(3);
  });

  it('should handle empty sensors array', async () => {
    mockDevice.sensors = [];

    const result = createAdditionalStats(
      mockElement,
      mockHass,
      mockDevice,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    expect(createAdditionalStatStub.callCount).to.equal(0);
    expect(el.querySelectorAll('.mocked-additional-stat').length).to.equal(0);
  });

  it('should pass info section config to createAdditionalStat', async () => {
    // Update config with specific info section
    mockConfig.info = {
      tap_action: { action: 'toggle' },
      hold_action: { action: 'more-info' },
    };

    const result = createAdditionalStats(
      mockElement,
      mockHass,
      mockDevice,
      mockConfig,
    );
    await fixture(result as TemplateResult);

    // Verify that first call used the info section config
    expect(createAdditionalStatStub.firstCall.args[2]).to.deep.equal(
      mockConfig.info,
    );
  });

  it('should handle missing info config by passing undefined', async () => {
    // Remove info section from config
    delete mockConfig.info;

    const result = createAdditionalStats(
      mockElement,
      mockHass,
      mockDevice,
      mockConfig,
    );
    await fixture(result as TemplateResult);

    // Verify that undefined was passed for info config
    expect(createAdditionalStatStub.firstCall.args[2]).to.be.undefined;
  });

  it('should filter out graph sensors when chart section is shown (not excluded)', async () => {
    // Configure show to return true for chart section (chart is enabled, so filter out graph sensors)
    showSectionStub.withArgs(mockConfig, 'chart').returns(true);

    // Add graph sensors to the device
    const createSensor = (entity_id: string) => ({
      entity_id,
      state: '42',
      attributes: {},
      translation_key: 'test_key',
    });

    mockDevice.sensors = [
      createSensor('sensor.seen_clients'),
      createSensor('sensor.pi_hole_cpu_use'), // Graph sensor
      createSensor('sensor.dns_unique_domains'),
      createSensor('sensor.pi_hole_memory_use'), // Graph sensor
      createSensor('sensor.dns_queries_cached'),
    ];

    const result = createAdditionalStats(
      mockElement,
      mockHass,
      mockDevice,
      mockConfig,
    );
    await fixture(result as TemplateResult);

    // Should only call createAdditionalStat for non-graph sensors (3 out of 5)
    expect(createAdditionalStatStub.callCount).to.equal(3);

    // Verify that graph sensors were not passed to createAdditionalStat
    const calledEntityIds = createAdditionalStatStub
      .getCalls()
      .map((call) => call.args[3].entity_id);
    expect(calledEntityIds).to.not.include('sensor.pi_hole_cpu_use');
    expect(calledEntityIds).to.not.include('sensor.pi_hole_memory_use');
    expect(calledEntityIds).to.include('sensor.seen_clients');
    expect(calledEntityIds).to.include('sensor.dns_unique_domains');
    expect(calledEntityIds).to.include('sensor.dns_queries_cached');
  });

  it('should include all sensors including graph sensors when chart section is excluded', async () => {
    // Configure show to return false for chart section (chart is excluded, so include all sensors)
    showSectionStub.withArgs(mockConfig, 'chart').returns(false);

    // Add graph sensors to the device
    const createSensor = (entity_id: string) => ({
      entity_id,
      state: '42',
      attributes: {},
      translation_key: 'test_key',
    });

    mockDevice.sensors = [
      createSensor('sensor.seen_clients'),
      createSensor('sensor.pi_hole_cpu_use'), // Graph sensor
      createSensor('sensor.dns_unique_domains'),
      createSensor('sensor.pi_hole_memory_use'), // Graph sensor
      createSensor('sensor.dns_queries_cached'),
    ];

    const result = createAdditionalStats(
      mockElement,
      mockHass,
      mockDevice,
      mockConfig,
    );
    await fixture(result as TemplateResult);

    // Should call createAdditionalStat for all sensors (5 out of 5)
    expect(createAdditionalStatStub.callCount).to.equal(5);

    // Verify that graph sensors were included
    const calledEntityIds = createAdditionalStatStub
      .getCalls()
      .map((call) => call.args[3].entity_id);
    expect(calledEntityIds).to.include('sensor.pi_hole_cpu_use');
    expect(calledEntityIds).to.include('sensor.pi_hole_memory_use');
    expect(calledEntityIds).to.include('sensor.seen_clients');
    expect(calledEntityIds).to.include('sensor.dns_unique_domains');
    expect(calledEntityIds).to.include('sensor.dns_queries_cached');
  });
});
