import * as showSectionModule from '@common/show-section';
import * as actionHandlerDelegate from '@delegates/action-handler-delegate';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import * as stateDisplayModule from '@html/components/state-display';
import { createCardHeader } from '@html/pi-crust';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { PiHoleDevice, PiHoleSetup } from '@type/types';
import { expect } from 'chai';
import { html, nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('pi-crust.ts', () => {
  let mockHass: HomeAssistant;
  let mockSetup: PiHoleSetup;
  let mockDevice: PiHoleDevice;
  let mockConfig: Config;
  let mockElement: HTMLElement;
  let stateDisplayStub: sinon.SinonStub;
  let showSectionStub: sinon.SinonStub;
  let actionHandlerStub: sinon.SinonStub;
  let handleMultiPiClickActionStub: sinon.SinonStub;

  beforeEach(() => {
    // Create mock element
    mockElement = document.createElement('div');

    // Create stub for stateDisplay
    stateDisplayStub = stub(stateDisplayModule, 'stateDisplay');
    stateDisplayStub.returns(html`<div class="mocked-state-display">On</div>`);

    // Create stub for show function
    showSectionStub = stub(showSectionModule, 'show');
    showSectionStub.returns(true); // Default to showing sections

    // Stub action handler functions
    actionHandlerStub = stub(actionHandlerDelegate, 'actionHandler').returns(
      () => {},
    );
    handleMultiPiClickActionStub = stub(
      actionHandlerDelegate,
      'handleMultiPiClickAction',
    ).returns({ handleEvent: () => {} });

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
      status: {
        entity_id: 'binary_sensor.pi_hole_status',
        state: 'on',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: { friendly_name: 'Pi-hole Status' },
        translation_key: undefined,
      },
      sensors: [],
      switches: [],
      controls: [],
      updates: [],
    } as PiHoleDevice;

    // Setup with a single device
    mockSetup = {
      holes: [mockDevice],
    };

    // Default mock config
    mockConfig = {
      device_id: 'pi_hole_device',
    };
  });

  afterEach(() => {
    // Restore all stubs
    stateDisplayStub.restore();
    showSectionStub.restore();
    actionHandlerStub.restore();
    handleMultiPiClickActionStub.restore();
  });

  it('should return nothing when show returns false for header section', () => {
    // Configure show to return false for header section
    showSectionStub.withArgs(mockConfig, 'header').returns(false);

    // Render the card header
    const result = createCardHeader(
      mockElement,
      mockSetup,
      mockHass,
      mockConfig,
    );

    // Assert that nothing is returned
    expect(result).to.equal(nothing);

    // Verify that stateDisplay was not called
    expect(stateDisplayStub.called).to.be.false;
  });

  it('should render card header with default title and icon', async () => {
    // Ensure show returns true for header section
    showSectionStub.withArgs(mockConfig, 'header').returns(true);

    // Render the card header
    const result = createCardHeader(
      mockElement,
      mockSetup,
      mockHass,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Test header exists
    expect(el.tagName.toLowerCase()).to.equal('div');
    expect(el.classList.contains('card-header')).to.be.true;

    // Check default title
    const nameEl = el.querySelector('.name');
    expect(nameEl?.textContent?.trim()).to.equal('Pi-hole');

    // Check default icon
    const iconEl = nameEl?.querySelector('ha-icon');
    expect(iconEl).to.exist;
    expect(iconEl?.getAttribute('icon')).to.equal('mdi:pi-hole');
  });

  it('should render card header with custom title and icon', async () => {
    // Set custom title and icon in config
    mockConfig.title = 'My Custom Pi-hole';
    mockConfig.icon = 'mdi:custom-icon';

    // Render the card header
    const result = createCardHeader(
      mockElement,
      mockSetup,
      mockHass,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Check custom title
    const nameEl = el.querySelector('.name');
    expect(nameEl?.textContent?.trim()).to.equal('My Custom Pi-hole');

    // Check custom icon
    const iconEl = nameEl?.querySelector('ha-icon');
    expect(iconEl).to.exist;
    expect(iconEl?.getAttribute('icon')).to.equal('mdi:custom-icon');
  });

  it('should display green status when Pi-hole is active', async () => {
    // Ensure status is 'on'
    mockSetup.holes[0]!.status!.state = 'on';

    // Render the card header
    const result = createCardHeader(
      mockElement,
      mockSetup,
      mockHass,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Check status color is green
    const statusEl = el.querySelector('div[style*="color"]');
    expect(statusEl?.getAttribute('style')).to.contain(
      'var(--success-color, green)',
    );

    // Check for correct icon
    const iconEl = statusEl?.querySelector('ha-icon');
    expect(iconEl).to.exist;
    expect(iconEl?.getAttribute('icon')).to.equal('mdi:check-circle');
  });

  it('should display red status when Pi-hole is inactive', async () => {
    // Set status to 'off'
    mockSetup.holes[0]!.status!.state = 'off';

    // Render the card header
    const result = createCardHeader(
      mockElement,
      mockSetup,
      mockHass,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Check status color is red
    const statusEl = el.querySelector('div[style*="color"]');
    expect(statusEl?.getAttribute('style')).to.contain(
      'var(--error-color, red)',
    );

    // Check for correct icon
    const iconEl = statusEl?.querySelector('ha-icon');
    expect(iconEl).to.exist;
    expect(iconEl?.getAttribute('icon')).to.equal('mdi:close-circle');
  });

  it('should call stateDisplay with the status entity', () => {
    // Render the card header
    createCardHeader(mockElement, mockSetup, mockHass, mockConfig);

    // Verify stateDisplay was called with the correct parameters
    expect(stateDisplayStub.calledWith(mockHass, mockSetup.holes[0]!.status)).to
      .be.true;
  });

  it('should display remaining time when Pi-hole is inactive and remaining time exists', async () => {
    // Set status to 'off' and add remaining time
    mockSetup.holes[0]!.status!.state = 'off';
    mockSetup.holes[0]!.remaining_until_blocking_mode = {
      entity_id: 'sensor.pi_hole_remaining_until_blocking_mode',
      state: '300', // 5 minutes
      last_changed: '2024-01-01T00:00:00.000Z',
      last_updated: '2024-01-01T00:00:00.000Z',
      attributes: { friendly_name: 'Remaining Time' },
      translation_key: 'remaining_until_blocking_mode',
    };

    // Configure mock response for remaining time
    stateDisplayStub
      .withArgs(
        mockHass,
        mockSetup.holes[0]!.remaining_until_blocking_mode,
        'remaining-time',
      )
      .returns(html`<div class="mocked-remaining-time">5 minutes</div>`);

    // Render the card header
    const result = createCardHeader(
      mockElement,
      mockSetup,
      mockHass,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Verify stateDisplay was called for both status and remaining time
    expect(stateDisplayStub.calledWith(mockHass, mockSetup.holes[0]!.status)).to
      .be.true;
    expect(
      stateDisplayStub.calledWith(
        mockHass,
        mockSetup.holes[0]!.remaining_until_blocking_mode,
        'remaining-time',
      ),
    ).to.be.true;

    // Check that remaining time is rendered
    const remainingTimeEl = el.querySelector('.mocked-remaining-time');
    expect(remainingTimeEl).to.exist;
    expect(remainingTimeEl?.textContent).to.equal('5 minutes');
  });

  // New tests for multiple Pi-hole setup

  it('should not display hole count when only one Pi-hole is configured', async () => {
    // Setup has only one hole (default setup)
    const result = createCardHeader(
      mockElement,
      mockSetup,
      mockHass,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Check that multi-status span doesn't exist
    const multiStatusEl = el.querySelector('.multi-status');
    expect(multiStatusEl).to.be.null;
  });

  it('should display hole count when multiple Pi-holes are configured', async () => {
    // Create a setup with multiple holes
    const secondDevice = {
      ...mockDevice,
      device_id: 'pi_hole_device_2',
      status: {
        ...mockDevice.status,
        entity_id: 'binary_sensor.pi_hole_2_status',
        state: 'on',
      },
    } as PiHoleDevice;

    mockSetup.holes.push(secondDevice);

    const result = createCardHeader(
      mockElement,
      mockSetup,
      mockHass,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Check that multi-status span exists and shows correct count
    const multiStatusEl = el.querySelector('.multi-status');
    expect(multiStatusEl).to.exist;
    expect(multiStatusEl?.textContent?.trim()).to.equal('(2/2)');
  });

  it('should show orange warning color when some Pi-holes are active and some are inactive', async () => {
    // Create a setup with one active and one inactive Pi-hole
    const secondDevice = {
      ...mockDevice,
      device_id: 'pi_hole_device_2',
      status: {
        ...mockDevice.status,
        entity_id: 'binary_sensor.pi_hole_2_status',
        state: 'off',
      },
    } as PiHoleDevice;

    mockSetup.holes.push(secondDevice);

    const result = createCardHeader(
      mockElement,
      mockSetup,
      mockHass,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Check that status color is orange (warning)
    const statusEl = el.querySelector('div[style*="color"]');
    expect(statusEl?.getAttribute('style')).to.contain(
      'var(--warning-color, orange)',
    );

    // Check that it shows "Partial" text instead of status
    expect(statusEl?.textContent?.trim()).to.include('Partial');
  });

  it('should correctly count active Pi-holes among multiple devices', async () => {
    // Create a setup with multiple Pi-holes in different states
    const secondDevice = {
      ...mockDevice,
      device_id: 'pi_hole_device_2',
      status: {
        ...mockDevice.status,
        entity_id: 'binary_sensor.pi_hole_2_status',
        state: 'off',
      },
    } as PiHoleDevice;

    const thirdDevice = {
      ...mockDevice,
      device_id: 'pi_hole_device_3',
      status: {
        ...mockDevice.status,
        entity_id: 'binary_sensor.pi_hole_3_status',
        state: 'on',
      },
    } as PiHoleDevice;

    mockSetup.holes.push(secondDevice, thirdDevice);

    const result = createCardHeader(
      mockElement,
      mockSetup,
      mockHass,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Check that multi-status span shows correct active count
    const multiStatusEl = el.querySelector('.multi-status');
    expect(multiStatusEl).to.exist;
    expect(multiStatusEl?.textContent?.trim()).to.equal('(2/3)');
  });

  it('should handle cases where status is undefined for some Pi-holes', async () => {
    // Create a device with undefined status
    const deviceWithoutStatus = {
      ...mockDevice,
      device_id: 'pi_hole_device_2',
      status: undefined,
    };

    mockSetup.holes.push(deviceWithoutStatus);

    const result = createCardHeader(
      mockElement,
      mockSetup,
      mockHass,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Should only count devices with defined status
    const multiStatusEl = el.querySelector('.multi-status');
    expect(multiStatusEl).to.exist;
    expect(multiStatusEl?.textContent?.trim()).to.equal('(1/2)');
  });
});
