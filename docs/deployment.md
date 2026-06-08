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

This creates a `.vsix` file.

## Local Install from VSIX

```bash
code --install-extension a11y-spy-0.1.0.vsix
```

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
