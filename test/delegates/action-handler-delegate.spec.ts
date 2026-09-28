import {
  actionHandler,
  handleClickAction,
  handleMultiPiClickAction,
} from '@delegates/action-handler-delegate';
import * as fireEventModule from '@homeassistant-extras/hass/common/dom/fire_event';
import type { ActionHandlerEvent } from '@homeassistant-extras/hass/data/lovelace/action_handler';
import * as actionHandlerDirective from '@homeassistant-extras/hass/panels/lovelace/common/directives/action-handler-directive';
import type { ActionConfigParams } from '@homeassistant-extras/hass/panels/lovelace/common/handle-action';
import type { SectionConfig } from '@type/config';
import { expect } from 'chai';
import { restore, type SinonStub, stub } from 'sinon';

describe('action-handler-delegate.ts', () => {
  let fireEventStub: SinonStub;
  let hassActionHandlerStub: SinonStub;

  beforeEach(() => {
    // Set up stubs for the dependencies
    fireEventStub = stub(fireEventModule, 'fireEvent');
    hassActionHandlerStub = stub(actionHandlerDirective, 'actionHandler');
  });

  afterEach(() => {
    // Clean up all stubs
    restore();
  });

  describe('actionHandler', () => {
    it('should call hassActionHandler with hasDoubleClick and hasHold based on config', () => {
      // Create test configuration
      const config: SectionConfig = {
        hold_action: { action: 'more-info' },
        double_tap_action: { action: 'toggle' },
      };

      // Act
      actionHandler(config);

      // Assert
      expect(hassActionHandlerStub.calledOnce).to.be.true;
      expect(hassActionHandlerStub.firstCall.args[0]).to.deep.equal({
        hasDoubleClick: true,
        hasHold: true,
      });
    });

    it('should disable hold action when it is set to none', () => {
      // Create test configuration
      const config: SectionConfig = {
        hold_action: { action: 'none' },
        double_tap_action: { action: 'toggle' },
      };

      // Act
      actionHandler(config);

      // Assert
      expect(hassActionHandlerStub.calledOnce).to.be.true;
      expect(hassActionHandlerStub.firstCall.args[0]).to.deep.equal({
        hasDoubleClick: true,
        hasHold: false,
      });
    });

    it('should disable double tap action when it is set to none', () => {
      // Create test configuration
      const config: SectionConfig = {
        hold_action: { action: 'more-info' },
        double_tap_action: { action: 'none' },
      };

      // Act
      actionHandler(config);

      // Assert
      expect(hassActionHandlerStub.calledOnce).to.be.true;
      expect(hassActionHandlerStub.firstCall.args[0]).to.deep.equal({
        hasDoubleClick: false,
        hasHold: true,
      });
    });

    it('should disable both actions when they are undefined', () => {
      // Create test configuration with no actions defined
      const config: SectionConfig = {};

      // Act
      actionHandler(config);

      // Assert
      expect(hassActionHandlerStub.calledOnce).to.be.true;
      expect(hassActionHandlerStub.firstCall.args[0]).to.deep.equal({
        hasDoubleClick: false,
        hasHold: false,
      });
    });
  });

  describe('handleClickAction', () => {
    it('should not fire an event if no action is provided in the event detail', () => {
      // Arrange
      const element = document.createElement('div');
      const sectionConfig: SectionConfig = {
        tap_action: { action: 'toggle' },
        hold_action: { action: 'more-info' },
      };
      const entity = {
        entity_id: 'light.living_room',
        state: 'on',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: undefined,
      };
      const handler = handleClickAction(element, sectionConfig, entity);
      const event = { detail: {} } as ActionHandlerEvent;

      // Act
      handler.handleEvent(event);

      // Assert
      expect(fireEventStub.called).to.be.false;
    });

    it('should fire a "hass-action" event with the correct parameters when an action is provided', () => {
      // Arrange
      const element = document.createElement('div');
      const sectionConfig: SectionConfig = {
        tap_action: { action: 'toggle' },
        hold_action: { action: 'more-info' },
        double_tap_action: { action: 'more-info' },
      };
      const entity = {
        entity_id: 'light.living_room',
        state: 'on',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: undefined,
      };
      const handler = handleClickAction(element, sectionConfig, entity);
      const event = { detail: { action: 'tap' } } as ActionHandlerEvent;

      // Act
      handler.handleEvent(event);

      // Assert
      expect(fireEventStub.calledOnce).to.be.true;
      expect(fireEventStub.firstCall.args[0]).to.equal(element);
      expect(fireEventStub.firstCall.args[1]).to.equal('hass-action');
      const configArg = fireEventStub.firstCall.args[2].config;
      expect(configArg).to.deep.equal({
        entity: 'light.living_room',
        tap_action: { action: 'toggle' },
        hold_action: { action: 'more-info' },
        double_tap_action: { action: 'more-info' },
      });
      expect(fireEventStub.firstCall.args[2].action).to.equal('tap');
    });

    it('should correctly handle different action types', () => {
      // Arrange
      const element = document.createElement('div');
      const sectionConfig: SectionConfig = {
        tap_action: { action: 'toggle' },
        hold_action: { action: 'more-info' },
        double_tap_action: { action: 'none' },
      };
      const entity = {
        entity_id: 'light.living_room',
        state: 'on',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: undefined,
      };
      const handler = handleClickAction(element, sectionConfig, entity);

      // Test with different action types
      const actions = ['tap', 'double_tap', 'hold'];

      actions.forEach((actionType) => {
        // Reset the stub counter
        fireEventStub.resetHistory();

        // Create event with specific action type
        const event = {
          detail: { action: actionType },
        } as ActionHandlerEvent;

        // Act
        handler.handleEvent(event);

        // Assert
        expect(fireEventStub.calledOnce).to.be.true;
        expect(fireEventStub.firstCall.args[2].action).to.equal(actionType);
      });
    });

    it('should include custom section config in the fired event', () => {
      // Arrange
      const element = document.createElement('div');
      const sectionConfig: SectionConfig = {
        tap_action: { action: 'toggle' },
        hold_action: { action: 'more-info' },
        double_tap_action: { action: 'none' },
      };
      const entity = {
        entity_id: 'light.living_room',
        state: 'on',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: {},
        translation_key: undefined,
      };
      const handler = handleClickAction(element, sectionConfig, entity);
      const event = { detail: { action: 'tap' } } as ActionHandlerEvent;

      // Act
      handler.handleEvent(event);

      // Assert
      expect(fireEventStub.calledOnce).to.be.true;
      const configArg = fireEventStub.firstCall.args[2].config;
      expect(configArg).to.include({
        entity: 'light.living_room',
      });
    });
  });

  describe('handleMultiPiClickAction', () => {
    it('should not fire an event if no action is provided in the event detail', () => {
      // Arrange
      const element = document.createElement('div');
      const actionConfigs = [
        {
          entity: 'light.living_room',
          tap_action: { action: 'toggle' },
        },
        {
          entity: 'light.kitchen',
          tap_action: { action: 'toggle' },
        },
      ] as ActionConfigParams[];
      const handler = handleMultiPiClickAction(element, actionConfigs);
      const event = { detail: {} } as ActionHandlerEvent;

      // Act
      handler.handleEvent(event);

      // Assert
      expect(fireEventStub.called).to.be.false;
    });

    it('should fire "hass-action" events for each config when an action is provided', () => {
      // Arrange
      const element = document.createElement('div');
      const actionConfigs = [
        {
          entity: 'light.living_room',
          tap_action: { action: 'toggle' },
          hold_action: { action: 'more-info' },
        },
        {
          entity: 'light.kitchen',
          tap_action: { action: 'toggle' },
          double_tap_action: { action: 'more-info' },
        },
      ] as ActionConfigParams[];
      const handler = handleMultiPiClickAction(element, actionConfigs);
      const event = { detail: { action: 'tap' } } as ActionHandlerEvent;

      // Act
      handler.handleEvent(event);

      // Assert
      expect(fireEventStub.calledTwice).to.be.true;

      // Check first call
      expect(fireEventStub.firstCall.args[0]).to.equal(element);
      expect(fireEventStub.firstCall.args[1]).to.equal('hass-action');
      expect(fireEventStub.firstCall.args[2].config).to.deep.equal(
        actionConfigs[0],
      );
      expect(fireEventStub.firstCall.args[2].action).to.equal('tap');

      // Check second call
      expect(fireEventStub.secondCall.args[0]).to.equal(element);
      expect(fireEventStub.secondCall.args[1]).to.equal('hass-action');
      expect(fireEventStub.secondCall.args[2].config).to.deep.equal(
        actionConfigs[1],
      );
      expect(fireEventStub.secondCall.args[2].action).to.equal('tap');
    });

    it('should correctly handle different action types for multiple configs', () => {
      // Arrange
      const element = document.createElement('div');
      const actionConfigs = [
        {
          entity: 'light.living_room',
          tap_action: { action: 'toggle' },
          hold_action: { action: 'more-info' },
        },
        {
          entity: 'light.kitchen',
          tap_action: { action: 'toggle' },
          double_tap_action: { action: 'none' },
        },
      ] as ActionConfigParams[];
      const handler = handleMultiPiClickAction(element, actionConfigs);

      // Test with different action types
      const actions = ['tap', 'double_tap', 'hold'];

      actions.forEach((actionType) => {
        // Reset the stub counter
        fireEventStub.resetHistory();

        // Create event with specific action type
        const event = {
          detail: { action: actionType },
        } as ActionHandlerEvent;

        // Act
        handler.handleEvent(event);

        // Assert
        expect(fireEventStub.calledTwice).to.be.true;
        expect(fireEventStub.firstCall.args[2].action).to.equal(actionType);
        expect(fireEventStub.secondCall.args[2].action).to.equal(actionType);
      });
    });

    it('should handle empty action configs array', () => {
      // Arrange
      const element = document.createElement('div');
      const actionConfigs: any[] = [];
      const handler = handleMultiPiClickAction(element, actionConfigs);
      const event = { detail: { action: 'tap' } } as ActionHandlerEvent;

      // Act
      handler.handleEvent(event);

      // Assert
      expect(fireEventStub.called).to.be.false;
    });

    it('should fire events for single config in array', () => {
      // Arrange
      const element = document.createElement('div');
      const actionConfigs = [
        {
          entity: 'light.living_room',
          tap_action: { action: 'toggle' },
          hold_action: { action: 'more-info' },
        },
      ] as ActionConfigParams[];
      const handler = handleMultiPiClickAction(element, actionConfigs);
      const event = { detail: { action: 'tap' } } as ActionHandlerEvent;

      // Act
      handler.handleEvent(event);

      // Assert
      expect(fireEventStub.calledOnce).to.be.true;
      expect(fireEventStub.firstCall.args[0]).to.equal(element);
      expect(fireEventStub.firstCall.args[1]).to.equal('hass-action');
      expect(fireEventStub.firstCall.args[2].config).to.deep.equal(
        actionConfigs[0],
      );
      expect(fireEventStub.firstCall.args[2].action).to.equal('tap');
    });
  });
});
