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

export const SUPPORTED_LANGUAGE_IDS: SupportedLanguageId[] = [
  "html",
  "javascriptreact",
  "typescriptreact"
];

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

  const diagnostics = runA11ySpy({
    documentText: document.getText(),
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
