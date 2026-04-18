# Chart configuration

![System metrics chart example](assets/chart.gif)

## Options

| Name      | Type   | Default | Description                                                                    |
| --------- | ------ | ------- | ------------------------------------------------------------------------------ |
| line_type | string | normal  | Chart line style. Options: `normal`, `gradient`, `gradient_no_fill`, `no_fill` |

## Line types

- `normal` (default): Standard solid lines with filled areas
- `gradient`: Gradient-colored lines with gradient-filled areas
- `gradient_no_fill`: Gradient-colored lines without fill
- `no_fill`: Solid lines without fill areas

## Example

```yaml
type: custom:pi-hole
device_id: pi_hole_device_1
chart:
  line_type: gradient
```

## Notes

The card’s system metrics chart typically reads from Home Assistant recorder/history. If you don’t have recorder history retained for the relevant sensors yet, the chart may appear blank initially.
