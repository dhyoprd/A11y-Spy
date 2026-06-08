# ADR-0001: v0.1 MVP Scope and Editor Behavior

Status: Accepted
Date: 2026-06-08

## Context

A11y-Spy is a VS Code extension for frontend developers. Its first release should prove the editor feedback loop with a narrow, trustworthy rule before expanding into broader accessibility analysis.

The primary v0.1 user is a frontend developer. Optimize for fast diagnostics, low false positives, safe quick fixes, and predictable behavior while editing.

## Decision

### Product scope

- v0.1 includes only native `<img>` missing `alt` detection.
- v0.1 supports HTML, JSX, and TSX.
- Color contrast, Tailwind analysis, framework image components such as Next.js `<Image>`, and `<input type="image">` are out of scope for v0.1.
- v0.1 ships diagnostics and quick fixes only. It does not add a command palette command.
- v0.1 should be packageable as a local `.vsix`. Marketplace publishing is not part of v0.1.

### Rule behavior

- Rule ID: `a11y-spy/img-alt`.
- Diagnostic message: `Image element is missing an alt attribute.`
- Default severity: `warning`.
- Any explicit `alt` attribute counts as present, including `alt=""`, `alt={undefined}`, and other expression values.
- JSX/TSX elements with a spread prop and no explicit `alt` do not warn, because the spread may contain `alt`.
- HTML tag and attribute matching is case-insensitive for `img` and `alt`.
- JSX/TSX only treats lowercase `img` as the native image element. Uppercase `Image` or `IMG` is treated as a component and ignored.
- Paired JSX `<img></img>` and malformed/present paired HTML `<img></img>` should be handled if the parser exposes a reliable image element.
- Do not report image-like text inside comments, strings, `<script>`, or `<style>`.

### Suppression behavior

Do not warn when an image is explicitly marked hidden or presentational:

- HTML `aria-hidden="true"` suppresses. Bare `aria-hidden`, `aria-hidden=""`, and `aria-hidden="false"` do not.
- JSX/TSX `aria-hidden`, `aria-hidden={true}`, and `aria-hidden="true"` suppress.
- `role="presentation"` and `role="none"` suppress. Role string values are trimmed and compared case-insensitively.
- Dynamic JSX/TSX role or aria values do not suppress unless the value is statically obvious.

### Quick fix behavior

- Quick-fix title: `Add alt="" for decorative image`.
- Quick fix inserts ` alt=""` immediately after the `img` tag name.
- Use one simple insertion strategy, even for multi-line tags. The user's formatter can clean up layout.
- Offer a quick fix only when the parser provides a reliable insertion point.
- Offer quick fixes only for `file` and `untitled` URI schemes.
- Suppressed diagnostics have no quick fix.
- After applying a fix, rely on document-change re-analysis to clear diagnostics.

### Parsing and positions

- HTML parsing uses `parse5` with source-location support.
- JSX/TSX parsing uses the bundled TypeScript compiler API.
- Use real parsers rather than regex/string scanning.
- During incomplete edits, report only from parser nodes that are confidently available.
- Parser candidates should use UTF-16 character offsets. Shared utilities convert offsets to line/character ranges.
- Underline the `img` tag name or element opener rather than the whole element.

### VS Code integration

- Activation events: `onLanguage:html`, `onLanguage:javascriptreact`, and `onLanguage:typescriptreact`.
- Analyze all currently open supported text documents on activation.
- Analyze supported documents on open and on live changes with a 250ms debounce.
- Analyze supported untitled documents.
- Do not scan the whole workspace.
- Skip documents larger than 500 KB and clear diagnostics for skipped documents.
- Global disable clears existing diagnostics and skips future analysis.
- Supported config in v0.1:

```json
{
  "a11ySpy.enable": true,
  "a11ySpy.rules.imgAlt": "warning"
}
```

`a11ySpy.rules.imgAlt` accepts `"off"`, `"info"`, `"warning"`, and `"error"`.

- Keep the core rule engine VS Code-independent.
- Use one diagnostic collection named `a11y-spy`.
- Diagnostic source should be `A11y-Spy`.
- Diagnostic code should include the rule ID and a web docs target where VS Code supports it.
- Centralize the placeholder docs URL in one constant, such as `DOCS_BASE_URL`, until the real GitHub repository is known.
- Because VS Code diagnostics do not have a standard arbitrary data field, keep an in-memory per-document fix registry keyed by diagnostic identity.

### Tooling

- Hand-create a minimal VS Code extension scaffold rather than using Yeoman.
- Use npm.
- Compile with plain `tsc`; no bundler in v0.1.
- Use CommonJS output, ES2022 target, source maps, and `out/` for compiled files.
- Minimum VS Code engine: `^1.90.0`.
- Runtime dependencies: `parse5` and `typescript`.
- Test runner: Vitest.
- Include ESLint, but do not add Prettier in v0.1.
- Include minimal GitHub Actions CI for `npm ci`, `npm run compile`, `npm run lint`, and `npm run test`.
- CI does not package the `.vsix` in v0.1.
- Add `@vscode/vsce` as a dev dependency and expose local packaging through `npm run package`.
- Include `.vscodeignore`.

## Consequences

v0.1 stays intentionally narrow. This protects editor performance, minimizes false positives, and makes the first implementation easier to test thoroughly.

The docs must distinguish v0.1 features from planned contrast and Tailwind support. Future work can add contrast, Tailwind, framework image components, stricter invalid-alt detection, and Marketplace publishing as separate decisions.

The placeholder GitHub docs URL must be updated once the real repository owner/name is known.
