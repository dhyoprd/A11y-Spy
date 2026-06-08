export type SupportedLanguageId = "html" | "javascriptreact" | "typescriptreact";

export type DiagnosticSeverity = "error" | "warning" | "info";
export type RuleSeverity = DiagnosticSeverity | "off";

export type A11ySpyConfig = {
  enabled: boolean;
  rules: {
    imgAlt: RuleSeverity;
  };
};

export type A11ySpyConfigInput = {
  enabled?: unknown;
  rules?: {
    imgAlt?: unknown;
  };
};

export type Position = {
  line: number;
  character: number;
};

export type Range = {
  start: Position;
  end: Position;
};

export type DiagnosticResult = {
  ruleId: string;
  source: "A11y-Spy";
  message: string;
  severity: DiagnosticSeverity;
  range: Range;
  fix?: FixAction;
};

export type FixAction = {
  title: string;
  kind: "quickfix";
  insertText: string;
  offset: number;
};

export type RuleContext = {
  documentText: string;
  languageId: string;
  fileName: string;
  config?: A11ySpyConfigInput;
};
