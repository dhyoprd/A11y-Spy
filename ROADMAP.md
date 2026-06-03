# A11y-Spy Roadmap

## v0.1.0 - MVP Foundation

Focus: basic VS Code diagnostics and missing image alt detection.

- Initialize VS Code extension project.
- Add TypeScript setup.
- Add diagnostic collection.
- Add missing img alt rule.
- Support HTML.
- Support JSX and TSX.
- Add quick fix for `alt=""`.
- Add unit tests for rule engine.
- Add README, CONTRIBUTING, SECURITY, and LICENSE.

## v0.2.0 - Contrast Checker

Focus: basic contrast detection.

- Add CSS parser.
- Detect `color` and `background-color`.
- Support hex color values.
- Calculate contrast ratio.
- Show warning when contrast is below threshold.
- Add tests for contrast calculation.
- Add documentation for contrast rule.

## v0.3.0 - Tailwind Support

Focus: Tailwind utility class analysis.

- Detect `text-*` and `bg-*` class pairs.
- Support Tailwind default color palette.
- Warn for low contrast combinations.
- Add configuration to enable or disable Tailwind analysis.
- Add examples for React and Tailwind.

## v0.4.0 - Rule Configuration

Focus: user control.

- Add VS Code settings.
- Allow disabling individual rules.
- Support severity configuration.
- Add workspace-level config support.
- Improve diagnostic messages.

## v0.5.0 - More Accessibility Rules

Potential rules:

- Button without accessible name.
- Input without label.
- Anchor without text.
- Clickable non-interactive element.
- Missing `lang` on HTML document.
- Icon-only button without `aria-label`.

## v1.0.0 - Stable Release

Focus: stable public release.

- Stable rule API.
- Complete documentation.
- Marketplace publishing.
- CI pipeline.
- Release workflow.
- Contributor guide for rule authors.
- Changelog automation.
