# Testing Guide

A11y-Spy should be tested at two levels:

1. Core rule tests.
2. Manual VS Code Extension Development Host checks.

VS Code integration tests are planned after the initial extension behavior stabilizes.

## Rule Tests

Rule tests validate accessibility detection logic without requiring VS Code.

Example test cases for `img-alt`:

- Should report `img` without `alt`.
- Should not report `img` with `alt`.
- Should not report `img` with `alt=""`.
- Should support JSX self-closing `img`.
- Should support JSX paired `img`.
- Should support HTML `img`.
- Should not report JSX `img` with spread props.
- Should not report explicitly hidden or presentational images.
- Should place the diagnostic range on the `img` tag name.
- Should handle non-ASCII text before an `img` without range drift.

## Fixture-Based Testing

Use fixtures for realistic examples.

```text
src/test/fixtures/
|-- img-alt/
|   |-- invalid.html
|   |-- valid.html
|   |-- invalid.tsx
|   `-- valid.tsx
```

## Running Tests

```bash
npm run test
```

## Linting

```bash
npm run lint
```

## Manual Testing

1. Press `F5` in VS Code.
2. Open the Extension Development Host.
3. Open existing HTML, JSX, and TSX files and confirm missing-alt diagnostics appear on activation.
4. Open a new supported document and confirm diagnostics appear immediately.
5. Edit a supported document and confirm diagnostics update after the debounce delay.
6. Close a supported document and confirm its diagnostics are removed from the Problems panel.
7. Create an untitled HTML, JSX, or TSX document and confirm diagnostics appear.
8. Open a virtual or readonly supported document and confirm diagnostics can appear, while quick fixes remain unavailable.
9. Add content larger than 500 KB and confirm existing diagnostics for that document are cleared.
10. Toggle `a11ySpy.enable` and `a11ySpy.rules.imgAlt` and confirm open supported documents re-analyze or clear immediately.
11. Trigger quick fix in an editable supported document and confirm code changes correctly.

## Test Quality Rules

- Every rule must have valid and invalid examples.
- Every quick fix must be tested.
- Assert the exact diagnostic message in at least one representative case.
- Avoid tests that depend on network access.
- Avoid tests that require external services.
- Prefer deterministic fixtures.
