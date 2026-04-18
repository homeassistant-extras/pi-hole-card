# Sections, filtering, and ordering

## Section names

Use these section names with `exclude_sections`:

- actions
- chart
- footer
- header
- pause
- statistics
- sensors
- switches

## Collapsible sections

Use these section names with `collapsed_sections`:

- actions
- switches
- pause

Example:

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
collapsed_sections:
  - actions
  - switches
  - pause
```

![Collapsible sections](assets/collapse.png)

## Switch spacing

`switch_spacing` controls how switches are arranged:

- flex (default)
- space-around
- space-between

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
switch_spacing: space-around
```

## Excluding entities

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
exclude_entities:
  - button.pi_hole_action_refresh_data
  - sensor.pi_hole_latest_data_refresh
```

![Entity filtering](assets/filtering.png)

## Custom entity order

You can reorder entities and insert dividers:

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

![Dividers (example 1)](assets/divider-1.png)

![Dividers (example 2)](assets/divider-2.png)
