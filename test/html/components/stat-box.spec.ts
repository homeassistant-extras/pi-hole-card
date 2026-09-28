import * as actionHandlerModule from '@delegates/action-handler-delegate';
import * as formatNumberModule from '@homeassistant-extras/hass/common/number/format_number';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { createStatBox } from '@html/components/stat-box';
import * as localizeModule from '@localize/localize';
import { fixture } from '@open-wc/testing-helpers';
import type { SectionConfig, StatBoxConfig } from '@type/config';
import type { EntityInformation } from '@type/types';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';
import { restore, stub } from 'sinon';

describe('stat-box.ts', () => {
  let mockElement: HTMLElement;
  let mockHass: HomeAssistant;
  let mockEntity: EntityInformation;
  let mockSectionConfig: SectionConfig;
  let mockStatBoxConfig: StatBoxConfig;
  let actionHandlerStub: sinon.SinonStub;
  let handleClickActionStub: sinon.SinonStub;
  let formatNumberStub: sinon.SinonStub;
  let localizeStub: sinon.SinonStub;

  beforeEach(() => {
    // Create mock element and configs
    mockElement = document.createElement('div');
    mockHass = {
      language: 'en',
    } as HomeAssistant;
    mockSectionConfig = {
      tap_action: { action: 'more-info' },
      hold_action: { action: 'toggle' },
    };
    mockEntity = {
      entity_id: 'sensor.test_entity',
      state: '123',
      last_changed: '2024-01-01T00:00:00.000Z',
      last_updated: '2024-01-01T00:00:00.000Z',
      attributes: { friendly_name: 'Test Entity' },
      translation_key: 'test_key',
    };

    // Create default StatBoxConfig
    mockStatBoxConfig = {
      title: 'card.stats.total_queries',
      footer: 'card.stats.manage_lists',
      className: 'queries-box',
      icon: 'mdi:earth',
    };

    // Create stubs for action handlers
    actionHandlerStub = stub(actionHandlerModule, 'actionHandler').returns({});
    handleClickActionStub = stub(
      actionHandlerModule,
      'handleClickAction',
    ).returns({
      handleEvent: () => {},
    });

    // Create stub for formatNumber
    formatNumberStub = stub(formatNumberModule, 'formatNumber');
    formatNumberStub.callsFake((value) => {
      // Simple mock implementation for test cases
      if (value === '1234') return '1,234';
      if (value === '1234.56') return '1,234.6';
      if (value === '0.123') return '0.1';
      if (value === '1000000') return '1,000,000';
      return value; // Default return the input value
    });

    // Create stub for localize
    localizeStub = stub(localizeModule, 'localize');
    localizeStub.callsFake((hass, key) => {
      // Simple mock implementation - return a predictable string based on key
      if (key === 'card.stats.total_queries') return 'Total Queries';
      if (key === 'card.stats.active_clients') return 'Active Clients';
      if (key === 'card.stats.list_blocked_queries')
        return 'List Blocked Queries';
      // For footer texts
      if (key === 'card.stats.manage_lists') return 'Manage Lists';

      // Default fallback for other keys
      return `Localized: ${key}`;
    });
  });

  afterEach(() => {
    // Restore all stubs
    restore();
  });

  it('should handle complex footer object with replacement', async () => {
    // Create test config with Translation object for footer
    const configWithComplexFooter: StatBoxConfig = {
      ...mockStatBoxConfig,
      footer: {
        key: 'card.stats.active_clients',
        search: '{number}',
        replace: '42',
      },
    };

    // Call createStatBox function
    const result = createStatBox(
      mockElement,
      mockHass,
      mockEntity,
      mockSectionConfig,
      configWithComplexFooter,
    );

    // Render the template
    await fixture(result as TemplateResult);

    // Verify localize was called with the complex params
    expect(
      localizeStub.calledWith(
        mockHass,
        'card.stats.active_clients',
        '{number}',
        '42',
      ),
    ).to.be.true;
  });

  it('should handle string footer text with translation', async () => {
    // Call createStatBox function with string footer
    const result = createStatBox(
      mockElement,
      mockHass,
      mockEntity,
      mockSectionConfig,
      mockStatBoxConfig,
    );

    // Render the template
    const el = await fixture(result as TemplateResult);

    // Title should be localized
    expect(localizeStub.calledWith(mockHass, mockStatBoxConfig.title)).to.be
      .true;

    // Footer text should be passed to localize since it's a translation key
    expect(localizeStub.calledWith(mockHass, mockStatBoxConfig.footer)).to.be
      .true;

    // Footer section should have the localized string
    const footerEl = el.querySelector('.stat-footer span');
    expect(footerEl).to.exist;
    expect(footerEl?.textContent?.trim()).to.equal('Manage Lists');
  });

  it('should handle missing entity data', () => {
    const result = createStatBox(
      mockElement,
      mockHass,
      undefined,
      mockSectionConfig,
      mockStatBoxConfig,
    );

    expect(result).to.equal(nothing);
  });

  it('should format numeric values properly', async () => {
    // Test with various numeric values
    const testCases = [
      { state: '1234', expected: '1,234' },
      { state: '1234.56', expected: '1,234.6' },
      { state: '0.123', expected: '0.1' },
      { state: '1000000', expected: '1,000,000' },
    ];

    for (const testCase of testCases) {
      // Create entity with test state
      const entity = {
        ...mockEntity,
        state: testCase.state,
      };

      const result = createStatBox(
        mockElement,
        mockHass,
        entity,
        mockSectionConfig,
        mockStatBoxConfig,
      );

      // Render the template
      const el = await fixture(result as TemplateResult);

      // Check that the value is properly formatted
      const valueEl = el.querySelector('.stat-value');
      expect(valueEl?.textContent?.trim()).to.equal(testCase.expected);
    }
  });

  it('should handle missing section config', async () => {
    // Call with undefined section config
    const result = createStatBox(
      mockElement,
      mockHass,
      mockEntity,
      undefined,
      mockStatBoxConfig,
    );

    // Render the template
    await fixture(result as TemplateResult);

    // Should still render, but action handlers should be called with undefined
    expect(actionHandlerStub.calledWith(undefined)).to.be.true;
    expect(handleClickActionStub.calledWith(mockElement, undefined, mockEntity))
      .to.be.true;
  });

  it('should add percentage symbol when unit_of_measurement is %', async () => {
    // Create config for percentage box
    const percentConfig: StatBoxConfig = {
      title: 'card.stats.percentage_blocked',
      footer: 'card.stats.list_all_queries',
      className: 'percentage-box',
      icon: 'mdi:chart-pie',
    };

    // Create entity with percent unit
    const percentEntity = {
      ...mockEntity,
      state: '45.6',
      last_changed: '2024-01-01T00:00:00.000Z',
      last_updated: '2024-01-01T00:00:00.000Z',
      attributes: {
        ...mockEntity.attributes,
        unit_of_measurement: '%',
      },
    };

    const result = createStatBox(
      mockElement,
      mockHass,
      percentEntity,
      mockSectionConfig,
      percentConfig,
    );

    // Render the template
    const el = await fixture(result as TemplateResult);

    // Check that the value includes the percentage symbol
    const valueEl = el.querySelector('.stat-value');
    expect(valueEl).to.exist;
    expect(valueEl?.textContent?.trim()).to.equal('45.6%');
  });

  it('should apply the correct CSS class', async () => {
    // Create config with specific class
    const configWithClass: StatBoxConfig = {
      ...mockStatBoxConfig,
      className: 'custom-test-class',
    };

    const result = createStatBox(
      mockElement,
      mockHass,
      mockEntity,
      mockSectionConfig,
      configWithClass,
    );

    // Render the template
    const el = await fixture(result as TemplateResult);

    // Check that the box has the correct class
    expect(el.classList.contains('stat-box')).to.be.true;
    expect(el.classList.contains('custom-test-class')).to.be.true;
  });

  it('should display the correct icon', async () => {
    // Create config with specific icon
    const configWithIcon: StatBoxConfig = {
      ...mockStatBoxConfig,
      icon: 'mdi:custom-test-icon',
    };

    const result = createStatBox(
      mockElement,
      mockHass,
      mockEntity,
      mockSectionConfig,
      configWithIcon,
    );

    // Render the template
    const el = await fixture(result as TemplateResult);

    // Check that the icon is correctly applied
    const iconEl = el.querySelector('.stat-icon ha-icon');
    expect(iconEl).to.exist;
    expect(iconEl?.getAttribute('icon')).to.equal('mdi:custom-test-icon');
  });
});
