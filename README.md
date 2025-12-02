# Pi-hole Card

<p align="center">
    <img src="assets/pihole-card.png" align="center" width="50%">
</p>
<p align="center"><h1 align="center">Pi-hole Card</h1></p>
<p align="center">
  <em>Complete Pi-hole monitoring and control for Home Assistant</em>
</p>

![Home Assistant](https://img.shields.io/badge/home%20assistant-%2341BDF5.svg?style=for-the-badge&logo=home-assistant&logoColor=white)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)

![GitHub Release](https://img.shields.io/github/v/release/homeassistant-extras/pi-hole-card?style=for-the-badge&logo=github)
![GitHub Pre-Release](https://img.shields.io/github/v/release/homeassistant-extras/pi-hole-card?include_prereleases&style=for-the-badge&logo=github&label=PRERELEASE)
![GitHub Tag](https://img.shields.io/github/v/tag/homeassistant-extras/pi-hole-card?style=for-the-badge&color=yellow)
![GitHub branch status](https://img.shields.io/github/checks-status/homeassistant-extras/pi-hole-card/main?style=for-the-badge)

![stars](https://img.shields.io/github/stars/homeassistant-extras/pi-hole-card.svg?style=for-the-badge)
![home](https://img.shields.io/github/last-commit/homeassistant-extras/pi-hole-card.svg?style=for-the-badge)
![commits](https://img.shields.io/github/commit-activity/y/homeassistant-extras/pi-hole-card?style=for-the-badge)
![license](https://img.shields.io/github/license/homeassistant-extras/pi-hole-card?style=for-the-badge&logo=opensourceinitiative&logoColor=white&color=0080ff)

<p align="center">Built with the tools and technologies:</p>
<p align="center">
  <img src="https://img.shields.io/badge/npm-CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="npm">
  <img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=for-the-badge&logo=Prettier&logoColor=black" alt="Prettier">
  <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=for-the-badge&logo=GitHub-Actions&logoColor=white" alt="GitHub%20Actions">
  <img src="https://img.shields.io/badge/Lit-324FFF.svg?style=for-the-badge&logo=Lit&logoColor=white" alt="Lit">
</p>
<br>

## Overview

A comprehensive dashboard card for managing and monitoring your Pi-hole DNS ad blocker directly from Home Assistant. The card provides real-time statistics and controls in an intuitive, dashboard-style interface that matches the Pi-hole visual identity.

## Features

### Dashboard Statistics

- **Main Statistics Dashboard** - Four color-coded tiles showing your most important Pi-hole metrics:
  - Total DNS Queries
  - Queries Blocked
  - Block Percentage
  - Domains on Blocklists

![Dashboard Statistics](assets/dashboard-stats.png)

### Additional Metrics

- **Client Statistics** - See active clients, unique domains, unique clients, etc.
- **Performance Data** - View cached queries and forwarded DNS requests
- **Interactive Elements** - Configurable tap, hold, and double-tap actions for all metrics

![Additional Metrics](assets/additional-metrics.png)

![Additional Metrics](assets/additional-metrics-wide.png)

### System Metrics Chart

- **CPU and Memory Usage Graph** - Visualize your Pi-hole's system resource usage over the last 24 hours:
  - Real-time CPU usage tracking
  - Memory consumption monitoring
  - Historical data visualization
  - Customizable line styles (normal, gradient, no fill)
- **Automatic Data Fetching** - Chart automatically loads statistics data from Home Assistant's recorder
- **Responsive Design** - Chart adapts to card width and displays smoothly on all devices

![Chart](assets/chart.gif)

### Direct Controls

- **Enable/Disable Controls** - Toggle Pi-hole filtering with a single click as well as Group Default
- **Pause Ad-Blocking** - Temporarily disable filtering for a specified duration:
  - Configurable durations (default: 60s, 5min, 15min)
  - Automatically re-enables filtering after time expires
  - Shows remaining time until blocking resumes
  - Pause multiple Pi-holes if configured
- **Action Buttons** - Quick access buttons for common maintenance tasks:
  - Restart DNS
  - Update Gravity
  - Flush ARP
  - Flush Logs
- **Customizable Actions** - Configure custom actions for the control buttons in this section

![Pause Ad-Blocking](assets/pause.png)

![Control Buttons](assets/control-buttons.png)

![Control Buttons](assets/control-buttons-wide.png)

### Version Information

- **Component Versions** - Display installed versions for all Pi-hole components:
  - Core
  - Docker
  - FTL
  - Web Interface
  - Home Assistant Integration
  - Last Refresh Time

![Version Information](assets/version-info.png)

### Status Monitoring

- **Real-time Status** - Visual indication of Pi-hole's current state
- **Error Detection** - Automatic highlighting when issues are detected
- **Update Indicators** - Clear notification when updates are available
- **Block Time Remaining** - Shows remaining time until ad-blocking resumes when paused
- **FTL Diagnostic Message Count** - Shows diagnostic message count when more than 0
- **Interactive Diagnostic Management** - Smart icon behavior based on diagnostic message count:
  - **When diagnostic messages exist**: Tap to purge diagnostic messages, hold/double-tap for more info
  - **When no diagnostic messages**: All interactions show more info about the diagnostic entity
  - **Custom Actions**: Override default behavior with custom tap, hold, and double-tap actions

![block-time](assets/block-time.png)

![diagnostics](assets/diagnostics.png)

### Interactive Dashboard

- **Clickable Elements** - All sections can be configured with custom actions
- **Visual Indicators** - Color-coded statistics to understand status at a glance
- **Customizable Card** - Set custom title and icon to match your dashboard style
- **Entity Filtering** - Ability to exclude specific entities or entire sections
- **Collapsible Sections** - Ability to collapse/expand sections to save space:
  - Switches section (on/off toggles)
  - Actions section (control buttons)
  - Pause section (pause durations)

![collapse](assets/collapse.png)

![filtering](assets/filtering.png)

### Multi-Pi-hole Support

- **Centralized Control** - Manage multiple Pi-hole instances from a single card
- **Aggregated Status** - See at a glance how many of your Pi-holes are active
- **Unified Control** - Centralized access to all switches from your Pi-hole instances
- **Intelligent Status Indicators** - Status automatically adjusts based on collective state:
  - Shows "Running" when all instances are active
  - Shows "Partial" when some instances are active and some are inactive
  - Shows count of active instances (e.g., "2/3")

Example of Partial
![Multi Pi-hole Status](assets/multi-pihole-partial.png)

Example of all Running
![Multi Pi-hole All Running](assets/multi-pihole-running.png)

> [!NOTE]  
> The multi-Pi-hole feature currently has some limitations:
>
> - Statistics shown are from the first Pi-hole in the list only
> - All switches from all Pi-holes are displayed in a single list
> - Only header status reflects the multi-Pi-hole state

### Responsive Design

- **Mobile-friendly** - Optimized layout for both desktop and mobile viewing
- **Fluid Layout** - Responsive design adapts to available space

![Responsive Design](assets/responsive-design.png)
![Responsive Design](assets/responsive-design-mobile.png)

## Installation

### Prerequisites

> [!WARNING]  
> Before using this card, please ensure you have the [Pi-hole v6 integration](https://github.com/bastgau/ha-pi-hole-v6) installed in your Home Assistant instance.

### HACS (Recommended)

[![HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=homeassistant-extras&repository=pi-hole-card&category=dashboard)

1. Open HACS in your Home Assistant instance
2. Click the menu icon in the top right and select "Custom repositories"
3. Add this repository URL and select "Dashboard" as the category
   - `https://github.com/homeassistant-extras/pi-hole-card`
4. Click "Install"

### Manual Installation

1. Download the `pi-hole-card.js` file from the latest release in the Releases tab.
2. Copy it to your `www/community/pi-hole-card/` folder
3. Add the following to your `configuration.yaml` (or add as a resource in dashboards menu)

```yaml
lovelace:
  resources:
    - url: /local/community/pi-hole-card/pi-hole-card.js
      type: module
```

## Usage

Add the card to your dashboard using the UI editor or YAML:

### Card Editor

The card is fully configurable through the card editor, allowing you to customize:

- Pi-hole device selection (single or multiple)
- Card title and icon
- Custom actions for statistics, info panels, and control buttons

![editor](assets/editor.png)

### YAML

This is the most minimal configuration needed to get started:

```yaml
type: custom:pi-hole
device_id: your_pihole_device_id
```

For multiple Pi-hole instances:

```yaml
type: custom:pi-hole
device_id:
  - your_first_pihole_device_id
  - your_second_pihole_device_id
  - etc..
```

The card will automatically:

- Detect all Pi-hole entities associated with the device(s)
- Organize statistics in the dashboard layout
- Display control buttons for common actions
- Show version information for all components
- For multiple Pi-holes: combine switches and show aggregated status

### Finding Your Device ID

If you're unsure what your Pi-hole device ID is, here are several ways to find it:

#### Method 1: Use the Card Editor (Recommended)

1. Add the card through the visual editor
2. Select your Pi-hole device from the dropdown
3. Click "Show Code Editor" or "View YAML" to see the generated configuration
4. Copy the `device_id` value for use in manual YAML configuration

#### Method 2: Devices Page

1. Go to **Settings** → **Devices & Services** → **Devices**
2. Search for "Pi-hole" or browse to find your Pi-hole device
3. Click on the device and look at the URL - the device ID will be in the URL path

## Configuration Options

| Name               | Type            | Default      | Description                                                        |
| ------------------ | --------------- | ------------ | ------------------------------------------------------------------ |
| device_id          | string or array | **Required** | The ID(s) of your Pi-hole device(s) in Home Assistant              |
| title              | string          | Pi-Hole      | Custom title for the card header                                   |
| icon               | string          | mdi:pi-hole  | Custom icon for the card header                                    |
| badge              | object          | _none_       | Configure actions for the card icon/badge                          |
| pause_durations    | array           | [60,300,900] | Durations for pause buttons (supports numbers, strings with units) |
| stats              | object          | _none_       | Configure actions for statistics tiles                             |
| info               | object          | _none_       | Configure actions for additional info items                        |
| controls           | object          | _none_       | Configure actions for control buttons                              |
| exclude_sections   | list            | _none_       | Sections of entities to exclude. See below.                        |
| exclude_entities   | list            | _none_       | Entities to remove from the card.                                  |
| entity_order       | list            | _none_       | Custom order for switch, button, sensor entities or dividers.      |
| collapsed_sections | list            | _none_       | Sections to be initially collapsed. See below.                     |
| switch_spacing     | string          | flex         | Layout style for switches: flex, space-around, space-between       |
| chart              | object          | _none_       | Chart configuration options. See below.                            |
| features           | list            | See below    | Optional flags to toggle different features                        |

### Action Configuration

Each section (stats, info, controls) supports the following action types:

| Name              | Type   | Default    | Description                          |
| ----------------- | ------ | ---------- | ------------------------------------ |
| tap_action        | object | _optional_ | Action to perform when tapped        |
| hold_action       | object | _optional_ | Action to perform when held          |
| double_tap_action | object | _optional_ | Action to perform when double-tapped |

Actions can be configured to perform various operations such as:

- Toggle entities
- Show more info
- Call services
- Navigate to different views
- And more!

### Section Options

The following section names can be used with `exclude_sections`:

- actions
- chart
- footer
- header
- pause
- statistics
- sensors
- switches

### Collapse Options

The following section names can be used with `collapsed_sections`:

- actions
- switches
- pause

### Switch Spacing Options

The `switch_spacing` option controls how switches are arranged in the switches section:

- flex (default): Switches flow naturally with standard flexbox behavior
- space-around: Equal space around each switch
- space-between: Maximum space between switches, no space at edges

### Chart Configuration

The `chart` option allows you to customize the appearance of the system metrics chart:

| Name      | Type   | Default | Description                                                                    |
| --------- | ------ | ------- | ------------------------------------------------------------------------------ |
| line_type | string | normal  | Chart line style. Options: `normal`, `gradient`, `gradient_no_fill`, `no_fill` |

**Chart Line Types:**

- `normal` (default): Standard solid lines with filled areas
- `gradient`: Gradient-colored lines with gradient-filled areas
- `gradient_no_fill`: Gradient-colored lines without fill
- `no_fill`: Solid lines without fill areas

### Auto-discovery

The card automatically discovers and identifies all Pi-hole entities based on:

- Entity naming patterns
- Translation keys
- Entity relationships to the device

This includes sensors, buttons, switches, binary sensors, and update entities.

## Example Configurations

### Basic Configuration

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
```

### Multiple Pi-hole Configuration

```yaml
type: custom:pi-hole
device_id:
  - pi_hole_device_1
  - pi_hole_device_2
title: 'My Pi-hole Network'
```

### With Custom Title and Icon

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
title: 'My Pi-hole Server'
icon: 'mdi:shield-check'
```

### With Custom Pause Durations

The `pause_durations` configuration supports various formats for specifying time:

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
pause_durations:
  - 60 # 1 minute
  - 300 # 5 minutes
  - 10s # 10 seconds
  - 5m # 5 minutes
  - 1h # 1 hour
  - '4h:20m:69s' # 15669 seconds (complex format)
```

**Supported time formats:**

- **Numbers**: Interpreted as seconds (e.g., `300` = 5 minutes)
- **Number strings**: Quoted numbers treated as seconds (e.g., `"60"` = 1 minute)
- **Simple units**: Time with single unit (e.g., `"10s"`, `"5m"`, `"1h"`)
- **Complex format**: Colon-separated with units (e.g., `"1h:30m:45s"`)

The UI will automatically display these in human-readable format (e.g., "5 minutes", "1 hour").

![Pause Ad-Blocking](assets/custom-pause.png)

## Feature Flags

Use feature flags to customize card behavior:

```yaml
features:
  - disable_group_pausing
```

| Feature               | Description                   |
| --------------------- | ----------------------------- |
| disable_group_pausing | Disable group pausing feature |

### Group Pausing Feature

The group pausing feature is **enabled by default**. When enabled, the pause section will show a dropdown to select which pi or client group to pause, allowing you to pause individual instances or client groups. This is useful for targeting specific Pi-hole instances or client groups.

![group-pause](assets/group-pause.gif)

When enabled you can pause the Pi instance as well

![pi-pause](assets/pi-pause.gif)

> [!NOTE]  
> **Prerequisites**: This feature requires the [Pi-hole v6 integration](https://github.com/bastgau/ha-pi-hole-v6) to be installed in your Home Assistant instance.

> [!WARNING]  
> **HA Core Integration**: This feature has not been tested with the Home Assistant Core Pi-hole integration and may not work as expected.

To disable the group pausing feature and use the legacy device-based service call (which pauses all Pi-hole devices). This is reccomended for multi-pi situations:

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
features:
  - disable_group_pausing
```

### Excluding Sections & Entities

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
exclude_sections:
  - sensors
  - switches
exclude_entities:
  - button.pi_hole_action_refresh_data
  - sensor.pi_hole_latest_data_refresh
```

### With Custom Actions

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
title: 'Network Protection'
stats:
  tap_action:
    action: more-info
  hold_action:
    action: navigate
    navigation_path: /lovelace/network
controls:
  tap_action:
    action: toggle
  hold_action:
    action: more-info
```

### With Custom Badge Actions

The card icon/badge supports custom actions that can override the default diagnostic message behavior:

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
badge:
  tap_action:
    action: navigate
    navigation_path: /lovelace/pi-hole-dashboard
  hold_action:
    action: call-service
    perform_action: browser_mod.popup
    data:
      title: Pi-hole Status
      content: 'Quick overview of Pi-hole status'
  double_tap_action:
    action: more-info
    entity_id: sensor.pi_hole_status
```

### With Switch Toggle and Pause Actions

For quick Pi-hole control, you can configure the badge to toggle the main switch on tap and pause for 30 seconds on hold:

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
badge:
  tap_action:
    action: perform-action
    perform_action: switch.toggle
    target:
      entity_id: switch.pi_hole
  hold_action:
    action: perform-action
    perform_action: pi_hole_v6.disable
    data:
      device_id: pi_hole_device_1
      duration: '00:00:30'
  double_tap_action:
    action: more-info
    entity_id: switch.pi_hole
```

> [!NOTE]  
> **Default Badge Behavior**: If no custom `badge` actions are configured, the card will automatically:
>
> - **Tap**: Purge diagnostic messages (when messages exist) or show more info (when no messages)
> - **Hold/Double-tap**: Show more info about the diagnostic message entity
>
> **Requirements**: Both `purge_diagnosis_messages` and `info_message_count` entities must be enabled for the default behavior to work.

> [!WARNING]  
> **Multi-Pi-hole Action Behavior**: When using multiple Pi-hole instances, actions are executed for each configured Pi-hole. This can lead to unexpected behavior:
>
> - **More-info actions**: Only one dialog can be open at a time, so you may only see info for the first or last Pi-hole
> - **Navigation actions**: Multiple navigation attempts may conflict with each other
> - **Service calls**: Will be executed for all Pi-holes, which may or may not be desired
>
> Consider using single-entity actions or service calls with specific targeting when configuring multi-Pi-hole setups.

### Custom Actions for All Sections

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
# Configure stat box actions
stats:
  tap_action:
    action: call-service
    perform_action: browser_mod.popup
    data:
      title: Pi-hole Statistics
      content: 'Detailed view of Pi-hole stats'
  hold_action:
    action: navigate
    navigation_path: /lovelace/network-monitoring
# Configure additional info actions
info:
  tap_action:
    action: more-info
  double_tap_action:
    action: toggle
# Configure control button actions
controls:
  tap_action:
    action: toggle
  hold_action:
    action: more-info
  double_tap_action:
    action: call-service
    perform_action: browser_mod.popup
    data:
      title: Pi-hole Controls
      content: 'Advanced Pi-hole control panel'
```

### Custom Entity Order & Switch Spacing

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
switch_spacing: 'space-around'
entity_order:
  - button.pi_hole_action_refresh_data
  - sensor.pi_hole_dns_queries_today
  - sensor.pi_hole_ads_blocked_today
  - switch.pi_hole
```

### Entity Order with Dividers

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
entity_order:
  - button.pi_hole_action_refresh_data
  - divider
  - sensor.pi_hole_dns_queries_today
  - sensor.pi_hole_ads_blocked_today
  - divider
  - switch.pi_hole
```

![divider1](assets/divider-1.png)
![divider2](assets/divider-2.png)

### Collapsed Sections

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
collapsed_sections:
  - actions
  - switches
  - pause # Start with pause section collapsed
```

### Chart Configuration

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
chart:
  line_type: gradient # Options: normal, gradient, gradient_no_fill, no_fill
```

### Excluding Chart Section

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
exclude_sections:
  - chart # Hide the system metrics chart
```

## Project Roadmap

- [x] **`Initial design`**: create initial card design
- [x] **`Auto-discovery`**: automatic detection of Pi-hole entities
- [x] **`Dashboard statistics`**: visual representation of key metrics
- [x] **`Control buttons`**: quick actions for common Pi-hole tasks
- [x] **`Version info`**: display component versions
- [x] **`Custom actions`**: tap/hold/double-tap actions for all elements - thanks @dunxd
- [x] **`Card customization`**: custom title and icon options
- [x] **`Performance optimizations`**: improved code structure and efficiency
- [x] **`Enhanced entity mapping`**: **⭐ First contributor ⭐** better entity identification with translation keys - thanks @bastgau
- [x] **`Translations`**: ability to add translations - thanks @ajavibp
- [x] **`Multi-Pi-hole support`**: manage and monitor multiple Pi-hole instances - thanks @Drudoo
- [x] **`Collapsible sections`**: collapse/expand card sections to save space - thanks @Teleportist
- [x] **`Additional visualization options`**: using HA native more-info, etc. - thanks @dunxd
- [x] **`Pause ad-blocking`**: temporarily disable filtering for specified durations - thanks @StuartHaire, @VVRud
- [x] **`Entity ordering`**: customize the order of displayed entities - thanks @Teleportist
- [x] **`Section hiding`**: ability to disable sections or entities - thanks @pcnate, @bastgau, @Anto79-ops
- [x] **`Visual separators`**: add dividers for switches - thanks @Teleportist
- [x] **`Diagnostics info indicator`**: show diagnostic messages count - thanks @WalterPepeka
- [x] **`Greek translation`**: **⭐ Second contributor ⭐** added Greek language support - thanks @ChriZathens
- [x] **`Customizable badge actions`**: configurable tap/hold/double-tap actions for card badge - thanks @moshoari
- [x] **`Enhanced pause durations`**: flexible time formats and human-readable display for pause buttons - thanks @moshoari
- [x] **`Backwards compatibility`**: maintained Home Assistant integration backwards compatibility - thanks @ccheath, @ejpenney
- [x] **`Group pause feature`**: enhanced pause functionality with group support - thanks @bastgau
- [x] **`System metrics chart`**: visualize CPU and memory usage over time with customizable line styles - thanks me!

## Contributing

- **💬 [Join the Discussions](https://github.com/homeassistant-extras/pi-hole-card/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/homeassistant-extras/pi-hole-card/issues)**: Submit bugs found or log feature requests for the `pi-hole` project.
- **💡 [Submit Pull Requests](https://github.com/homeassistant-extras/pi-hole-card/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **📣 [Check out discord](https://discord.gg/NpH4Pt8Jmr)**: Need further help, have ideas, want to chat?
- **🃏 [Check out my other cards!](https://github.com/orgs/homeassistant-extras/repositories)** Maybe you have an integration that I made cards for.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/homeassistant-extras/pi-hole-card
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

## Translations

The Pi-hole card supports multiple languages to provide a better experience for users worldwide.

### Currently supported languages:

- English
- Spanish
- Greek
- Italian

Want to contribute a translation? See our [translation guide](TRANSLATIONS.md) for instructions.

## License

This project is protected under the MIT License. For more details, refer to the [LICENSE](LICENSE) file.

## Acknowledgments

- Built using [LitElement](https://lit.dev/)
- Inspired by Pi-hole's own dashboard design
- Thanks to all contributors!

[![contributors](https://contrib.rocks/image?repo=homeassistant-extras/pi-hole-card)](https://github.com/homeassistant-extras/pi-hole-card/graphs/contributors)

[![ko-fi](https://img.shields.io/badge/buy%20me%20a%20coffee-72A5F2?style=for-the-badge&logo=kofi&logoColor=white)](https://ko-fi.com/N4N71AQZQG)

## Code Quality

Forgive me and my badges..

Stats

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_pi-hole-card&metric=bugs)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_pi-hole-card)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_pi-hole-card&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_pi-hole-card)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_pi-hole-card&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_pi-hole-card)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_pi-hole-card&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_pi-hole-card)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_pi-hole-card&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_pi-hole-card)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_pi-hole-card&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_pi-hole-card)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_pi-hole-card&metric=coverage)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_pi-hole-card)

Ratings

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_pi-hole-card&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_pi-hole-card)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_pi-hole-card&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_pi-hole-card)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_pi-hole-card&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_pi-hole-card)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_pi-hole-card&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_pi-hole-card)

## Build Status

### Main

[![CodeQL](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/github-code-scanning/codeql)
[![Dependabot Updates](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/dependabot/dependabot-updates/badge.svg?branch=main)](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/dependabot/dependabot-updates)
[![Main Branch CI](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/main-ci.yaml/badge.svg?branch=main)](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/main-ci.yaml)
[![Fast Forward Check](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/pull_request.yaml/badge.svg?branch=main)](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/pull_request.yaml)

### Release

[![Release & Deploy](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/release-cd.yaml/badge.svg)](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/release-cd.yaml)
[![Merge](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/merge.yaml/badge.svg)](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/merge.yaml)

### Other

[![Issue assignment](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/assign.yaml/badge.svg)](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/assign.yaml)
[![Manual Release](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/manual-release.yaml/badge.svg)](https://github.com/homeassistant-extras/pi-hole-card/actions/workflows/manual-release.yaml)
