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
3. Create a test file.
4. Add inaccessible code.
5. Confirm diagnostics appear.
6. Trigger quick fix.
7. Confirm code changes correctly.

## Test Quality Rules

- Every rule must have valid and invalid examples.
- Every quick fix must be tested.
- Assert the exact diagnostic message in at least one representative case.
- Avoid tests that depend on network access.
- Avoid tests that require external services.
- Prefer deterministic fixtures.
