# A11y-Spy

A11y-Spy is a real-time accessibility auditor for developers. It helps detect common web accessibility issues while coding, directly inside Visual Studio Code.

Instead of waiting until the end of a project to run an accessibility audit, A11y-Spy gives instant feedback as developers write HTML, JSX, and TSX. CSS contrast and Tailwind analysis are planned after v0.1.

## Problem

Many developers want to build inclusive web experiences, but accessibility checks are often done too late or skipped entirely because they require extra tools, manual inspection, or separate browser audits.

This creates a gap where simple issues such as missing image alternatives or poor color contrast can reach production unnoticed.

## Solution

A11y-Spy brings accessibility feedback into the developer workflow.

It highlights accessibility issues like syntax errors, explains why they matter, and provides quick fixes for common problems.

## Available in v0.1

- Detect missing `alt` attributes on `<img />` elements.
- Show editor diagnostics for accessibility issues.
- Support HTML, JSX, and TSX.
- Provide a quick fix that adds `alt=""` for decorative images.
- Explain each issue with short, developer-friendly guidance.

## v0.1 Limits

- Documents larger than 500 KB are skipped to keep live diagnostics responsive.
- The image-alt rule checks native HTML `<img>` elements and lowercase JSX/TSX `<img>` elements only.
- Framework image components, `<input type="image">`, contrast checks, and Tailwind analysis are out of scope for v0.1.

## Planned Features

- Warn when text and background color contrast is too low.
- Support CSS hex color contrast analysis.
- Support Tailwind default color contrast analysis.
- Add more accessibility rules for labels, buttons, anchors, and document structure.

## Example

```html
<img src="/hero.png" />
```

A11y-Spy warning:

```text
Image element is missing an alt attribute.
```

Suggested quick fix:

```html
<img src="/hero.png" alt="" />
```

Use meaningful alt text when the image conveys information. Use `alt=""` only when the image is decorative.

## Target Standard

A11y-Spy aims to help developers follow practical WCAG 2.2 Level AA accessibility checks.

The first version focuses on:

- Text alternatives for images.
- Developer-friendly diagnostics and a safe decorative-image quick fix.

Future versions will add minimum contrast checks for readable text.

## Tech Stack

- TypeScript
- JavaScript
- VS Code Extension API
- Node.js
- ESLint
- Vitest
- VSCE for local packaging

## Project Status

A11y-Spy is currently in early planning and MVP development.

## Installation

Development installation:

```bash
git clone https://github.com/your-username/a11y-spy.git
cd a11y-spy
npm install
npm run compile
```

Then open the project in VS Code and press `F5`. This will launch a new Extension Development Host window.

## Development Commands

```bash
npm install
npm run compile
npm run watch
npm run test
npm run lint
```

## Supported File Types

v0.1:

- `.html`
- `.jsx`
- `.tsx`

Planned:

- `.css`
- `.vue`
- `.svelte`
- `.astro`
- `.scss`
- `.mdx`

## Documentation

- [Project brief](docs/project-brief.md)
- [Product requirements](docs/prd.md)
- [v0.1 scope decision](docs/adr/0001-v0-1-mvp-scope.md)
- [Image alt rule](docs/rules/img-alt.md)
- [Architecture](docs/architecture.md)
- [Internal API](docs/api.md)
- [Setup guide](docs/setup.md)
- [Testing guide](docs/testing.md)
- [Deployment guide](docs/deployment.md)
- [Release guide](docs/release.md)

## Roadmap

See [ROADMAP.md](ROADMAP.md).

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request.

Good first contributions include:

- Adding new accessibility rules.
- Improving test coverage.
- Writing documentation.
- Improving Tailwind color parsing.
- Creating examples and fixtures.

## Security

Please do not report security issues publicly. Read [SECURITY.md](SECURITY.md).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
