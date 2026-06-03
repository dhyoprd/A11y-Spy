# Deployment Guide

A11y-Spy can be distributed as a VS Code extension package.

## Build

```bash
npm run compile
```

## Package

Install VSCE:

```bash
npm install -g @vscode/vsce
```

Package the extension:

```bash
vsce package
```

This creates a `.vsix` file.

## Local Install from VSIX

```bash
code --install-extension a11y-spy-0.1.0.vsix
```

## Marketplace Publishing

Before publishing:

1. Create a publisher account.
2. Add publisher ID to `package.json`.
3. Create a Personal Access Token.
4. Login with VSCE.
5. Publish the extension.

```bash
vsce login your-publisher-name
vsce publish
```

## Pre-Publish Checklist

- README is complete.
- LICENSE exists.
- CHANGELOG is updated.
- Version is updated.
- Tests pass.
- Extension icon exists.
- Marketplace description is clear.
- Screenshots or GIFs are available.
- No secrets are committed.
