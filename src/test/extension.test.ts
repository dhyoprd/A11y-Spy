import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const diagnosticCollection = {
  set: vi.fn(),
  delete: vi.fn(),
  clear: vi.fn(),
  dispose: vi.fn()
};
let configurationValues = {
  enable: true,
  imgAlt: "warning"
};
let configurationChangeHandler:
  | ((event: { affectsConfiguration(section: string): boolean }) => void)
  | undefined;
let openDocumentHandler: ((document: (typeof textDocuments)[number]) => void) | undefined;
let changeDocumentHandler:
  | ((event: { document: (typeof textDocuments)[number] }) => void)
  | undefined;
let closeDocumentHandler: ((document: (typeof textDocuments)[number]) => void) | undefined;
const registerCodeActionsProvider = vi.fn(() => ({ dispose: vi.fn() }));
const onDidChangeConfiguration = vi.fn(
  (handler: (event: { affectsConfiguration(section: string): boolean }) => void) => {
    configurationChangeHandler = handler;
    return { dispose: vi.fn() };
  }
);
const onDidOpenTextDocument = vi.fn((handler: (document: (typeof textDocuments)[number]) => void) => {
  openDocumentHandler = handler;
  return { dispose: vi.fn() };
});
const onDidChangeTextDocument = vi.fn(
  (handler: (event: { document: (typeof textDocuments)[number] }) => void) => {
    changeDocumentHandler = handler;
    return { dispose: vi.fn() };
  }
);
const onDidCloseTextDocument = vi.fn((handler: (document: (typeof textDocuments)[number]) => void) => {
  closeDocumentHandler = handler;
  return { dispose: vi.fn() };
});
const getConfiguration = vi.fn(() => ({
  get: vi.fn((key: string, fallback: unknown) => {
    if (key === "enable") {
      return configurationValues.enable;
    }

    if (key === "rules.imgAlt") {
      return configurationValues.imgAlt;
    }

    return fallback;
  })
}));
const textDocuments = [
  {
    uri: { toString: () => "file:///index.html" },
    languageId: "html",
    fileName: "index.html",
    getText: () => '<img src="/hero.png">'
  }
];

vi.mock(
  "vscode",
  () => ({
    CodeActionKind: {
      QuickFix: "quickfix"
    },
    Diagnostic: class {
      code: unknown;
      source: string | undefined;

      constructor(
        readonly range: unknown,
        readonly message: string,
        readonly severity: unknown
      ) {}
    },
    DiagnosticSeverity: {
      Error: 0,
      Warning: 1,
      Information: 2
    },
    Range: class {
      constructor(
        readonly startLine: number,
        readonly startCharacter: number,
        readonly endLine: number,
        readonly endCharacter: number
      ) {}
    },
    WorkspaceEdit: class {},
    CodeAction: class {
      diagnostics: unknown[] = [];
      edit: unknown;

      constructor(
        readonly title: string,
        readonly kind: unknown
      ) {}
    },
    languages: {
      createDiagnosticCollection: vi.fn(() => diagnosticCollection),
      registerCodeActionsProvider
    },
    workspace: {
      get textDocuments() {
        return textDocuments;
      },
      getConfiguration,
      onDidChangeConfiguration,
      onDidChangeTextDocument,
      onDidCloseTextDocument,
      onDidOpenTextDocument
    },
    commands: {
      registerCommand: vi.fn()
    }
  })
);

describe("extension lifecycle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    configurationValues = {
      enable: true,
      imgAlt: "warning"
    };
    configurationChangeHandler = undefined;
    openDocumentHandler = undefined;
    changeDocumentHandler = undefined;
    closeDocumentHandler = undefined;
    diagnosticCollection.set.mockClear();
    diagnosticCollection.delete.mockClear();
    diagnosticCollection.clear.mockClear();
    diagnosticCollection.dispose.mockClear();
    registerCodeActionsProvider.mockClear();
    onDidChangeConfiguration.mockClear();
    onDidOpenTextDocument.mockClear();
    onDidChangeTextDocument.mockClear();
    onDidCloseTextDocument.mockClear();
    getConfiguration.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("registers diagnostics, quick fixes, and configuration refresh on activation", async () => {
    const vscode = await import("vscode");
    const { activate, deactivate } = await import("../extension");
    const context = {
      subscriptions: []
    };

    activate(context as never);

    expect(registerCodeActionsProvider).toHaveBeenCalledTimes(1);
    expect(onDidChangeConfiguration).toHaveBeenCalledTimes(1);
    expect(onDidOpenTextDocument).toHaveBeenCalledTimes(1);
    expect(onDidChangeTextDocument).toHaveBeenCalledTimes(1);
    expect(onDidCloseTextDocument).toHaveBeenCalledTimes(1);
    expect(vscode.commands.registerCommand).not.toHaveBeenCalled();
    expect(diagnosticCollection.set).toHaveBeenCalledTimes(1);
    expect(context.subscriptions).toHaveLength(7);

    openDocumentHandler?.(textDocuments[0]);

    expect(diagnosticCollection.set).toHaveBeenCalledTimes(2);

    changeDocumentHandler?.({ document: textDocuments[0] });

    expect(diagnosticCollection.set).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(250);

    expect(diagnosticCollection.set).toHaveBeenCalledTimes(3);

    changeDocumentHandler?.({ document: textDocuments[0] });
    closeDocumentHandler?.(textDocuments[0]);

    expect(diagnosticCollection.delete).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(250);

    expect(diagnosticCollection.set).toHaveBeenCalledTimes(3);

    configurationValues = {
      enable: false,
      imgAlt: "warning"
    };
    configurationChangeHandler?.({
      affectsConfiguration: (section) => section === "a11ySpy.enable"
    });

    expect(diagnosticCollection.clear).toHaveBeenCalledTimes(1);

    configurationValues = {
      enable: true,
      imgAlt: "error"
    };
    configurationChangeHandler?.({
      affectsConfiguration: (section) => section === "a11ySpy.rules.imgAlt"
    });

    expect(diagnosticCollection.set).toHaveBeenCalledTimes(4);
    expect(() => deactivate()).not.toThrow();
  });
});
