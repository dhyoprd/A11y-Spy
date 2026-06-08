# Setup Guide

## Requirements

- Node.js 20 or newer
- npm
- Visual Studio Code
- Git

## Clone Repository

```bash
git clone https://github.com/your-username/a11y-spy.git
cd a11y-spy
```

## Install Dependencies

```bash
npm install
```

## Compile

```bash
npm run compile
```

## Watch Mode

```bash
npm run watch
```

## Run Extension Locally

1. Open the project in VS Code.
2. Press `F5`.
3. This opens a new Extension Development Host window.
4. Open an HTML, JSX, or TSX file.
5. Add a test image:

```html
<img src="/hero.png">
```

You should see a diagnostic warning if the image does not have an `alt` attribute.

## Configuration

```json
{
  "a11ySpy.enable": true,
  "a11ySpy.rules.imgAlt": "warning"
}
```

Set `a11ySpy.enable` to `false` to clear and pause diagnostics. `a11ySpy.rules.imgAlt` accepts `off`, `info`, `warning`, and `error`.

## Recommended VS Code Extensions

- ESLint

## v0.1 Limits

Documents larger than 500 KB are skipped to keep live diagnostics responsive.

## Troubleshooting

### Extension does not activate

Check `package.json` activation events.

### Diagnostics do not appear

Check that the file language is supported.

### Tests fail

Run:

```bash
npm install
npm run test
```
