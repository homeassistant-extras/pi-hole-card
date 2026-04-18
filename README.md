# Pi-hole Card

_Complete Pi-hole monitoring and control for Home Assistant_

![Pi-hole Card](docs/assets/pihole-card.png)

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

## Overview

A dashboard card for managing and monitoring your Pi-hole DNS ad blocker from Home Assistant: statistics, controls, diagnostics, and optional system metrics.

## Documentation

**Full documentation is available at: [homeassistant-extras.github.io/pi-hole-card](https://homeassistant-extras.github.io/pi-hole-card/)**

## Quick Start

```yaml
type: custom:pi-hole
device_id: your_pihole_device_id
```

The card discovers Pi-hole entities from your configured device(s). For multiple instances, use a list under `device_id`; see the [configuration guide](docs/CONFIGURATION.md).

## Installation

> [!WARNING]  
> You need a working Pi-hole integration in Home Assistant (recommended: [Pi-hole v6 integration](https://github.com/bastgau/ha-pi-hole-v6)). Details: [docs/INSTALLATION.md](docs/INSTALLATION.md).

### HACS (Recommended)

[![HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=homeassistant-extras&repository=pi-hole-card&category=dashboard)

1. Open HACS in your Home Assistant instance
2. Click the menu icon and select "Custom repositories"
3. Add: `https://github.com/homeassistant-extras/pi-hole-card`
4. Select "Dashboard" as the category
5. Click "Install"

### Manual Installation

1. Download `pi-hole-card.js` from the [latest release](https://github.com/homeassistant-extras/pi-hole-card/releases)
2. Copy to `www/community/pi-hole-card/`
3. Add to your `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/community/pi-hole-card/pi-hole-card.js
      type: module
```

## Contributing

- [Join the Discussions](https://github.com/homeassistant-extras/pi-hole-card/discussions) - Share your insights, provide feedback, or ask questions
- [Report Issues](https://github.com/homeassistant-extras/pi-hole-card/issues) - Submit bugs or feature requests
- [Submit Pull Requests](https://github.com/homeassistant-extras/pi-hole-card/blob/main/CONTRIBUTING.md) - Review open PRs and submit your own
- [Check out Discord](https://discord.gg/NpH4Pt8Jmr) - Need further help, have ideas, want to chat?
- [Check out my other cards!](https://github.com/orgs/homeassistant-extras/repositories)

## Translations

Want to contribute a language? See [TRANSLATIONS.md](TRANSLATIONS.md).

## License

This project is protected under the MIT License. For more details, refer to the [LICENSE](LICENSE) file.

## Acknowledgments

- Built using [LitElement](https://lit.dev/)
- Inspired by Pi-hole's own dashboard design
- Thanks to all contributors!

[![contributors](https://contrib.rocks/image?repo=homeassistant-extras/pi-hole-card)](https://github.com/homeassistant-extras/pi-hole-card/graphs/contributors)

[![ko-fi](https://img.shields.io/badge/buy%20me%20a%20coffee-72A5F2?style=for-the-badge&logo=kofi&logoColor=white)](https://ko-fi.com/N4N71AQZQG)

## Project roadmap and community appreciation

- [x] **`Initial design`**: create initial card design
- [x] **`Auto-discovery`**: automatic detection of Pi-hole entities
- [x] **`Dashboard statistics`**: visual representation of key metrics
- [x] **`Control buttons`**: quick actions for common Pi-hole tasks
- [x] **`Version info`**: display component versions and updates - thanks @IIIdefconIII!
- [x] **`Custom actions`**: tap/hold/double-tap actions for all elements - thanks @dunxd
- [x] **`Card customization`**: custom title and icon options
- [x] **`Performance optimizations`**: improved code structure and efficiency
- [x] **`Enhanced entity mapping`**: **⭐ First contributor ⭐** better entity identification with translation keys - thanks @bastgau
- [x] **`Translations`**: ability to add translations - thanks @ajavibp
- [x] **`Multi-Pi-hole support`**: manage and monitor multiple Pi-hole instances - thanks @Drudoo, @heylers, @mtwhitley
- [x] **`Collapsible sections`**: collapse/expand card sections to save space - thanks @Teleportist
- [x] **`Additional visualization options`**: using HA native more-info, etc. - thanks @dunxd
- [x] **`Pause ad-blocking`**: temporarily disable filtering for specified durations - thanks @StuartHaire, @VVRud, @ccpk1
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
