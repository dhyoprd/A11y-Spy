# PRD: Implement A11y-Spy v0.1 Image Alt MVP

## Problem Statement

Frontend developers often discover accessibility issues too late, after inaccessible markup has already moved through reviews, branches, or releases. The first A11y-Spy release needs to prove that accessibility feedback can happen directly in VS Code while the developer is writing HTML, JSX, and TSX.

The immediate problem is missing image alternatives on native image elements. Missing `alt` attributes are common, easy to understand, and valuable to catch early, but editor feedback must stay quiet enough that frontend developers trust it. The v0.1 release must therefore detect only the cases it can identify confidently, avoid false positives around spread props and explicit decorative intent, and provide a safe quick fix without inventing human-authored alt text.

## Solution

Build the v0.1 A11y-Spy VS Code extension as a narrow, reliable missing image `alt` checker for HTML, JSX, and TSX.

The extension will activate for supported frontend language modes, analyze open and changed documents live with a short debounce, and create editor diagnostics for native image elements that are missing an explicit `alt` attribute. Diagnostics will be warnings by default and configurable per rule. The only quick fix will insert an empty `alt` attribute for decorative images, while documentation explains that meaningful alt text should be written by a human when the image conveys information.

The implementation will keep the core rule engine independent from VS Code. Parser modules will produce image candidates from HTML and JSX/TSX using real parsers, the rule module will evaluate those candidates, and the VS Code adapter will translate rule results into diagnostics and quick fixes.

## User Stories

1. As a frontend developer, I want A11y-Spy to warn me when an HTML image is missing `alt`, so that I catch accessibility issues while coding.
2. As a frontend developer, I want A11y-Spy to warn me when a JSX image is missing `alt`, so that React markup gets the same feedback as HTML.
3. As a frontend developer, I want A11y-Spy to warn me when a TSX image is missing `alt`, so that TypeScript React projects are supported in v0.1.
4. As a frontend developer, I want the missing image diagnostic to be a warning by default, so that the tool is visible without feeling like broken code.
5. As a frontend developer, I want the warning severity to be configurable, so that my team can choose info, warning, error, or off.
6. As a frontend developer, I want a global enable setting, so that I can turn the extension off without uninstalling it.
7. As a frontend developer, I want disabling the extension to clear existing diagnostics, so that stale warnings do not remain in the Problems panel.
8. As a frontend developer, I want the diagnostic message to be short and plain, so that I can scan it quickly while coding.
9. As a frontend developer, I want the diagnostic underline to target the `img` tag name, so that the editor does not underline an entire multi-line element.
10. As a frontend developer, I want A11y-Spy to avoid warning when an explicit `alt` attribute exists, so that valid images are not noisy.
11. As a frontend developer, I want A11y-Spy to treat empty `alt` as present, so that decorative images can be authored correctly.
12. As a frontend developer, I want A11y-Spy to avoid warning on JSX images with spread props, so that it does not assume a spread is missing `alt`.
13. As a frontend developer, I want A11y-Spy to avoid warning when an image is explicitly hidden from assistive technology, so that intentional decorative patterns do not create noise.
14. As a frontend developer, I want A11y-Spy to avoid warning when an image is explicitly presentational, so that role-based decorative intent is respected.
15. As a frontend developer, I want A11y-Spy to still warn when `aria-hidden` is false or empty, so that unclear hidden intent does not suppress real missing alt issues.
16. As a frontend developer, I want A11y-Spy to handle uppercase HTML image tags, so that older or unusual HTML still gets checked.
17. As a frontend developer, I want JSX/TSX checks to apply only to lowercase native image elements, so that framework components are not misidentified.
18. As a frontend developer, I want paired JSX image elements to be checked, so that uncommon but valid JSX syntax does not escape the rule.
19. As a frontend developer, I want malformed or paired HTML image elements to be checked when the parser can identify them, so that beginner code still receives useful feedback.
20. As a frontend developer, I want A11y-Spy to ignore image-looking text inside comments, strings, scripts, and styles, so that non-code examples do not produce false positives.
21. As a frontend developer, I want diagnostics to update while I type, so that I do not need to save before seeing accessibility feedback.
22. As a frontend developer, I want live diagnostics to be debounced, so that the editor stays responsive during normal typing.
23. As a frontend developer, I want A11y-Spy to analyze currently open supported documents when it activates, so that the Problems panel reflects the files I am already working on.
24. As a frontend developer, I want A11y-Spy to analyze newly opened supported documents, so that diagnostics appear when I open a file.
25. As a frontend developer, I want A11y-Spy to clean diagnostics when a document closes, so that closed files do not leave stale state behind.
26. As a frontend developer, I want pending analysis timers to be cleaned up when documents close, so that the extension does not waste work.
27. As a frontend developer, I want configuration changes to re-analyze open supported documents, so that setting changes take effect immediately.
28. As a frontend developer, I want very large documents to be skipped, so that generated or enormous files do not slow down my editor.
29. As a frontend developer, I want the large-file skip behavior documented, so that I understand why diagnostics may not appear in a huge file.
30. As a frontend developer, I want diagnostics for supported untitled documents, so that scratch snippets can still be checked.
31. As a frontend developer, I want diagnostics in virtual or readonly documents when possible, so that read-only views can still surface accessibility issues.
32. As a frontend developer, I want quick fixes only where edits are supported, so that readonly or virtual documents do not show broken fixes.
33. As a frontend developer, I want the quick fix to insert `alt=""`, so that I have a safe decorative-image fix available from the lightbulb.
34. As a frontend developer, I want the quick-fix title to say it is for decorative images, so that I am nudged toward meaningful alt text when needed.
35. As a frontend developer, I want the quick fix to avoid inventing meaningful alt text, so that the extension does not create misleading accessibility content.
36. As a frontend developer, I want the quick fix to make a tiny localized edit, so that it does not unexpectedly reformat my element.
37. As a frontend developer, I want the extension to rely on my formatter for cleanup, so that the quick fix stays simple and safe.
38. As a frontend developer, I want diagnostics to disappear naturally after a quick fix, so that the editor state follows the changed document.
39. As a frontend developer, I want a diagnostic code link to rule documentation, so that I can learn the accessibility context when I need it.
40. As a frontend developer, I want the docs to explain meaningful alt text versus decorative empty alt, so that I choose the right fix.
41. As a frontend developer, I want the docs to show suppressed hidden and presentational cases, so that I understand when the rule stays quiet.
42. As a student developer, I want the rule documentation to explain why missing alt matters, so that I learn the accessibility principle behind the warning.
43. As a student developer, I want examples of valid and invalid image markup, so that I can apply the rule correctly.
44. As an open-source maintainer, I want the rule engine to be modular, so that future contributors can add more accessibility rules without rewriting the extension shell.
45. As an open-source maintainer, I want core logic tested without VS Code, so that contributors can run fast deterministic tests.
46. As an open-source maintainer, I want fixture-based tests for realistic examples, so that future changes do not accidentally break common markup.
47. As an open-source maintainer, I want minimal CI for compile, lint, and tests, so that pull requests have a reliable quality gate.
48. As an open-source maintainer, I want local extension packaging, so that v0.1 can be tested as a real `.vsix` before Marketplace publishing.
49. As a future contributor, I want parser behavior separated from rule behavior, so that I can modify one without understanding the whole extension.
50. As a future contributor, I want the VS Code adapter separated from core diagnostics, so that the core engine can later support CLI, CI, or bundler integrations.
51. As a future contributor, I want the docs URL centralized, so that repository metadata can be corrected in one place once the real GitHub repository is known.
52. As a future contributor, I want the v0.1 scope to exclude contrast and Tailwind work, so that the first implementation remains focused and releasable.

## Implementation Decisions

- Build a minimal VS Code extension scaffold by hand, using npm, TypeScript, plain TypeScript compilation, CommonJS output, ES2022 target, source maps, and conventional compiled output.
- Keep the core rule engine independent from VS Code. The engine accepts document text, language identity, file name, and normalized configuration, then returns structured diagnostic results and optional fix payloads.
- Treat the rule engine as a deep module with a small stable interface. It should encapsulate rule selection, severity handling, and result production while remaining easy to test in isolation.
- Build a dedicated image candidate extraction layer. The rest of the rule should not care whether a candidate came from HTML or JSX/TSX.
- Use a real HTML parser with source-location support for HTML image candidates.
- Use the bundled TypeScript compiler API for JSX and TSX image candidates.
- Represent parser positions as UTF-16 character offsets, then convert offsets to line and character ranges through shared range utilities.
- Build the missing image alt rule as a deep module that consumes image candidates and returns rule results. It owns the semantics for explicit alt detection, spread-prop suppression, hidden/presentational suppression, diagnostic message, diagnostic range, and fix eligibility.
- Match HTML image tags and alt attributes case-insensitively.
- Match JSX/TSX native image elements only when the element name is lowercase `img`.
- Treat any explicit alt attribute as present in v0.1.
- Suppress JSX/TSX image elements with spread props when no explicit alt attribute exists.
- Suppress explicitly hidden or presentational images only when the intent is statically obvious.
- Keep the quick fix simple: insert an empty alt attribute immediately after the image tag name when the parser gives a reliable insertion point.
- Build a VS Code diagnostics adapter that maps core results to editor diagnostics, including source, rule code, severity, range, and documentation target.
- Build a code action adapter that creates quick fixes from an in-memory fix registry rather than recomputing rule results during code-action requests.
- Use one diagnostic collection for all A11y-Spy diagnostics.
- Register activation and code action providers only for supported language modes.
- Analyze open supported documents on activation, newly opened supported documents on open, and changed supported documents after a 250ms debounce.
- Clear diagnostics when documents close, when global configuration disables the extension, and when documents exceed the size guard.
- Support diagnostics for virtual and readonly documents, but expose quick fixes only for editable file and untitled documents.
- Centralize the placeholder web docs base URL in one constant until the real repository owner and name are known.
- Add local packaging through a project-local VSCE dependency and an npm script.
- Add minimal GitHub Actions CI that installs dependencies, compiles, lints, and runs tests.

## Testing Decisions

- Good tests should verify externally observable behavior: diagnostics produced, diagnostics suppressed, ranges chosen, fix payloads returned, and configuration respected. Tests should not assert internal traversal details or parser implementation details beyond the public candidate/result behavior.
- Core rule tests should cover missing alt detection in HTML, JSX, and TSX.
- Core rule tests should cover valid images with `alt`, decorative images with empty `alt`, hidden images, presentational images, and JSX/TSX spread-prop suppression.
- Core rule tests should cover paired JSX image elements and parser-tolerant cases where a reliable image node exists.
- Core rule tests should verify that comments, strings, scripts, and styles do not produce diagnostics.
- Range utility tests should cover line and character conversion, including non-ASCII text before an image to protect against offset drift.
- Parser candidate tests should verify candidate extraction behavior for representative HTML and JSX/TSX examples.
- Quick-fix tests should verify the quick-fix title, insertion text, and insertion offset for representative single-line and multi-line images.
- Configuration tests should verify global enable behavior and `off`, `info`, `warning`, and `error` severity mapping.
- VS Code integration tests are out of scope for v0.1. Manual Extension Development Host testing should confirm activation, live diagnostics, quick fixes, configuration changes, close cleanup, and local `.vsix` smoke testing.
- Use fixture-based examples for valid, invalid, and suppressed cases. Existing testing documentation already establishes fixture-based rule tests as the project pattern.
- Assert the exact diagnostic message in at least one representative test. Prefer rule IDs, counts, ranges, and fix payloads for the rest to avoid brittle wording tests.

## Out of Scope

- CSS color contrast checking.
- Tailwind color contrast checking.
- Full CSS cascade resolution.
- Full Tailwind configuration parsing.
- Framework image components such as Next.js image components.
- Custom image-like React components.
- Input image button accessibility checks.
- AI-generated alt text.
- Command palette commands.
- Browser runtime scanning.
- Screen reader simulation.
- Keyboard navigation testing.
- Full WCAG compliance scanning.
- VS Code integration test automation.
- Marketplace publishing.
- Extension icon and Marketplace branding assets.
- CI-produced `.vsix` artifacts.
- Prettier setup.
- Yeoman-based scaffolding.

## Further Notes

The canonical decision record for v0.1 is ADR-0001. If future implementation pressure conflicts with this PRD, prefer the ADR unless the team deliberately supersedes it with a new decision.

The real GitHub repository owner and name are still unknown in this workspace because the folder is not currently a Git clone. The diagnostic documentation URL should remain centralized and easy to update once the repository is known.

The issue should enter triage with the `needs-triage` label.
