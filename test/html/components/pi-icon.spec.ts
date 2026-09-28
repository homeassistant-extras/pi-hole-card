import * as actionHandlerDelegate from '@delegates/action-handler-delegate';
import { icon } from '@html/components/pi-icon';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { PiHoleDevice, PiHoleSetup } from '@type/types';
import { expect } from 'chai';
import { type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('icon.ts', () => {
  let mockConfig: Config;
  let mockSetup: PiHoleSetup;
  let mockElement: HTMLElement;
  let actionHandlerStub: sinon.SinonStub;
  let handleMultiPiClickActionStub: sinon.SinonStub;

  beforeEach(() => {
    // Create basic mock config
    mockConfig = {
      device_id: 'pi_hole_device',
    };

    // Create basic mock setup with no info messages
    mockSetup = {
      holes: [
        {
          device_id: 'pi_hole_device_1',
          sensors: [],
          switches: [],
          controls: [],
          updates: [],
        } as PiHoleDevice,
      ],
    };

    // Create mock element
    mockElement = document.createElement('div');

    // Stub action handler functions
    actionHandlerStub = stub(actionHandlerDelegate, 'actionHandler').returns(
      () => {},
    );
    handleMultiPiClickActionStub = stub(
      actionHandlerDelegate,
      'handleMultiPiClickAction',
    ).returns({ handleEvent: () => {} });
  });

  afterEach(() => {
    actionHandlerStub.restore();
    handleMultiPiClickActionStub.restore();
  });

  describe('when there are no info messages', () => {
    it('should render default pi-hole icon when no custom icon is configured', async () => {
      const result = icon(mockElement, mockConfig, mockSetup);
      const el = await fixture(result as TemplateResult);

      // Check that badge div is rendered with ha-icon inside
      expect(el.classList.contains('badge')).to.be.true;
      const haIcon = el.querySelector('ha-icon');
      expect(haIcon).to.not.be.null;
      expect(haIcon!.getAttribute('icon')).to.equal('mdi:pi-hole');
    });

    it('should render custom icon when configured', async () => {
      mockConfig.icon = 'mdi:custom-icon';

      const result = icon(mockElement, mockConfig, mockSetup);
      const el = await fixture(result as TemplateResult);

      // Check that ha-icon element is rendered with custom icon
      const haIcon = el.querySelector('ha-icon');
      expect(haIcon).to.not.be.null;
      expect(haIcon!.getAttribute('icon')).to.equal('mdi:custom-icon');
    });

    it('should render icon when info_message_count is undefined', async () => {
      // info_message_count is undefined by default in our mock
      const result = icon(mockElement, mockConfig, mockSetup);
      const el = await fixture(result as TemplateResult);

      const haIcon = el.querySelector('ha-icon');
      expect(haIcon).to.not.be.null;
      expect(haIcon!.getAttribute('icon')).to.equal('mdi:pi-hole');
    });

    it('should render icon when info_message_count state is "0"', async () => {
      mockSetup.holes[0]!.info_message_count = {
        entity_id: 'sensor.pi_hole_info_message_count',
        state: '0',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'info_message_count',
      };

      const result = icon(mockElement, mockConfig, mockSetup);
      const el = await fixture(result as TemplateResult);

      const haIcon = el.querySelector('ha-icon');
      expect(haIcon).to.not.be.null;
      expect(haIcon!.getAttribute('icon')).to.equal('mdi:pi-hole');
    });
  });

  describe('when there are info messages', () => {
    it('should render warning badge for single device with info messages', async () => {
      mockSetup.holes[0]!.info_message_count = {
        entity_id: 'sensor.pi_hole_info_message_count',
        state: '3',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'info_message_count',
      };

      const result = icon(mockElement, mockConfig, mockSetup);
      const el = await fixture(result as TemplateResult);

      // Check that warning badge is rendered inside badge div
      expect(el.classList.contains('badge')).to.be.true;
      const warningBadge = el.querySelector('.warning-badge');
      expect(warningBadge).to.not.be.null;
      expect(warningBadge!.textContent?.trim()).to.equal('3');
    });

    it('should sum info messages from multiple devices', async () => {
      // Add a second device to the setup
      const secondDevice: PiHoleDevice = {
        device_id: 'pi_hole_device_2',
        info_message_count: {
          entity_id: 'sensor.pi_hole_2_info_message_count',
          state: '2',
          last_changed: '2024-01-01T00:00:00.000Z',
          last_updated: '2024-01-01T00:00:00.000Z',
          attributes: {},
          translation_key: 'info_message_count',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      mockSetup.holes[0]!.info_message_count = {
        entity_id: 'sensor.pi_hole_info_message_count',
        state: '5',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'info_message_count',
      };

      mockSetup.holes.push(secondDevice);

      const result = icon(mockElement, mockConfig, mockSetup);
      const el = await fixture(result as TemplateResult);

      // Check that warning badge shows the sum (5 + 2 = 7)
      const warningBadge = el.querySelector('.warning-badge');
      expect(warningBadge).to.not.be.null;
      expect(warningBadge!.textContent?.trim()).to.equal('7');
    });

    it('should handle mixed scenarios with some devices having info messages', async () => {
      // First device has info messages
      mockSetup.holes[0]!.info_message_count = {
        entity_id: 'sensor.pi_hole_info_message_count',
        state: '4',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'info_message_count',
      };

      // Second device has no info messages (undefined)
      const secondDevice: PiHoleDevice = {
        device_id: 'pi_hole_device_2',
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      // Third device has zero info messages
      const thirdDevice: PiHoleDevice = {
        device_id: 'pi_hole_device_3',
        info_message_count: {
          entity_id: 'sensor.pi_hole_3_info_message_count',
          state: '0',
          last_changed: '2024-01-01T00:00:00.000Z',
          last_updated: '2024-01-01T00:00:00.000Z',
          attributes: {},
          translation_key: 'info_message_count',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      mockSetup.holes.push(secondDevice, thirdDevice);

      const result = icon(mockElement, mockConfig, mockSetup);
      const el = await fixture(result as TemplateResult);

      // Should show warning badge with count of 4 (4 + 0 + 0)
      const warningBadge = el.querySelector('.warning-badge');
      expect(warningBadge).to.not.be.null;
      expect(warningBadge!.textContent?.trim()).to.equal('4');
    });
  });

  describe('edge cases', () => {
    it('should handle non-numeric state values gracefully', async () => {
      mockSetup.holes[0]!.info_message_count = {
        entity_id: 'sensor.pi_hole_info_message_count',
        state: 'unavailable',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'info_message_count',
      };

      const result = icon(mockElement, mockConfig, mockSetup);
      const el = await fixture(result as TemplateResult);

      // Should render icon since NaN check will exclude this value
      const haIcon = el.querySelector('ha-icon');
      expect(haIcon).to.not.be.null;
      expect(haIcon!.getAttribute('icon')).to.equal('mdi:pi-hole');
    });

    it('should handle empty string state values', async () => {
      mockSetup.holes[0]!.info_message_count = {
        entity_id: 'sensor.pi_hole_info_message_count',
        state: '',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'info_message_count',
      };

      const result = icon(mockElement, mockConfig, mockSetup);
      const el = await fixture(result as TemplateResult);

      // Should render icon since empty string converts to 0, but NaN check should handle it
      const haIcon = el.querySelector('ha-icon');
      expect(haIcon).to.not.be.null;
      expect(haIcon!.getAttribute('icon')).to.equal('mdi:pi-hole');
    });

    it('should handle floating point numbers correctly', async () => {
      mockSetup.holes[0]!.info_message_count = {
        entity_id: 'sensor.pi_hole_info_message_count',
        state: '2.5',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'info_message_count',
      };

      const result = icon(mockElement, mockConfig, mockSetup);
      const el = await fixture(result as TemplateResult);

      // Should render warning badge with the number (2.5 converts to 2.5)
      const warningBadge = el.querySelector('.warning-badge');
      expect(warningBadge).to.not.be.null;
      expect(warningBadge!.textContent?.trim()).to.equal('2.5');
    });

    it('should handle empty holes array', async () => {
      mockSetup.holes = [];

      const result = icon(mockElement, mockConfig, mockSetup);
      const el = await fixture(result as TemplateResult);

      // Should render icon since no info messages to count
      const haIcon = el.querySelector('ha-icon');
      expect(haIcon).to.not.be.null;
      expect(haIcon!.getAttribute('icon')).to.equal('mdi:pi-hole');
    });
  });

  describe('action handler integration', () => {
    it('should call action handlers with correct configurations', async () => {
      mockSetup.holes[0]!.status = {
        entity_id: 'sensor.pi_hole_status',
        state: 'enabled',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'status',
      };

      const result = icon(mockElement, mockConfig, mockSetup);
      await fixture(result as TemplateResult);

      // Verify actionHandler was called with first action config
      expect(actionHandlerStub.calledOnce).to.be.true;
      const firstCallArgs = actionHandlerStub.firstCall.args[0];
      expect(firstCallArgs).to.have.property('entity', 'sensor.pi_hole_status');
      expect(firstCallArgs).to.have.property('tap_action');
      expect(firstCallArgs).to.have.property('hold_action');
      expect(firstCallArgs).to.have.property('double_tap_action');

      // Verify handleMultiPiClickAction was called with element and action configs
      expect(handleMultiPiClickActionStub.calledOnce).to.be.true;
      const multiClickArgs = handleMultiPiClickActionStub.firstCall.args;
      expect(multiClickArgs[0]).to.equal(mockElement);
      expect(multiClickArgs[1]).to.be.an('array');
    });

    it('should create default action configurations when no custom badge config', async () => {
      mockSetup.holes[0]!.status = {
        entity_id: 'sensor.pi_hole_status',
        state: 'enabled',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'status',
      };
      mockSetup.holes[0]!.info_message_count = {
        entity_id: 'sensor.pi_hole_info_count',
        state: '0',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'info_message_count',
      };
      mockSetup.holes[0]!.purge_diagnosis_messages = {
        entity_id: 'button.pi_hole_purge',
        state: 'unknown',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'purge_diagnosis_messages',
      };

      const result = icon(mockElement, mockConfig, mockSetup);
      await fixture(result as TemplateResult);

      const actionConfig = actionHandlerStub.firstCall.args[0];
      expect(actionConfig.entity).to.equal('sensor.pi_hole_info_count');
      expect(actionConfig.tap_action.action).to.equal('more-info');
      expect(actionConfig.hold_action.action).to.equal('more-info');
      expect(actionConfig.double_tap_action.action).to.equal('more-info');
    });

    it('should configure service call action when info messages exist and purge entity available', async () => {
      mockSetup.holes[0]!.info_message_count = {
        entity_id: 'sensor.pi_hole_info_count',
        state: '3',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'info_message_count',
      };
      mockSetup.holes[0]!.purge_diagnosis_messages = {
        entity_id: 'button.pi_hole_purge',
        state: 'unknown',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'purge_diagnosis_messages',
      };

      const result = icon(mockElement, mockConfig, mockSetup);
      await fixture(result as TemplateResult);

      const actionConfig = actionHandlerStub.firstCall.args[0];
      expect(actionConfig.entity).to.equal('sensor.pi_hole_info_count');
      expect(actionConfig.tap_action.action).to.equal('call-service');
      expect(actionConfig.tap_action.perform_action).to.equal('button.press');
      expect(actionConfig.tap_action.target.entity_id).to.equal(
        'button.pi_hole_purge',
      );
    });

    it('should use custom badge configuration when provided', async () => {
      mockConfig.badge = {
        tap_action: {
          action: 'navigate',
          navigation_path: '/custom-path',
        },
        hold_action: {
          action: 'toggle',
        },
      };
      mockSetup.holes[0]!.info_message_count = {
        entity_id: 'sensor.pi_hole_info_count',
        state: '0',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'info_message_count',
      };

      const result = icon(mockElement, mockConfig, mockSetup);
      await fixture(result as TemplateResult);

      const actionConfig = actionHandlerStub.firstCall.args[0];
      expect(actionConfig.entity).to.equal('sensor.pi_hole_info_count');
      expect(actionConfig.tap_action.action).to.equal('navigate');
      expect(actionConfig.tap_action.navigation_path).to.equal('/custom-path');
      expect(actionConfig.hold_action.action).to.equal('toggle');
    });

    it('should fallback to device_id when no other entity available', async () => {
      // No status or info_message_count entities
      const result = icon(mockElement, mockConfig, mockSetup);
      await fixture(result as TemplateResult);

      const actionConfig = actionHandlerStub.firstCall.args[0];
      expect(actionConfig.entity).to.equal('pi_hole_device_1');
    });

    it('should handle multiple pi-holes with different configurations', async () => {
      // First pi-hole with full entities
      mockSetup.holes[0]!.info_message_count = {
        entity_id: 'sensor.pi_hole_1_info_count',
        state: '2',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'info_message_count',
      };
      mockSetup.holes[0]!.purge_diagnosis_messages = {
        entity_id: 'button.pi_hole_1_purge',
        state: 'unknown',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: 'purge_diagnosis_messages',
      };

      // Second pi-hole with only status
      const secondDevice: PiHoleDevice = {
        device_id: 'pi_hole_device_2',
        status: {
          entity_id: 'sensor.pi_hole_2_status',
          state: 'disabled',
          last_changed: '2024-01-01T00:00:00.000Z',
          last_updated: '2024-01-01T00:00:00.000Z',
          attributes: {},
          translation_key: 'status',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };
      mockSetup.holes.push(secondDevice);

      const result = icon(mockElement, mockConfig, mockSetup);
      await fixture(result as TemplateResult);

      // Verify multiple action configs were passed to handleMultiPiClickAction
      const multiClickArgs = handleMultiPiClickActionStub.firstCall.args;
      expect(multiClickArgs[1]).to.have.length(2);
      expect(multiClickArgs[1][0].entity).to.equal(
        'sensor.pi_hole_1_info_count',
      );
      expect(multiClickArgs[1][1].entity).to.equal('sensor.pi_hole_2_status');
    });
  });
});
