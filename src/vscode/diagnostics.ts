import type { DiagnosticSeverity } from "../core/types";

export const DOCS_BASE_URL = "https://github.com/dhyoprd/A11y-Spy/blob/main/docs";

export type VscodeDiagnosticSeverityValues<TSeverity> = {
  Error: TSeverity;
  Warning: TSeverity;
  Information: TSeverity;
};
export type UriFactory<TUri> = {
  parse(value: string): TUri;
};
export type DiagnosticCodeWithTarget<TUri> = {
  value: string;
  target: TUri;
};

export function mapDiagnosticSeverity<TSeverity>(
  severity: DiagnosticSeverity,
  vscodeSeverity: VscodeDiagnosticSeverityValues<TSeverity>
): TSeverity {
  switch (severity) {
    case "error":
      return vscodeSeverity.Error;
    case "info":
      return vscodeSeverity.Information;
    case "warning":
      return vscodeSeverity.Warning;
  }
}

export function createDiagnosticCode<TUri>(
  ruleId: string,
  uriFactory: UriFactory<TUri>
): DiagnosticCodeWithTarget<TUri> {
  return {
    value: ruleId,
    target: uriFactory.parse(`${DOCS_BASE_URL}/${getRuleDocsPath(ruleId)}`)
  };
}

function getRuleDocsPath(ruleId: string): string {
  const ruleName = ruleId.startsWith("a11y-spy/") ? ruleId.slice("a11y-spy/".length) : ruleId;

  return `rules/${ruleName}.md`;
}
