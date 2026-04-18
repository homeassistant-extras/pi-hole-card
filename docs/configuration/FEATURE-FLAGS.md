# Feature flags

Feature flags let you toggle some card behavior.

```yaml
features:
  - disable_group_pausing
```

| Feature               | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| disable_group_pausing | Disable group pausing feature                                    |
| ha_integration        | Use Home Assistant built-in Pi-hole integration (pi_hole domain) |

## Home Assistant integration flag

By default, the card uses the `pi_hole_v6` domain for pause operations. If you’re using the built-in Home Assistant Pi-hole integration instead, enable `ha_integration` to use the `pi_hole` domain:

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
features:
  - ha_integration
```

> [!WARNING]
> When `ha_integration` is enabled, pause operations will use the `pi_hole` domain.
