# A11y-Spy Internal API Documentation

A11y-Spy does not expose a public HTTP API in the MVP.

This document describes the internal rule API used by contributors to add new accessibility rules.

## Rule Interface

```ts
export type A11yRule = {
  id: string;
  meta: RuleMeta;
  run: RuleRunner;
};
```

## Rule Metadata

```ts
export type RuleMeta = {
  name: string;
  description: string;
  wcag?: string[];
  languages: string[];
  defaultSeverity: "error" | "warning" | "info";
  fixable: boolean;
};
```

Example:

```ts
export const imgAltRule: A11yRule = {
  id: "a11y-spy/img-alt",
  meta: {
    name: "Image elements must have alt text",
    description: "Detects image elements without an alt attribute.",
    wcag: ["1.1.1"],
    languages: ["html", "javascriptreact", "typescriptreact"],
    defaultSeverity: "warning",
    fixable: true
  },
  run(context) {
    return [];
  }
};
```

## Rule Context

```ts
export type RuleContext = {
  documentText: string;
  languageId: string;
  fileName: string;
  config: A11ySpyConfig;
};
```

## Diagnostic Result

```ts
export type DiagnosticResult = {
  ruleId: string;
  message: string;
  severity: "error" | "warning" | "info";
  start: Position;
  end: Position;
  fix?: FixAction;
};
```

## Fix Action

```ts
export type FixAction = {
  title: string;
  kind: "quickfix";
  insertText: string;
  offset: number;
};
```

## Configuration Type

```ts
export type A11ySpyConfig = {
  enabled: boolean;
  rules: {
    imgAlt: "off" | "info" | "warning" | "error";
  };
};
```

Color contrast and Tailwind configuration are planned after v0.1.

## Adding a New Rule

1. Create a file in `src/rules`.
2. Export an `A11yRule`.
3. Add tests in `src/test/rules`.
4. Register the rule in the rule engine.
5. Add documentation and examples.
