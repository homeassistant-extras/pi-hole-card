import * as actionHandlerModule from '@delegates/action-handler-delegate';
import { createActionButton } from '@html/components/action-control';
import { fixture } from '@open-wc/testing-helpers';
import type { SectionConfig } from '@type/config';
import type { EntityInformation } from '@type/types';
import { expect } from 'chai';
import { type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('action-control.ts', () => {
  let actionHandlerStub: sinon.SinonStub;
  let handleClickActionStub: sinon.SinonStub;
  let mockElement: HTMLElement;
  let mockEntity: EntityInformation;
  let mockConfig: SectionConfig;

  beforeEach(() => {
    // Create stubs for action handler functions
    actionHandlerStub = stub(actionHandlerModule, 'actionHandler').returns({
      bind: () => {}, // Mock the bind method
      handleAction: () => {}, // Add any other methods that might be called
    });

    handleClickActionStub = stub(
      actionHandlerModule,
      'handleClickAction',
      // @ts-ignore
    ).returns(() => {});

    // Mock HTML element
    mockElement = document.createElement('div');

    mockConfig = {
      tap_action: {
        action: 'toggle',
      },
    };

    // Create a mock entity for testing
    mockEntity = {
      entity_id: 'button.test_action',
      state: 'on',
      last_changed: '2024-01-01T00:00:00.000Z',
      last_updated: '2024-01-01T00:00:00.000Z',
      translation_key: undefined,
      attributes: {
        friendly_name: 'Test Action',
      },
    };
  });

  afterEach(() => {
    // Restore all stubs
    actionHandlerStub.restore();
    handleClickActionStub.restore();
  });

  describe('createActionButton', () => {
    it('should render a button with the correct class', async () => {
      const result = createActionButton(
        mockElement,
        mockConfig,
        mockEntity,
        'primary',
      );

      const el = await fixture(result as TemplateResult);

      // Check that a mwc-button element is rendered
      expect(el.tagName.toLowerCase()).to.equal('mwc-button');

      // Check that the button has the correct CSS class
      expect(el.classList.contains('primary')).to.be.true;
    });

    it('should use empty class when buttonClass is not provided', async () => {
      const result = createActionButton(mockElement, mockConfig, mockEntity);

      const el = await fixture(result as TemplateResult);

      // Check that the button has an empty class attribute
      expect(el.className).to.equal('');
    });

    it('should use friendly_name as button label with replacements', async () => {
      // Test various friendly name patterns
      const namePatterns = [
        { original: 'Pihole- Update Gravity', expected: 'Update Gravity' },
        { original: 'Flush the Logs', expected: 'Flush Logs' },
        { original: 'Normal Name', expected: 'Normal Name' },
      ];

      for (const pattern of namePatterns) {
        const entityWithCustomName = {
          ...mockEntity,
          attributes: { friendly_name: pattern.original },
        };

        const result = createActionButton(
          mockElement,
          mockConfig,
          entityWithCustomName,
        );

        const el = await fixture(result as TemplateResult);
        expect(el.textContent?.trim()).to.equal(pattern.expected);
      }
    });

    it('should attach action handlers to the button', async () => {
      const result = createActionButton(mockElement, mockConfig, mockEntity);

      const el = await fixture(result as TemplateResult);

      // Check that actionHandler was called
      expect(actionHandlerStub.calledOnce).to.be.true;

      // Check that handleClickAction was called with the correct arguments
      expect(handleClickActionStub.calledOnce).to.be.true;
      expect(handleClickActionStub.firstCall.args[0]).to.equal(mockElement);
      expect(handleClickActionStub.firstCall.args[1]).to.equal(mockConfig);
      expect(handleClickActionStub.firstCall.args[2]).to.equal(mockEntity);

      // Verify action handler was attached to the button
      expect((el as any).actionHandler).to.exist;
    });

    it('should use the icon from entity attributes if available', async () => {
      const entityWithIcon = {
        ...mockEntity,
        attributes: {
          friendly_name: 'Test Action',
          icon: 'mdi:custom-icon',
        },
      };

      const result = createActionButton(
        mockElement,
        mockConfig,
        entityWithIcon,
      );

      const el = await fixture(result as TemplateResult);
      const iconEl = el.querySelector('ha-icon');

      expect(iconEl).to.exist;
      expect(iconEl?.getAttribute('icon')).to.equal('mdi:custom-icon');
    });

    it('should use default icons based on translation_key', async () => {
      const translationKeyIcons = [
        { key: 'action_flush_arp', expectedIcon: 'mdi:broom' },
        {
          key: 'action_flush_logs',
          expectedIcon: 'mdi:file-refresh-outline',
        },
        { key: 'action_gravity', expectedIcon: 'mdi:earth' },
        { key: 'action_restartdns', expectedIcon: 'mdi:restart' },
        { key: 'action_refresh_data', expectedIcon: 'mdi:refresh' },
        { key: 'unknown_action', expectedIcon: 'mdi:button-pointer' },
      ];

      for (const item of translationKeyIcons) {
        const entityWithTranslationKey = {
          ...mockEntity,
          translation_key: item.key,
        };

        const result = createActionButton(
          mockElement,
          mockConfig,
          entityWithTranslationKey,
        );

        const el = await fixture(result as TemplateResult);
        const iconEl = el.querySelector('ha-icon');

        expect(iconEl).to.exist;
        expect(iconEl?.getAttribute('icon')).to.equal(item.expectedIcon);
      }
    });
  });
});
