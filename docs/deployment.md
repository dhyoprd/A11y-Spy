# Deployment Guide

A11y-Spy can be distributed as a VS Code extension package.

## Build

```bash
npm run compile
```

## Package

Package the extension with the project-local VSCE dependency:

```bash
npm run package
```

This creates `a11y-spy-0.1.0.vsix` in the project root. v0.1 packaging is local only; CI validates compile, lint, and tests but does not upload or publish VSIX artifacts.

## Local Install from VSIX

```bash
code --install-extension a11y-spy-0.1.0.vsix
```

## Manual Smoke Test

1. Install the generated VSIX or launch the Extension Development Host.
2. Open an HTML, JSX, or TSX file.
3. Add `<img src="/hero.png">`.
4. Confirm the missing-alt diagnostic appears.
5. Apply the `Add alt="" for decorative image` quick fix.
6. Confirm the image becomes `<img alt="" src="/hero.png">` or receives an equivalent inserted `alt=""`.
7. Confirm CSS contrast, Tailwind contrast, framework image components, and `<input type="image">` do not produce v0.1 diagnostics.

## Marketplace Publishing

Marketplace publishing is out of scope for v0.1. Before publishing a later release:

1. Create a publisher account.
2. Add publisher ID to `package.json`.
3. Create a Personal Access Token.
4. Login with the project-local VSCE dependency.
5. Publish the extension.

```bash
npm exec vsce login your-publisher-name
npm exec vsce publish
```

## Pre-Publish Checklist

- README is complete.
- LICENSE exists.
- CHANGELOG is updated.
- Version is updated.
- Tests pass.
- Extension icon exists, if publishing to Marketplace.
- Marketplace description is clear.
- Screenshots or GIFs are available.
- No secrets are committed.
