# Features

## Dashboard statistics

Four color-coded tiles show your key Pi-hole metrics:

- Total DNS Queries
- Queries Blocked
- Block Percentage
- Domains on Blocklists

![Dashboard statistics](assets/dashboard-stats.png)

## Additional metrics

- Client statistics (active clients, unique domains, unique clients, etc.)
- Performance data (cached queries, forwarded requests)
- Optional actions per metric (tap/hold/double-tap)

![Additional metrics](assets/additional-metrics.png)

![Additional metrics (wide)](assets/additional-metrics-wide.png)

## System metrics chart

Visualize CPU and memory usage over time (typically 24h), using recorder history.

- Chart auto-loads statistics data from Home Assistant’s recorder
- Customizable line styles via `chart.line_type`

![System metrics chart](assets/chart.gif)

See [Chart configuration](configuration/CHART.md).

## Direct controls

- Enable/disable filtering (plus group default when available)
- Pause ad-blocking for a configured duration (supports multiple Pi-holes)
- Maintenance action buttons (restart DNS, update gravity, flush ARP/logs)
- Optional custom actions for the buttons

![Pause ad-blocking](assets/pause.png)

![Control buttons](assets/control-buttons.png)

![Control buttons (wide)](assets/control-buttons-wide.png)

See [Pause configuration](configuration/PAUSE.md) and [Action configuration](configuration/ACTIONS.md).

## Version information

Shows installed and update versions for:

- Core
- Docker
- FTL
- Web interface
- Home Assistant integration

![Version information](assets/version-info.png)

![Updates](assets/updates.png)

## Status monitoring

- Running/paused status and “time remaining” when paused
- Update indicators when updates are available
- Optional diagnostic message count and smart badge interactions

![Block time remaining](assets/block-time.png)

![Diagnostics](assets/diagnostics.png)

## Interactive dashboard

- Custom actions for stats/info/controls/badge
- Section filtering and collapsible sections

![Collapsible sections](assets/collapse.png)

![Filtering](assets/filtering.png)

See [Sections, filtering, and ordering](configuration/SECTIONS.md).

## Multi Pi-hole support

Aggregates key stats and provides unified switches/controls.

See [Multi Pi-hole](MULTI-PIHOLE.md).

## Responsive layout

The card adapts to dashboard width on desktop and mobile.

![Responsive layout](assets/responsive-design.png)

![Responsive layout (mobile)](assets/responsive-design-mobile.png)
