# Examples

## Basic

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
```

## Multiple Pi-holes

```yaml
type: custom:pi-hole
device_id:
  - pi_hole_device_1
  - pi_hole_device_2
title: My Pi-hole Network
```

## Custom title and icon

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
title: My Pi-hole Server
icon: mdi:shield-check
```

## Exclude chart section

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
exclude_sections:
  - chart
```

## Custom actions

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
stats:
  tap_action:
    action: more-info
controls:
  tap_action:
    action: toggle
```
