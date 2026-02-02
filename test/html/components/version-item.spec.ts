import { createVersionItem } from '@html/components/version-item';
import { fixture } from '@open-wc/testing-helpers';
import type { EntityInformation } from '@type/types';
import { expect } from 'chai';

describe('version-item.ts', () => {
  it('should render a version item with label, value, and GitHub link from entity', async () => {
    // Create test entity
    const entity: EntityInformation = {
      entity_id: 'update.pi_hole_core',
      state: 'on',
      translation_key: undefined,
      attributes: {
        friendly_name: 'Pi-hole Core update',
        installed_version: 'v1.2.3',
        release_url: 'https://github.com/test-org/test-repo/releases/v1.2.3',
      },
    };

    // Call createVersionItem function
    const result = createVersionItem(entity);

    // Render the template
    const el = await fixture(result);

    // Test assertions for the container
    expect(el.tagName.toLowerCase()).to.equal('div');
    expect(el.classList.contains('version-item')).to.be.true;

    // Test assertions for the label
    const labelEl = el.querySelector('.version-label');
    expect(labelEl).to.exist;
    expect(labelEl?.textContent).to.equal('Pi-hole Core');

    // Test assertions for the link
    const linkEl = el.querySelector('a');
    expect(linkEl).to.exist;
    expect(linkEl?.getAttribute('href')).to.equal(
      'https://github.com/test-org/test-repo/releases/v1.2.3',
    );
    expect(linkEl?.getAttribute('target')).to.equal('_blank');

    // Test assertions for the value inside the link
    const valueEl = linkEl?.querySelector('.version-text');
    expect(valueEl).to.exist;
    expect(valueEl?.textContent).to.equal('v1.2.3');
  });

  it('should add update-available class and show latest version when update is available', async () => {
    // Create test entity with update available
    const entity: EntityInformation = {
      entity_id: 'update.pi_hole_core',
      state: 'on',
      translation_key: undefined,
      attributes: {
        friendly_name: 'Pi-hole Core update',
        installed_version: 'v1.2.3',
        latest_version: 'v1.2.4',
        release_url: 'https://github.com/test-org/test-repo/releases/v1.2.4',
      },
    };

    // Call createVersionItem function
    const result = createVersionItem(entity);

    // Render the template
    const el = await fixture(result);

    // Test assertions for the container
    expect(el.classList.contains('version-item')).to.be.true;
    expect(el.classList.contains('update-available')).to.be.true;

    // Test assertions for the version text
    const versionTextEl = el.querySelector('.version-text');
    expect(versionTextEl).to.exist;
    expect(versionTextEl?.textContent).to.include('v1.2.3');
    expect(versionTextEl?.textContent).to.include('v1.2.4');

    // Test assertions for the latest version
    const latestVersionEl = el.querySelector('.version-latest');
    expect(latestVersionEl).to.exist;
    expect(latestVersionEl?.textContent).to.equal('v1.2.4');

    // Test assertions for the separator
    const separatorEl = el.querySelector('.version-separator');
    expect(separatorEl).to.exist;
    expect(separatorEl?.textContent).to.equal(' → ');
  });

  it('should not add update-available class when no update is available', async () => {
    // Create test entity with no update available (state is 'off')
    const entity: EntityInformation = {
      entity_id: 'update.pi_hole_core',
      state: 'off',
      translation_key: undefined,
      attributes: {
        friendly_name: 'Pi-hole Core update',
        installed_version: 'v1.2.3',
        latest_version: 'v1.2.3',
        release_url: 'https://github.com/test-org/test-repo/releases/v1.2.3',
      },
    };

    // Call createVersionItem function
    const result = createVersionItem(entity);

    // Render the template
    const el = await fixture(result);

    // Test assertions for the container
    expect(el.classList.contains('version-item')).to.be.true;
    expect(el.classList.contains('update-available')).to.be.false;

    // Test assertions - latest version should not be displayed
    const latestVersionEl = el.querySelector('.version-latest');
    expect(latestVersionEl).to.not.exist;

    // Test assertions - only installed version should be shown
    const versionTextEl = el.querySelector('.version-text');
    expect(versionTextEl).to.exist;
    expect(versionTextEl?.textContent).to.equal('v1.2.3');
  });
});
