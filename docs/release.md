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

1. Confirm all tests pass.

```bash
npm run test
npm run lint
npm run compile
```

2. Update `CHANGELOG.md`.
3. Update version in `package.json`.

```bash
npm version patch
```

4. Package extension locally.

```bash
npm run package
```

5. Install and smoke-test the generated `.vsix`.
6. Create GitHub release if this is a public release.
7. Announce release if appropriate.

## Release Checklist

- Tests pass.
- Changelog updated.
- Version updated.
- Documentation updated.
- `.vsix` package generated.
- GitHub tag created, if this is a public release.
- Marketplace page checked, if publishing to Marketplace.
