# Installation

## Prerequisites

> [!WARNING]
> Before using this card, please ensure you have the [Pi-hole v6 integration](https://github.com/bastgau/ha-pi-hole-v6) installed in your Home Assistant instance.

## HACS (Recommended)

[![HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=homeassistant-extras&repository=pi-hole-card&category=dashboard)

1. Open HACS in your Home Assistant instance
2. Click the menu icon in the top right and select "Custom repositories"
3. Add this repository URL and select "Dashboard" as the category
   - `https://github.com/homeassistant-extras/pi-hole-card`
4. Click "Install"

## Manual Installation

1. Download the `pi-hole-card.js` file from the latest release in the Releases tab.
2. Copy it to your `www/community/pi-hole-card/` folder
3. Add the following to your `configuration.yaml` (or add as a resource in dashboards menu)

```yaml
lovelace:
  resources:
    - url: /local/community/pi-hole-card/pi-hole-card.js
      type: module
```
