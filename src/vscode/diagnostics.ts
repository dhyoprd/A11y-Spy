import type { DiagnosticSeverity } from "../core/types";

export type VscodeDiagnosticSeverityValues<TSeverity> = {
  Error: TSeverity;
  Warning: TSeverity;
  Information: TSeverity;
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
