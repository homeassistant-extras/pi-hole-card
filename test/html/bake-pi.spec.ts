import type { HomeAssistant } from '@hass/types';
import { renderPiHoleCard } from '@html/bake-pi';
import * as systemMetricsGraphModule from '@html/components/create-system-metrics-graph';
import * as piCrustModule from '@html/pi-crust';
import * as piFillingsModule from '@html/pi-fillings';
import * as piFlavorsModule from '@html/pi-flavors';
import * as piTinModule from '@html/pi-tin';
import * as piToppingsModule from '@html/pi-toppings';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { PiHoleDevice, PiHoleSetup } from '@type/types';
import { expect } from 'chai';
import { html } from 'lit';
import { stub } from 'sinon';

describe('bake-pi.ts', () => {
  let mockHass: HomeAssistant;
  let mockSetup: PiHoleSetup;
  let mockDevice: PiHoleDevice;
  let mockConfig: Config;
  let element: HTMLElement;

  // Create stubs for all component functions
  let createCardHeaderStub: sinon.SinonStub;
  let createDashboardStatsStub: sinon.SinonStub;
  let createAdditionalStatsStub: sinon.SinonStub;
  let createCardActionsStub: sinon.SinonStub;
  let createFooterStub: sinon.SinonStub;
  let createSystemMetricsGraphStub: sinon.SinonStub;

  beforeEach(() => {
    element = document.createElement('div');

    // Create stubs for all imported functions
    createCardHeaderStub = stub(piCrustModule, 'createCardHeader');
    createCardHeaderStub.returns(
      html`<div class="mocked-card-header">Mocked Card Header</div>`,
    );

    createDashboardStatsStub = stub(piFillingsModule, 'createDashboardStats');
    createDashboardStatsStub.returns(
      html`<div class="mocked-dashboard-stats">Mocked Dashboard Stats</div>`,
    );

    createAdditionalStatsStub = stub(piToppingsModule, 'createAdditionalStats');
    createAdditionalStatsStub.returns(
      html`<div class="mocked-additional-stats">Mocked Additional Stats</div>`,
    );

    createCardActionsStub = stub(piFlavorsModule, 'createCardActions');
    createCardActionsStub.returns(
      html`<div class="mocked-card-actions">Mocked Card Actions</div>`,
    );

    createFooterStub = stub(piTinModule, 'createFooter');
    createFooterStub.returns(
      html`<div class="mocked-footer">Mocked Footer</div>`,
    );

    createSystemMetricsGraphStub = stub(
      systemMetricsGraphModule,
      'createSystemMetricsGraph',
    );
    createSystemMetricsGraphStub.returns(
      html`<div class="mocked-system-metrics-graph">
        Mocked System Metrics Graph
      </div>`,
    );

    // Mock HomeAssistant instance
    mockHass = {
      states: {
        'binary_sensor.pi_hole_status': {
          state: 'on',
          entity_id: 'binary_sensor.pi_hole_status',
          attributes: {
            friendly_name: 'Pi-hole Status',
          },
        },
      },
    } as unknown as HomeAssistant;

    // Mock device
    mockDevice = {
      device_id: 'pi_hole_device',
      updates: [
        {
          entity_id: 'update.pi_hole_core',
          state: 'off',
          translation_key: undefined,
          attributes: {
            friendly_name: 'Pi-hole Core Update',
            title: 'Core',
            installed_version: 'v5.14.2',
          },
        },
      ],
    } as any as PiHoleDevice;

    mockSetup = {
      holes: [mockDevice],
    } as PiHoleSetup;

    // Mock config
    mockConfig = {
      device_id: 'pi_hole_device',
    };
  });

  afterEach(() => {
    // Restore all stubs
    createCardHeaderStub.restore();
    createDashboardStatsStub.restore();
    createAdditionalStatsStub.restore();
    createCardActionsStub.restore();
    createFooterStub.restore();
    createSystemMetricsGraphStub.restore();
  });

  it('should render a Pi-hole card with all main sections', async () => {
    // Render the Pi-hole card
    const result = renderPiHoleCard(element, mockHass, mockSetup, mockConfig);
    const el = await fixture(result);

    // Test main sections exist
    expect(el.querySelector('.mocked-card-header')).to.exist;
    expect(el.querySelector('.card-content')).to.exist;
    expect(el.querySelector('.mocked-dashboard-stats')).to.exist;
    expect(el.querySelector('.mocked-additional-stats')).to.exist;
    expect(el.querySelector('.mocked-card-actions')).to.exist;
    expect(el.querySelector('.mocked-footer')).to.exist;
  });

  it('should call all component functions with the correct parameters', async () => {
    // Render the Pi-hole card
    const result = renderPiHoleCard(element, mockHass, mockSetup, mockConfig);
    const el = await fixture(result);

    // Verify createCardHeader was called with the correct parameters
    expect(createCardHeaderStub.calledOnce).to.be.true;
    expect(createCardHeaderStub.firstCall.args[0]).to.equal(element);
    expect(createCardHeaderStub.firstCall.args[1]).to.equal(mockSetup);
    expect(createCardHeaderStub.firstCall.args[2]).to.equal(mockHass);
    expect(createCardHeaderStub.firstCall.args[3]).to.equal(mockConfig);

    // Verify createDashboardStats was called with the correct parameters
    expect(createDashboardStatsStub.calledOnce).to.be.true;
    expect(createDashboardStatsStub.firstCall.args[0]).to.equal(element);
    expect(createDashboardStatsStub.firstCall.args[1]).to.equal(mockHass);
    expect(createDashboardStatsStub.firstCall.args[2]).to.equal(mockSetup);
    expect(createDashboardStatsStub.firstCall.args[3]).to.equal(mockConfig);

    // Verify createAdditionalStats was called with the correct parameters
    expect(createAdditionalStatsStub.calledOnce).to.be.true;
    expect(createAdditionalStatsStub.firstCall.args[0]).to.equal(element);
    expect(createAdditionalStatsStub.firstCall.args[1]).to.equal(mockHass);
    expect(createAdditionalStatsStub.firstCall.args[2]).to.equal(mockDevice);
    expect(createAdditionalStatsStub.firstCall.args[3]).to.equal(mockConfig);

    // Verify createCardActions was called with the correct parameters
    expect(createCardActionsStub.calledOnce).to.be.true;
    expect(createCardActionsStub.firstCall.args[0]).to.equal(element);
    expect(createCardActionsStub.firstCall.args[1]).to.equal(mockHass);
    expect(createCardActionsStub.firstCall.args[2]).to.equal(mockSetup);
    expect(createCardActionsStub.firstCall.args[3]).to.equal(mockDevice);
    expect(createCardActionsStub.firstCall.args[4]).to.equal(mockConfig);

    // Verify createFooter was called with the correct parameters
    expect(createFooterStub.calledOnce).to.be.true;
    expect(createFooterStub.firstCall.args[0]).to.equal(element);
    expect(createFooterStub.firstCall.args[1]).to.equal(mockHass);
    expect(createFooterStub.firstCall.args[2]).to.equal(mockConfig);
    expect(createFooterStub.firstCall.args[3]).to.equal(mockDevice);

    // Verify createSystemMetricsGraph was called with the correct parameters
    expect(createSystemMetricsGraphStub.calledOnce).to.be.true;
    expect(createSystemMetricsGraphStub.firstCall.args[0]).to.equal(mockHass);
    expect(createSystemMetricsGraphStub.firstCall.args[1]).to.equal(mockDevice);
    expect(createSystemMetricsGraphStub.firstCall.args[2]).to.equal(mockConfig);

    // Test that the rendered HTML contains the expected structure
    expect(el.querySelector('.mocked-card-header')).to.exist;
    expect(el.querySelector('.card-content')).to.exist;
    expect(el.querySelector('.mocked-dashboard-stats')).to.exist;
    expect(el.querySelector('.mocked-additional-stats')).to.exist;
    expect(el.querySelector('.mocked-card-actions')).to.exist;
    expect(el.querySelector('.mocked-footer')).to.exist;
  });
});
