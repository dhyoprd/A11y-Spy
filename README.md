# A11y-Spy

A11y-Spy is a real-time accessibility auditor for developers. It helps detect common web accessibility issues while coding, directly inside Visual Studio Code.

Instead of waiting until the end of a project to run an accessibility audit, A11y-Spy gives instant feedback as developers write HTML, JSX, TSX, CSS, and Tailwind-based UI code.

## Problem

Many developers want to build inclusive web experiences, but accessibility checks are often done too late or skipped entirely because they require extra tools, manual inspection, or separate browser audits.

This creates a gap where simple issues such as missing image alternatives or poor color contrast can reach production unnoticed.

## Solution

A11y-Spy brings accessibility feedback into the developer workflow.

It highlights accessibility issues like syntax errors, explains why they matter, and provides quick fixes for common problems.

## Core Features

- Detect missing `alt` attributes on `<img />` elements.
- Show editor diagnostics for accessibility issues.
- Warn when text and background color contrast is too low.
- Support HTML, JSX, TSX, CSS, and Tailwind class analysis.
- Provide quick fixes for basic accessibility problems.
- Explain each issue with short, developer-friendly guidance.

## Example

```html
<img src="/hero.png" />
```

A11y-Spy warning:

```text
Image element is missing an alt attribute.
Add meaningful alt text or use alt="" if the image is decorative.
```

Suggested fix:

```html
<img src="/hero.png" alt="" />
```

## Target Standard

A11y-Spy aims to help developers follow practical WCAG 2.2 Level AA accessibility checks.

The first version focuses on:

- Text alternatives for images.
- Minimum contrast ratio for readable text.
- Developer-friendly quick fixes for common accessibility mistakes.

## Tech Stack

- TypeScript
- JavaScript
- VS Code Extension API
- Node.js
- ESLint
- Vitest or Jest
- VSCE for packaging and publishing

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

Initial MVP:

- `.html`
- `.jsx`
- `.tsx`
- `.css`

Planned:

- `.vue`
- `.svelte`
- `.astro`
- `.scss`
- `.mdx`

## Documentation

- [Project brief](docs/project-brief.md)
- [Product requirements](docs/prd.md)
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
