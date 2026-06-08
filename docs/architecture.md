# A11y-Spy Architecture

## Overview

A11y-Spy is a VS Code extension built with TypeScript.

The architecture separates VS Code-specific integration from accessibility rule logic. This makes the rule engine easier to test and easier to reuse in future bundler plugins such as Vite or Webpack.

## High-Level Architecture

```text
VS Code Editor
  -> Extension Activation
  -> Document Listener
  -> Rule Engine
  -> Accessibility Rules
  -> Diagnostics Collection
  -> Code Actions / Quick Fixes
```

## Main Components

### 1. Extension Layer

Responsible for communicating with VS Code.

Responsibilities:

- Activate extension.
- Register document listeners.
- Register diagnostics.
- Register code actions.
- Read user configuration.
- Dispose resources properly.

Potential files:

- `src/extension.ts`
- `src/vscode/diagnostics.ts`
- `src/vscode/code-actions.ts`
- `src/vscode/config.ts`

### 2. Rule Engine

Responsible for running accessibility rules.

Responsibilities:

- Receive document content.
- Select rules based on file type.
- Run enabled rules.
- Return diagnostic results.
- Avoid VS Code-specific dependencies when possible.

Potential files:

- `src/core/rule-engine.ts`
- `src/core/types.ts`

### 3. Rules

Each rule detects one accessibility issue.

v0.1 file:

- `src/rules/img-alt.ts`

Future rules such as `color-contrast` and `tailwind-contrast` should be added only when those releases begin.
- `src/rules/color-contrast.ts`
- `src/rules/tailwind-contrast.ts`

Rule result example:

```ts
type RuleResult = {
  ruleId: string;
  message: string;
  severity: "error" | "warning" | "info";
  range: {
    startLine: number;
    startCharacter: number;
    endLine: number;
    endCharacter: number;
  };
  fix?: {
    title: string;
    insertText: string;
    offset: number;
  };
};
```

### 4. Parsers

Responsible for understanding source code.

v0.1 parser strategy:

- Use `parse5` with source-location support for HTML.
- Use the bundled TypeScript compiler API for JSX/TSX.
- Return UTF-16 offsets from parser candidates and convert to line/character ranges in shared utilities.
- Do not use regex/string scanning for JSX/TSX.
- PostCSS, CSS parsing, and Tailwind color maps are planned after v0.1.

Potential files:

- `src/parsers/html-parser.ts`
- `src/parsers/jsx-parser.ts`
- `src/utils/range.ts`

### 5. Utilities

Shared helpers.

Potential files:

- `src/utils/range.ts`
- `src/utils/language.ts`

## Suggested Folder Structure

```text
src/
|-- extension.ts
|-- core/
|   |-- rule-engine.ts
|   `-- types.ts
|-- rules/
|   `-- img-alt.ts
|-- parsers/
|   |-- html-parser.ts
|   `-- jsx-parser.ts
|-- vscode/
|   |-- diagnostics.ts
|   |-- code-actions.ts
|   `-- config.ts
|-- utils/
|   `-- range.ts
`-- test/
    |-- fixtures/
    `-- rules/
```

## Design Principles

### 1. Editor-Native

A11y-Spy should feel like a natural part of VS Code.

### 2. Fast Feedback

The extension should prioritize quick and lightweight checks.

### 3. Low False Positives

If A11y-Spy cannot confidently detect an issue, it should avoid warning.

### 4. Safe Auto-Fix

Auto-fix must not introduce misleading accessibility behavior.

### 5. Rule Modularity

Rules should be easy to add, test, disable, and document.

## Future Architecture

In the future, the core rule engine can be extracted into a separate package:

```text
packages/
|-- core/
|-- vscode-extension/
|-- vite-plugin/
`-- webpack-plugin/
```

This would allow A11y-Spy to run in multiple developer workflows.
