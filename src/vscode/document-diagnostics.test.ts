import { describe, expect, it } from "vitest";

import type { DiagnosticResult } from "../core/types";
import { FixRegistry } from "./fix-registry";
import { refreshOpenSupportedDocuments, type DiagnosticCollectionLike } from "./document-diagnostics";

type UriLike = {
  toString(): string;
};

type TestDocument = {
  uri: UriLike;
  languageId: string;
  fileName: string;
  getText(): string;
};

class TestDiagnosticCollection implements DiagnosticCollectionLike<UriLike, DiagnosticResult> {
  readonly diagnosticsByUri = new Map<string, DiagnosticResult[]>();
  clearCount = 0;

  set(uri: UriLike, diagnostics: DiagnosticResult[]): void {
    this.diagnosticsByUri.set(uri.toString(), diagnostics);
  }

  delete(uri: UriLike): void {
    this.diagnosticsByUri.delete(uri.toString());
  }

  clear(): void {
    this.clearCount += 1;
    this.diagnosticsByUri.clear();
  }
}

describe("refreshOpenSupportedDocuments", () => {
  it("re-analyzes open supported documents and clears diagnostics when disabled", () => {
    const uri = { toString: () => "file:///index.html" };
    const document: TestDocument = {
      uri,
      languageId: "html",
      fileName: "index.html",
      getText: () => '<img src="/hero.png">'
    };
    const collection = new TestDiagnosticCollection();
    const fixRegistry = new FixRegistry();

    refreshOpenSupportedDocuments([document], collection, fixRegistry, {
      enabled: true,
      rules: { imgAlt: "error" }
    });

    const firstDiagnostic = collection.diagnosticsByUri.get(uri.toString())![0]!;

    expect(firstDiagnostic.severity).toBe("error");
    expect(
      fixRegistry.get(uri.toString(), {
        code: firstDiagnostic.ruleId,
        message: firstDiagnostic.message,
        range: firstDiagnostic.range
      })
    ).toBeDefined();

    refreshOpenSupportedDocuments([document], collection, fixRegistry, {
      enabled: false,
      rules: { imgAlt: "warning" }
    });

    expect(collection.clearCount).toBe(1);
    expect(collection.diagnosticsByUri.size).toBe(0);
    expect(
      fixRegistry.get(uri.toString(), {
        code: "a11y-spy/img-alt",
        message: "Image element is missing an alt attribute.",
        range: {
          start: { line: 0, character: 1 },
          end: { line: 0, character: 4 }
        }
      })
    ).toBeUndefined();

    refreshOpenSupportedDocuments([document], collection, fixRegistry, {
      enabled: true,
      rules: { imgAlt: "info" }
    });

    expect(collection.diagnosticsByUri.get(uri.toString())?.[0]?.severity).toBe("info");
  });
});
