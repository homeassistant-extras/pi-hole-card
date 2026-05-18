# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Cross-agent instructions live in [AGENTS.md](./AGENTS.md). Folder-scoped `AGENTS.md` files exist under `src/` subdirectories and `test/` — read the nearest one before editing files in that folder.

## Package Manager

This is a **Yarn project**. Use `yarn`, not `npm`.

## Commands

### Build / Dev

- `yarn build` — Parcel production build (entry `src/index.ts` → `dist/pi-hole-card.js`)
- `yarn watch` — Parcel watch mode
- `yarn format` — Prettier (with import-sort plugins)
- `yarn update` — `npm-check-updates -u && yarn install`

### Test

- `yarn test` — Mocha + ts-node (`tsconfig.test.json`), specs at `test/**/*.spec.ts`
- `yarn test:coverage` — NYC + Istanbul coverage
- `yarn test:watch` — Mocha watch
- Single file:
  ```bash
  TS_NODE_PROJECT='./tsconfig.test.json' npx mocha test/path/to/specific.spec.ts
  ```

### Diagnosing `yarn test` failures

If `yarn test` fails with `ERR_MODULE_NOT_FOUND` on an `@cards/...` / `@hass/...` / `@delegates/...` import, it is almost always a **TypeScript compilation error** in that file or a transitive import — ts-node surfaces type errors as misleading module-resolution errors. Path aliases are wired correctly via `tsconfig-paths/register` in `mocha.setup.ts`.

Diagnose with:

```bash
npx tsc -p tsconfig.test.json --noEmit
```

Fix the type errors before touching aliases, mocha config, or git state.

## Architecture

This is a **Home Assistant custom Lovelace card** built with **Lit** (`lit` + `@lit/task`) that monitors and controls one or more Pi-hole instances via the Pi-hole Home Assistant integration. Output is a single bundled JS module loaded by HA as a dashboard resource.

### Entry point and custom elements

`src/index.ts` registers four custom elements with the browser and the main card with HA's `customCards` registry:

- `pi-hole` — main card (`@cards/card` → `PiHoleCard`)
- `pi-hole-editor` — visual config editor (`@cards/editor`)
- `pause-component` — pause-ad-blocking control
- `system-metrics-graph` — Chart.js-backed CPU/memory graph

### Layered structure

- **`src/cards/`** — Lit components: `card.ts`, `editor.ts`, plus `components/` (sub-widgets) and `mixins/` (shared Lit behavior). Keep rendering declarative; push logic to delegates/common.
- **`src/html/`** — Pure HTML template functions (the "pi-*" naming: `pi-crust`, `pi-fillings`, `pi-flavors`, `pi-tin`, `pi-toppings`, `bake-pi`) that the card assembles.
- **`src/delegates/`** — Business logic, action handlers, and `retrievers/` for HA state/registry access. Keep independent of Lit; return data, not DOM.
- **`src/common/`** — Pure utilities: entity mapping/sorting, section toggling, time/stat conversion, pause-action variables.
- **`src/config/`** — Card config defaults, feature flags, pause settings.
- **`src/hass/`** — Vendored Home Assistant types and helpers (`common/`, `components/`, `data/`, `panels/`, `state/`, `ws/`, `types.ts`). Treat as the boundary to HA's API surface.
- **`src/localize/` + `src/translations/`** — `localize.ts` plus per-locale JSON (`en`, `de`, `es`, `fr`, `it`, `bg`, `el`). See [TRANSLATIONS.md](./TRANSLATIONS.md) for the translation workflow.
- **`src/types/`** — `config.ts`, `locale.ts`, `types.ts` for card-wide TypeScript types.

### Data flow

1. HA dashboard passes config (including `device_id`, optionally a list for multi-Pi-hole).
2. Delegates/retrievers resolve entities from the HA device + entity registry.
3. `common/` helpers map, filter, and sort entities; calculate stats; compute pause state.
4. `card.ts` composes `html/pi-*` templates with the resolved data and current `hass` state.
5. Editor (`editor.ts`) emits config-changed events; never mutates runtime state directly.

### TypeScript path aliases (`tsconfig.json`)

`@cards/*`, `@delegates/*`, `@hass/*`, `@html/*`, `@common/*`, `@config/*`, `@localize/*`, `@type/*`, `@util/*`, `@test/*`, `@/*` → corresponding `src/*` (and `test/*`) folders. Strict mode is on with `noUncheckedIndexedAccess` and `noImplicitOverride`.

### Test setup

Mocha + Chai + Sinon, JSDOM via `mocha.setup.ts`, `@open-wc/testing` for Lit components. Tests use `tsconfig.test.json` and mirror the `src/` layout under `test/`.

### Build

Parcel 2.x with `@parcel/transformer-inline-string` bundles to a single module. The entry, output, and bundling target are set in `package.json` (`source`, `module`, `targets.module.includeNodeModules: true`) — do not add a second entry point.
