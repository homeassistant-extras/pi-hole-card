# Configuration Options

## Options

| Name                | Type            | Default      | Description                                                   |
| ------------------- | --------------- | ------------ | ------------------------------------------------------------- |
| device_id           | string or array | **Required** | The ID(s) of your Pi-hole device(s) in Home Assistant         |
| title               | string          | Pi-Hole      | Custom title for the card header                              |
| icon                | string          | mdi:pi-hole  | Custom icon for the card header                               |
| badge               | object          | _none_       | Configure actions for the card icon/badge                     |
| pause               | object          | [60,300,900] | Pause buttons config                                          |
| stats               | object          | _none_       | Configure actions for statistics tiles                        |
| info                | object          | _none_       | Configure actions for additional info items                   |
| controls            | object          | _none_       | Configure actions for control buttons                         |
| exclude_sections    | list            | _none_       | Sections of entities to exclude                               |
| exclude_entities    | list            | _none_       | Entities to remove from the card                              |
| entity_order        | list            | _none_       | Custom order for switch, button, sensor entities or dividers  |
| collapsed_sections  | list            | _none_       | Sections to be initially collapsed                            |
| switch_spacing      | string          | flex         | Layout style for switches: flex, space-around, space-between  |
| chart               | object          | _none_       | Chart configuration options                                   |
| aggregation         | object          | _none_       | Multi-Pi-hole tile aggregation ([see AGGREGATION](AGGREGATION.md)) |
| features            | list            | See below    | Optional flags to toggle different features                   |

## Auto-discovery

The card automatically discovers and identifies Pi-hole entities based on:

- Entity naming patterns
- Translation keys
- Entity relationships to the device

This includes sensors, buttons, switches, binary sensors, and update entities.
