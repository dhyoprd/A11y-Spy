# Contributing to A11y-Spy

Thank you for your interest in contributing to A11y-Spy.

A11y-Spy exists to make web accessibility easier for developers. Every contribution should help make accessibility feedback faster, clearer, and more useful inside the coding workflow.

## Ways to Contribute

You can contribute by:

- Reporting bugs.
- Suggesting accessibility rules.
- Improving documentation.
- Adding tests.
- Improving parser accuracy.
- Building quick fixes.
- Improving support for frameworks such as React, Vue, Svelte, Astro, and Tailwind CSS.

## Development Setup

```bash
git clone https://github.com/your-username/a11y-spy.git
cd a11y-spy
npm install
npm run compile
```

Open the project in VS Code and press `F5`. This starts a new VS Code Extension Development Host.

## Branch Naming

Use clear branch names:

```text
feature/add-img-alt-rule
fix/css-contrast-parser
docs/update-readme
test/add-jsx-fixtures
```

## Commit Style

Use simple conventional commits:

```text
feat: add missing img alt diagnostic
fix: prevent false positive on decorative images
docs: improve setup guide
test: add fixtures for JSX image elements
```

## Pull Request Checklist

Before opening a pull request:

- The code compiles.
- Tests pass.
- Linting passes.
- Documentation is updated if behavior changed.
- New rules include test fixtures.
- The pull request explains the problem and solution clearly.

## Rule Contribution Guidelines

Each accessibility rule should include:

- Rule ID.
- Description.
- WCAG reference if applicable.
- Severity level.
- Supported file types.
- Bad code example.
- Good code example.
- Auto-fix behavior, if safe.
- Test fixtures.

Example rule ID:

```text
a11y-spy/img-alt
```

## Auto-Fix Policy

Auto-fix should only be provided when the fix is safe and does not mislead users.

For example:

- Safe: add `alt=""` only when the user explicitly chooses to mark an image as decorative.
- Not always safe: automatically generating meaningful alt text without context.

A11y-Spy should prefer safe, explainable fixes over aggressive automation.

## Code Review

Maintainers will review pull requests based on:

- Correctness.
- Developer experience.
- Accessibility accuracy.
- Test coverage.
- Maintainability.
- Low false-positive behavior.

## Good First Issues

Look for issues labeled:

- `good first issue`
- `help wanted`
- `documentation`
- `rule`
- `test`

## Community Standard

Be respectful and constructive. Accessibility is a human-centered topic, so discussions should prioritize empathy, clarity, and learning.
