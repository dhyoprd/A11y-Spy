import { normalizeA11ySpyConfig } from "../core/config";
import { runA11ySpy } from "../core/rule-engine";
import type {
  A11ySpyConfigInput,
  DiagnosticResult,
  SupportedLanguageId
} from "../core/types";
import type { FixRegistry } from "./fix-registry";

export type DocumentLike<TUri> = {
  uri: TUri;
  languageId: string;
  fileName: string;
  getText(): string;
};

export type DiagnosticCollectionLike<TUri, TDiagnostic> = {
  set(uri: TUri, diagnostics: TDiagnostic[]): void;
  delete(uri: TUri): void;
  clear(): void;
};

export type DiagnosticMapper<TDiagnostic> = (diagnostic: DiagnosticResult) => TDiagnostic;
export type TimerApi<TTimer> = {
  setTimeout(callback: () => void, delayMs: number): TTimer;
  clearTimeout(timer: TTimer): void;
};

export const SUPPORTED_LANGUAGE_IDS: SupportedLanguageId[] = [
  "html",
  "javascriptreact",
  "typescriptreact"
];
export const MAX_DOCUMENT_SIZE_BYTES = 500 * 1024;
export const CHANGE_DEBOUNCE_MS = 250;

export function refreshOpenSupportedDocuments<TUri, TDiagnostic = DiagnosticResult>(
  documents: readonly DocumentLike<TUri>[],
  collection: DiagnosticCollectionLike<TUri, TDiagnostic>,
  fixRegistry: FixRegistry,
  config?: A11ySpyConfigInput,
  mapDiagnostic?: DiagnosticMapper<TDiagnostic>
): void {
  const normalizedConfig = normalizeA11ySpyConfig(config);
  const supportedDocuments = documents.filter(isSupportedDocument);

  if (!normalizedConfig.enabled) {
    collection.clear();
    for (const document of supportedDocuments) {
      fixRegistry.replace(String(document.uri), []);
    }
    return;
  }

  for (const document of supportedDocuments) {
    analyzeDocument(document, collection, fixRegistry, normalizedConfig, mapDiagnostic);
  }
}

export function analyzeDocument<TUri, TDiagnostic = DiagnosticResult>(
  document: DocumentLike<TUri>,
  collection: DiagnosticCollectionLike<TUri, TDiagnostic>,
  fixRegistry: FixRegistry,
  config?: A11ySpyConfigInput,
  mapDiagnostic?: DiagnosticMapper<TDiagnostic>
): void {
  if (!isSupportedDocument(document)) {
    collection.delete(document.uri);
    return;
  }

  const documentText = document.getText();

  if (Buffer.byteLength(documentText, "utf8") > MAX_DOCUMENT_SIZE_BYTES) {
    collection.delete(document.uri);
    fixRegistry.replace(String(document.uri), []);
    return;
  }

  const diagnostics = runA11ySpy({
    documentText,
    fileName: document.fileName,
    languageId: document.languageId,
    config
  });
  const mappedDiagnostics = diagnostics.map((diagnostic) => {
    return mapDiagnostic ? mapDiagnostic(diagnostic) : (diagnostic as TDiagnostic);
  });

  fixRegistry.replace(String(document.uri), diagnostics);
  collection.set(document.uri, mappedDiagnostics);
}

export function isSupportedDocument<TUri>(document: DocumentLike<TUri>): boolean {
  return SUPPORTED_LANGUAGE_IDS.includes(document.languageId as SupportedLanguageId);
}

export function createDocumentDiagnosticScheduler<
  TUri,
  TDiagnostic = DiagnosticResult,
  TTimer = ReturnType<typeof setTimeout>
>(options: {
  collection: DiagnosticCollectionLike<TUri, TDiagnostic>;
  fixRegistry: FixRegistry;
  getConfig: () => A11ySpyConfigInput;
  mapDiagnostic?: DiagnosticMapper<TDiagnostic>;
  timerApi?: TimerApi<TTimer>;
  debounceMs?: number;
}) {
  const pendingTimersByUri = new Map<string, TTimer>();
  const timerApi = options.timerApi ?? defaultTimerApi<TTimer>();
  const debounceMs = options.debounceMs ?? CHANGE_DEBOUNCE_MS;

  const cancel = (document: DocumentLike<TUri>) => {
    const uri = String(document.uri);
    const timer = pendingTimersByUri.get(uri);

    if (timer !== undefined) {
      timerApi.clearTimeout(timer);
      pendingTimersByUri.delete(uri);
    }
  };

  const analyzeNow = (document: DocumentLike<TUri>) => {
    cancel(document);
    analyzeDocument(
      document,
      options.collection,
      options.fixRegistry,
      options.getConfig(),
      options.mapDiagnostic
    );
  };

  const schedule = (document: DocumentLike<TUri>) => {
    if (!isSupportedDocument(document)) {
      return;
    }

    cancel(document);
    const uri = String(document.uri);
    const timer = timerApi.setTimeout(() => {
      pendingTimersByUri.delete(uri);
      analyzeNow(document);
    }, debounceMs);
    pendingTimersByUri.set(uri, timer);
  };

  const close = (document: DocumentLike<TUri>) => {
    cancel(document);
    options.collection.delete(document.uri);
    options.fixRegistry.replace(String(document.uri), []);
  };

  const refresh = (documents: readonly DocumentLike<TUri>[]) => {
    dispose();
    refreshOpenSupportedDocuments(
      documents,
      options.collection,
      options.fixRegistry,
      options.getConfig(),
      options.mapDiagnostic
    );
  };

  function dispose(): void {
    for (const timer of pendingTimersByUri.values()) {
      timerApi.clearTimeout(timer);
    }

    pendingTimersByUri.clear();
  }

  return {
    analyzeNow,
    close,
    dispose,
    pendingCount: () => pendingTimersByUri.size,
    refresh,
    schedule
  };
}

function defaultTimerApi<TTimer>(): TimerApi<TTimer> {
  return {
    setTimeout: (callback, delayMs) => setTimeout(callback, delayMs) as TTimer,
    clearTimeout: (timer) => clearTimeout(timer as ReturnType<typeof setTimeout>)
  };
}
