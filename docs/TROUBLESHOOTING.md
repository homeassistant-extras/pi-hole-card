# Troubleshooting

## Installation / prerequisites

- Ensure you have the [Pi-hole v6 integration](https://github.com/bastgau/ha-pi-hole-v6) installed and working first.
- Verify the card JS resource is loaded (HACS or manual resource) and your browser cache is refreshed.

## Chart not showing data

The system metrics chart relies on Home Assistant’s recorder/history.

- Confirm recorder is enabled and retaining history for the charted sensors.
- Wait for enough history to accumulate (new installs may show a blank chart initially).

## Multi Pi-hole action surprises

When `device_id` is a list, actions may run multiple times:

- **More-info** dialogs can only show one entity at a time (you may only see the first/last Pi-hole)
- **Navigation** actions can conflict if executed more than once
- **Service calls** will be executed for each configured Pi-hole

If you see unexpected behavior, switch to targeting a single Pi-hole or use a service call that explicitly targets what you want.

## Getting help

- GitHub issues: `https://github.com/homeassistant-extras/pi-hole-card/issues`
- Discussions: `https://github.com/homeassistant-extras/pi-hole-card/discussions`
- Discord: `https://discord.gg/NpH4Pt8Jmr`
