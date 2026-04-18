# Pause configuration

## Durations

`pause.durations` (or legacy `pause_durations`) supports several time formats:

- **Numbers**: seconds (e.g., `300` = 5 minutes)
- **Number strings**: quoted seconds (e.g., `"60"` = 1 minute)
- **Simple units**: `"10s"`, `"5m"`, `"1h"`
- **Complex format**: `"1h:30m:45s"`

Example:

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
pause:
  durations:
    - 60
    - 300
    - 10s
    - 5m
    - 1h
    - '4h:20m:69s'
```

![Custom pause durations](assets/custom-pause.png)

## Custom pause button action

If you set `pause.tap_action`, each pause duration button dispatches that Home Assistant dashboard action.

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
pause:
  durations:
    - 60
    - 300
  tap_action:
    action: perform-action
    perform_action: script.your_pause_routine
```

![Pause section](assets/pause.png)

### Placeholders

Inside `pause.tap_action`, the card supports these **card-local placeholders** in strings:

| Placeholder           | Value                                                              |
| --------------------- | ------------------------------------------------------------------ |
| `{{ pause_seconds }}` | Seconds for the button that was clicked                            |
| `{{ pause_minutes }}` | That duration in minutes (`pause_seconds / 60`, may be fractional) |
| `{{ device_id }}`     | Card `device_id`; if you use a list, the **first** id is used      |
| `{{ entity_id }}`     | Selected switch when group pausing is on; otherwise empty string   |

If the value is **only** a single placeholder (optional whitespace), the card substitutes a number for `pause_seconds`/`pause_minutes` and a string for `device_id`/`entity_id`. Inside longer strings, replacements are stringified.

## Group pausing

Group pausing is enabled by default and can expose a dropdown to target a specific Pi or client group.

![Group pause](assets/group-pause.gif)

![Pause Pi instance](assets/pi-pause.gif)

If you prefer the legacy device-based pausing behavior (recommended in some multi-pi setups), disable group pausing with a feature flag:

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
features:
  - disable_group_pausing
```

> [!NOTE]
> This feature requires the [Pi-hole v6 integration](https://github.com/bastgau/ha-pi-hole-v6).
