# Action Configuration

Each section supports tap/hold/double-tap actions:

| Name              | Type   | Default    | Description                          |
| ----------------- | ------ | ---------- | ------------------------------------ |
| tap_action        | object | _optional_ | Action to perform when tapped        |
| hold_action       | object | _optional_ | Action to perform when held          |
| double_tap_action | object | _optional_ | Action to perform when double-tapped |

Actions can perform operations such as:

- Toggle entities
- Show more info
- Call services
- Navigate to different views

See Home Assistant dashboard actions for the full schema: `https://www.home-assistant.io/dashboards/actions/`.
