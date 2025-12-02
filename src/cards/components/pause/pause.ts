import { HassUpdateMixin } from '@cards/mixins/hass-update-mixin';
import { isCollapsed } from '@common/collapsed-state';
import { formatSecondsToHuman, parseTimeToSeconds } from '@common/convert-time';
import { show } from '@common/show-section';
import { toggleSection } from '@common/toggle-section';
import { hasFeature } from '@config/feature';
import { handlePauseClick } from '@delegates/utils/pause-hole';
import { localize } from '@localize/localize';
import type { Config } from '@type/config';
import type { EntityInformation, PiHoleSetup } from '@type/types';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { pauseStyles } from './styles';

/**
 * Pi-hole pause component that handles pause duration selection and entity targeting
 */
export class PauseComponent extends HassUpdateMixin(LitElement) {
  @property({ attribute: false })
  setup!: PiHoleSetup;

  @property({ attribute: false })
  config!: Config;

  @state()
  private selectedEntityId: string = '';

  static override get styles() {
    return pauseStyles;
  }

  private get allSwitches(): EntityInformation[] {
    return this.setup.holes.flatMap((hole) => hole.switches);
  }

  private get pauseDurations(): number[] {
    const durations = this.config.pause_durations ?? [60, 300, 900];
    return durations.map(parseTimeToSeconds);
  }

  private get isGroupPausingEnabled(): boolean {
    return !hasFeature(this.config, 'disable_group_pausing');
  }

  private get pauseCollapsed(): boolean {
    return isCollapsed(this.config, 'pause');
  }

  private _handleSelectChange(e: CustomEvent) {
    this.selectedEntityId = (e.target as any).value;
  }

  private _handlePauseClick = (seconds: number) => {
    const targetEntityId = this.isGroupPausingEnabled
      ? this.selectedEntityId
      : undefined;
    handlePauseClick(
      this.hass!,
      this.setup,
      seconds,
      this.config,
      targetEntityId,
    );
  };

  private _renderPauseButtons() {
    return html`
      <div class="pause-buttons">
        ${this.pauseDurations.map(
          (seconds) => html`
            <mwc-button @click=${() => this._handlePauseClick(seconds)}>
              ${formatSecondsToHuman(seconds, this.hass!)}
            </mwc-button>
          `,
        )}
      </div>
    `;
  }

  private _renderSwitchSelector() {
    if (!this.isGroupPausingEnabled || this.allSwitches.length === 0) {
      return nothing;
    }

    // Set default selection if none is selected
    if (!this.selectedEntityId && this.allSwitches.length > 0) {
      this.selectedEntityId = this.allSwitches[0]?.entity_id || '';
    }

    return html`
      <div class="pause-controls">
        <ha-select
          .label=${localize(this.hass!, 'card.ui.select_pi_or_group')}
          .value=${this.selectedEntityId}
          @selected=${this._handleSelectChange}
          fixedMenuPosition
          naturalMenuWidth
        >
          ${this.allSwitches.map(
            (switchEntity) => html`
              <ha-list-item .value=${switchEntity.entity_id}>
                ${switchEntity.attributes.friendly_name ||
                switchEntity.entity_id}
              </ha-list-item>
            `,
          )}
        </ha-select>
      </div>
    `;
  }

  override render(): TemplateResult | typeof nothing {
    if (!this.hass || !show(this.config, 'pause')) {
      return nothing;
    }

    return html`
      <div class="collapsible-section">
        <div
          class="section-header"
          @click=${(e: Event) => toggleSection(e, '.pause')}
        >
          <span>${localize(this.hass, 'card.sections.pause')}</span>
          <ha-icon
            class="caret-icon"
            icon="mdi:chevron-${this.pauseCollapsed ? 'right' : 'down'}"
          ></ha-icon>
        </div>
        <div class="pause ${this.pauseCollapsed ? 'hidden' : ''}">
          ${this._renderSwitchSelector()} ${this._renderPauseButtons()}
        </div>
      </div>
    `;
  }
}
