import { stateActive } from '@hass/common/entity/state_active';
import type { EntityInformation } from '@type/types';
import { type TemplateResult, html } from 'lit';

/**
 * Creates a version info item
 * @param entity - The entity information
 * @returns TemplateResult
 */
export const createVersionItem = (
  entity: EntityInformation,
): TemplateResult => {
  // super hacky - but too lazy to hardcode the names
  const label = entity.attributes.friendly_name.replace(' update', '');
  const hasUpdate = stateActive(entity as any, entity.state);
  const latestVersion = entity.attributes.latest_version;
  const installedVersion = entity.attributes.installed_version;

  return html`
    <div class="version-item ${hasUpdate ? 'update-available' : ''}">
      <span class="version-label">${label}</span>
      <a href="${entity.attributes.release_url}" target="_blank">
        <span class="version-text">
          ${installedVersion}
          ${hasUpdate && latestVersion
            ? html`<span class="version-separator"> → </span
                ><span class="version-latest">${latestVersion}</span>`
            : ''}
        </span>
      </a>
    </div>
  `;
};
