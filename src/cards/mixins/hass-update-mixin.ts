import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export interface HassUpdateEvent {
  hass: HomeAssistant;
}

export interface HassUpdateElement {
  hass?: HomeAssistant;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mixin constructor
export type Constructor<T = object> = new (...args: any[]) => T;

export const HassUpdateMixin = <T extends Constructor<LitElement>>(
  superClass: T,
) => {
  class HassUpdateClass extends superClass implements HassUpdateElement {
    @property({ attribute: false })
    public hass?: HomeAssistant;

    private readonly _boundHassUpdateHandler =
      this._handleHassUpdate.bind(this);

    override connectedCallback(): void {
      super.connectedCallback();
      globalThis.addEventListener('hass-update', this._boundHassUpdateHandler);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      globalThis.removeEventListener(
        'hass-update',
        this._boundHassUpdateHandler,
      );
    }

    private _handleHassUpdate(event: Event): void {
      const {
        detail: { hass },
      } = event as CustomEvent<HassUpdateEvent>;
      this.hass = hass;
    }
  }

  return HassUpdateClass;
};
