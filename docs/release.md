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

4. Package extension.

```bash
vsce package
```

5. Publish.

```bash
vsce publish
```

6. Create GitHub release.
7. Announce release.

## Release Checklist

- Tests pass.
- Changelog updated.
- Version updated.
- Documentation updated.
- `.vsix` package generated.
- GitHub tag created.
- Marketplace page checked.
