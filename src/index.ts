import { PiHoleCard } from '@cards/card';
import { SystemMetricsGraph } from '@cards/components/graph/system-metrics-graph';
import { PauseComponent } from '@cards/components/pause/pause';
import { PiHoleCardEditor } from '@cards/editor';
import { version } from '../package.json';

// Register the custom elements with the browser
customElements.define('pi-hole', PiHoleCard);
customElements.define('pi-hole-editor', PiHoleCardEditor);
customElements.define('pause-component', PauseComponent);
customElements.define('system-metrics-graph', SystemMetricsGraph);

// Ensure the customCards array exists on the window object
window.customCards = window.customCards || [];

// Register the cards with Home Assistant's custom card registry
window.customCards.push({
  // Unique identifier for the card type
  type: 'pi-hole',

  // Display name in the UI
  name: 'Pi-hole Card',

  // Card description for the UI
  description: 'A card to summarize and control your Pi-hole instance.',

  // Show a preview of the card in the UI
  preview: true,

  // URL for the card's documentation
  documentationURL: 'https://github.com/homeassistant-extras/pi-hole-card',
});

console.info(`%c🐱 Poat's Tools: pi-hole-card - ${version}`, 'color: #CFC493;');
