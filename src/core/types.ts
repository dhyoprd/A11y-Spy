export type SupportedLanguageId = "html" | "javascriptreact" | "typescriptreact";

export type DiagnosticSeverity = "error" | "warning" | "info";

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
};

export type RuleContext = {
  documentText: string;
  languageId: string;
  fileName: string;
};
