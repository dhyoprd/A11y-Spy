import { describe, expect, it } from "vitest";

import type { DiagnosticResult } from "../core/types";
import { FixRegistry } from "./fix-registry";
import {
  analyzeDocument,
  createDocumentDiagnosticScheduler,
  MAX_DOCUMENT_SIZE_BYTES,
  refreshOpenSupportedDocuments,
  type DiagnosticCollectionLike
} from "./document-diagnostics";

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

describe("analyzeDocument", () => {
  it("skips oversized documents and clears existing diagnostics and fixes", () => {
    const uri = { toString: () => "file:///large.html" };
    let text = '<img src="/hero.png">';
    const document: TestDocument = {
      uri,
      languageId: "html",
      fileName: "large.html",
      getText: () => text
    };
    const collection = new TestDiagnosticCollection();
    const fixRegistry = new FixRegistry();

    analyzeDocument(document, collection, fixRegistry);
    const diagnostic = collection.diagnosticsByUri.get(uri.toString())![0]!;
    expect(diagnostic).toBeDefined();

    text = "x".repeat(MAX_DOCUMENT_SIZE_BYTES + 1);

    analyzeDocument(document, collection, fixRegistry);

    expect(collection.diagnosticsByUri.has(uri.toString())).toBe(false);
    expect(
      fixRegistry.get(uri.toString(), {
        code: diagnostic.ruleId,
        message: diagnostic.message,
        range: diagnostic.range
      })
    ).toBeUndefined();
  });

  it("analyzes supported virtual or readonly documents", () => {
    const uri = { toString: () => "readonly:///index.html" };
    const document: TestDocument = {
      uri,
      languageId: "html",
      fileName: "index.html",
      getText: () => '<img src="/hero.png">'
    };
    const collection = new TestDiagnosticCollection();

    analyzeDocument(document, collection, new FixRegistry());

    expect(collection.diagnosticsByUri.get(uri.toString())).toHaveLength(1);
  });
});

describe("createDocumentDiagnosticScheduler", () => {
  it("debounces changes and clears pending work when documents close", () => {
    const uri = { toString: () => "file:///index.html" };
    const document: TestDocument = {
      uri,
      languageId: "html",
      fileName: "index.html",
      getText: () => '<img src="/hero.png">'
    };
    const collection = new TestDiagnosticCollection();
    const fixRegistry = new FixRegistry();
    const timerApi = new TestTimerApi();
    const scheduler = createDocumentDiagnosticScheduler({
      collection,
      fixRegistry,
      getConfig: () => ({ enabled: true, rules: { imgAlt: "warning" } }),
      timerApi,
      debounceMs: 250
    });

    scheduler.schedule(document);
    scheduler.schedule(document);

    expect(timerApi.delays).toEqual([250, 250]);
    expect(timerApi.clearedHandles).toEqual([1]);
    expect(collection.diagnosticsByUri.size).toBe(0);

    timerApi.run(2);

    expect(collection.diagnosticsByUri.get(uri.toString())).toHaveLength(1);

    scheduler.schedule(document);
    scheduler.close(document);

    expect(timerApi.clearedHandles).toEqual([1, 3]);
    expect(collection.diagnosticsByUri.has(uri.toString())).toBe(false);
    expect(scheduler.pendingCount()).toBe(0);

    timerApi.run(3);

    expect(collection.diagnosticsByUri.has(uri.toString())).toBe(false);
  });
});

class TestTimerApi {
  readonly delays: number[] = [];
  readonly clearedHandles: number[] = [];
  private readonly callbacksByHandle = new Map<number, () => void>();
  private nextHandle = 1;

  setTimeout(callback: () => void, delayMs: number): number {
    const handle = this.nextHandle;
    this.nextHandle += 1;
    this.delays.push(delayMs);
    this.callbacksByHandle.set(handle, callback);
    return handle;
  }

  clearTimeout(handle: number): void {
    this.clearedHandles.push(handle);
    this.callbacksByHandle.delete(handle);
  }

  run(handle: number): void {
    const callback = this.callbacksByHandle.get(handle);

    if (!callback) {
      return;
    }

    this.callbacksByHandle.delete(handle);
    callback();
  }
}
