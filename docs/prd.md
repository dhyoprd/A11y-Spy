# Product Requirements Document: A11y-Spy

## 1. Overview

A11y-Spy is a developer tool that audits common accessibility issues in real time inside VS Code.

The product behaves like a lightweight accessibility linter with editor-native feedback, diagnostic underlines, explanations, and safe quick fixes.

## 2. Problem

Accessibility checks are often performed too late. Developers may write inaccessible markup and styling for weeks before discovering problems.

Common issues include:

- Images without text alternatives.
- Text with insufficient color contrast.
- UI components that rely only on color.
- Missing labels on interactive elements.
- Incorrect semantic HTML.

The v0.1 MVP focuses only on missing image alternatives because it is common, understandable, and suitable for real-time static analysis. Color contrast and Tailwind checks are planned for later releases.

## 3. User Personas

### Frontend Developer

Wants fast feedback without leaving VS Code.

Needs:

- Clear warning.
- Minimal interruption.
- Quick fix.
- Low false positives.

### Student / Beginner Developer

Wants to learn accessibility while coding.

Needs:

- Simple explanations.
- Examples.
- Helpful fix suggestions.

### Open Source Maintainer

Wants to improve project quality.

Needs:

- Consistent rules.
- Configurable severity.
- CI-friendly future path.

## 4. User Stories

### Missing Image Alt

As a developer, I want A11y-Spy to warn me when I write an image without `alt`, so that users who rely on assistive technology are not blocked.

Acceptance criteria:

- Detects `<img src="..." />` in HTML.
- Detects `<img src="..." />` in JSX/TSX.
- Does not warn when `alt` exists.
- Does not warn for JSX/TSX image elements with spread props.
- Does not warn for explicitly hidden or presentational images.
- Shows diagnostic message.
- Offers quick fix to add `alt=""`.
- Offers explanation that empty `alt` should only be used for decorative images.

### Low Contrast Warning

As a developer, I want A11y-Spy to warn me when text contrast is too low, so that my UI remains readable.

Status: planned after v0.1.

Acceptance criteria:

- Detects basic CSS `color` and `background-color` pairs.
- Calculates contrast ratio.
- Warns when contrast is below configured threshold.
- Shows current ratio and expected ratio.
- Does not warn if values cannot be safely resolved.
- Supports basic hex color values in a later release.

### Tailwind Contrast Warning

As a Tailwind user, I want A11y-Spy to warn me when text and background utility classes create low contrast.

Status: planned after v0.1.

Acceptance criteria:

- Detects class pairs like `text-gray-400 bg-white`.
- Resolves basic Tailwind default colors.
- Warns when contrast is too low.
- Allows disabling Tailwind analysis.

### Quick Fix

As a developer, I want safe auto-fixes for simple accessibility issues.

Acceptance criteria:

- Quick fix is available in VS Code lightbulb actions.
- Quick fix modifies only the relevant range.
- Quick fix does not invent meaningful alt text without user context.
- Auto-fix behavior is covered by tests.

## 5. Functional Requirements

### Diagnostics

A11y-Spy must create diagnostics for supported accessibility issues.

Each diagnostic includes:

- Rule ID.
- Severity.
- Message.
- File location.
- Suggested fix, when available.
- Documentation link.

### Rule Engine

Each rule should be modular.

Rule structure:

```ts
type A11yRule = {
  id: string;
  description: string;
  languages: string[];
  run(context: RuleContext): DiagnosticResult[];
};
```

### Configuration

Users should be able to configure:

```json
{
  "a11ySpy.enable": true,
  "a11ySpy.rules.imgAlt": "warning"
}
```

`a11ySpy.rules.imgAlt` accepts `"off"`, `"info"`, `"warning"`, and `"error"`. Color contrast and Tailwind configuration are planned after v0.1.

### Supported Languages

v0.1:

- HTML
- JSX
- TSX

Later:

- CSS
- Vue
- Svelte
- Astro
- SCSS
- MDX

## 6. Non-Functional Requirements

### Performance

- Diagnostics should run quickly while editing.
- Use a 250ms debounce to avoid running analysis on every keystroke.
- Avoid blocking the editor UI.
- Analyze open supported documents on activation/open and re-analyze changed documents while editing.
- Do not scan the whole workspace in v0.1.
- Skip documents larger than 500 KB.

### Accuracy

- Prefer fewer false positives over aggressive warnings.
- If a value cannot be safely resolved, do not warn.
- Provide clear explanation for each warning.

### Maintainability

- Rules must be isolated.
- Tests must use fixtures.
- Parser logic should be separated from VS Code integration.

### Accessibility of the Tool Itself

- Diagnostic messages must be clear.
- Avoid vague wording like "bad accessibility".
- Provide actionable suggestions.

## 7. MVP Features

| Feature | Priority |
| --- | --- |
| Missing image alt detection | P0 |
| VS Code diagnostics | P0 |
| Quick fix for empty alt | P0 |
| Minimal rule configuration for image alt | P0 |
| Documentation | P0 |
| Tests | P0 |

## 8. Out of Scope for MVP

- Full WCAG compliance scanner.
- Browser runtime testing.
- CSS color contrast checking.
- Tailwind color contrast checking.
- Framework image components such as Next.js `<Image>`.
- `<input type="image">`.
- Command palette commands.
- AI-generated alt text.
- Full CSS cascade resolution.
- Full Tailwind config parsing.
- Screen reader simulation.
- Keyboard navigation testing.

## 9. Success Metrics

- 90%+ test coverage for rule engine.
- Missing alt rule works in HTML, JSX, and TSX.
- New contributor can create a rule by following docs.
- MVP can be packaged as a `.vsix` file.
