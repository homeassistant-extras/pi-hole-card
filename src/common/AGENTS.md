# AGENTS.md - Common

This folder contains shared utilities used across cards, delegates, and helpers.

- Keep utilities generic enough to justify living in `src/common/`.
- Prefer pure, well-named functions with narrow inputs and outputs.
- Avoid importing card components from this folder to prevent dependency cycles.
- Add focused tests for sorting, filtering, mapping, or formatting changes.
