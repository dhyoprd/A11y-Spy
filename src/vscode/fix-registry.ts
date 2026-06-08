import type { DiagnosticResult, FixAction, Range } from "../core/types";

export type DiagnosticIdentity = {
  code?: unknown;
  message: string;
  range: Range;
};

export class FixRegistry {
  private readonly fixesByDiagnosticKey = new Map<string, FixAction>();

  replace(uri: string, diagnostics: DiagnosticResult[]): void {
    for (const key of this.keysForUri(uri)) {
      this.fixesByDiagnosticKey.delete(key);
    }

    for (const diagnostic of diagnostics) {
      if (diagnostic.fix) {
        this.fixesByDiagnosticKey.set(
          createDiagnosticKey(uri, {
            code: diagnostic.ruleId,
            message: diagnostic.message,
            range: diagnostic.range
          }),
          diagnostic.fix
        );
      }
    }
  }

  get(uri: string, diagnostic: DiagnosticIdentity): FixAction | undefined {
    return this.fixesByDiagnosticKey.get(createDiagnosticKey(uri, diagnostic));
  }

  private keysForUri(uri: string): string[] {
    const prefix = `${uri}:`;
    return Array.from(this.fixesByDiagnosticKey.keys()).filter((key) => key.startsWith(prefix));
  }
}

export function isEditableQuickFixScheme(scheme: string): boolean {
  return scheme === "file" || scheme === "untitled";
}

function createDiagnosticKey(uri: string, diagnostic: DiagnosticIdentity): string {
  return [
    uri,
    normalizeCode(diagnostic.code),
    diagnostic.message,
    diagnostic.range.start.line,
    diagnostic.range.start.character,
    diagnostic.range.end.line,
    diagnostic.range.end.character
  ].join(":");
}

function normalizeCode(code: unknown): string {
  if (typeof code === "string" || typeof code === "number") {
    return String(code);
  }

  if (code && typeof code === "object" && "value" in code) {
    return String(code.value);
  }

  return "";
}
