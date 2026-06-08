# Release Guide

A11y-Spy uses Semantic Versioning.

Version format:

```text
MAJOR.MINOR.PATCH
```

## Version Rules

- MAJOR: breaking changes.
- MINOR: new backward-compatible features.
- PATCH: backward-compatible bug fixes.

## Release Steps

1. Confirm local validation passes.

```bash
npm run compile
npm run lint
npm run test
npm run package
```

2. Update `CHANGELOG.md`.
3. Update version in `package.json`.

```bash
npm version patch
```

4. Package extension locally if the package was not already generated during validation.

```bash
npm run package
```

5. Install and smoke-test the generated `.vsix`.
6. Create GitHub release if this is a public release.
7. Announce release if appropriate.

## v0.1 Scope

v0.1 supports local VSIX packaging only. Marketplace publishing and CI-uploaded VSIX artifacts are out of scope.

## Smoke-Test Checklist

- Install `a11y-spy-0.1.0.vsix` or launch the Extension Development Host.
- Open an HTML, JSX, or TSX file.
- Confirm `<img src="/hero.png">` produces a missing-alt diagnostic.
- Apply `Add alt="" for decorative image` and confirm the document is edited.
- Confirm contrast, Tailwind, framework image components, and `<input type="image">` do not produce v0.1 diagnostics.

## Release Checklist

- Compile, lint, tests, and local package generation pass.
- Changelog updated.
- Version updated.
- Documentation updated.
- `.vsix` package generated.
- GitHub tag created, if this is a public release.
- Marketplace page checked only for post-v0.1 Marketplace releases.
