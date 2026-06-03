# Testing Guide

A11y-Spy should be tested at two levels:

1. Core rule tests.
2. VS Code integration tests.

## Rule Tests

Rule tests validate accessibility detection logic without requiring VS Code.

Example test cases for `img-alt`:

- Should report `img` without `alt`.
- Should not report `img` with `alt`.
- Should not report `img` with `alt=""`.
- Should support JSX self-closing `img`.
- Should support HTML `img`.

## Fixture-Based Testing

Use fixtures for realistic examples.

```text
src/test/fixtures/
|-- img-alt/
|   |-- invalid.html
|   |-- valid.html
|   |-- invalid.tsx
|   `-- valid.tsx
`-- contrast/
    |-- invalid.css
    `-- valid.css
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
- Avoid tests that depend on network access.
- Avoid tests that require external services.
- Prefer deterministic fixtures.
