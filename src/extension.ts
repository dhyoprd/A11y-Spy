import * as vscode from "vscode";

import { DEFAULT_A11Y_SPY_CONFIG, normalizeA11ySpyConfig } from "./core/config";
import type { A11ySpyConfig, DiagnosticResult, Range } from "./core/types";
import {
  A11Y_SPY_CODE_ACTION_KINDS,
  createA11ySpyCodeActionProvider
} from "./vscode/code-actions";
import {
  refreshOpenSupportedDocuments,
  SUPPORTED_LANGUAGE_IDS
} from "./vscode/document-diagnostics";
import { mapDiagnosticSeverity } from "./vscode/diagnostics";
import { FixRegistry } from "./vscode/fix-registry";

const DIAGNOSTIC_COLLECTION_NAME = "a11y-spy";
const CONFIG_SECTION = "a11ySpy";

const SUPPORTED_DOCUMENT_SELECTOR: vscode.DocumentSelector = SUPPORTED_LANGUAGE_IDS.map(
  (language) => ({ language })
);

export function activate(context: vscode.ExtensionContext): void {
  const diagnosticCollection = vscode.languages.createDiagnosticCollection(
    DIAGNOSTIC_COLLECTION_NAME
  );
  const fixRegistry = new FixRegistry();

  const refreshDiagnostics = () => {
    refreshOpenSupportedDocuments(
      vscode.workspace.textDocuments,
      diagnosticCollection,
      fixRegistry,
      readA11ySpyConfig(),
      toVscodeDiagnostic
    );
  };

  context.subscriptions.push(
    diagnosticCollection,
    vscode.languages.registerCodeActionsProvider(
      SUPPORTED_DOCUMENT_SELECTOR,
      createA11ySpyCodeActionProvider(fixRegistry),
      { providedCodeActionKinds: A11Y_SPY_CODE_ACTION_KINDS }
    ),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (
        event.affectsConfiguration(`${CONFIG_SECTION}.enable`) ||
        event.affectsConfiguration(`${CONFIG_SECTION}.rules.imgAlt`)
      ) {
        refreshDiagnostics();
      }
    })
  );

  refreshDiagnostics();
}

export function deactivate(): void {}

function readA11ySpyConfig(): A11ySpyConfig {
  const configuration = vscode.workspace.getConfiguration(CONFIG_SECTION);

  return normalizeA11ySpyConfig({
    enabled: configuration.get("enable", DEFAULT_A11Y_SPY_CONFIG.enabled),
    rules: {
      imgAlt: configuration.get("rules.imgAlt", DEFAULT_A11Y_SPY_CONFIG.rules.imgAlt)
    }
  });
}

function toVscodeDiagnostic(diagnostic: DiagnosticResult): vscode.Diagnostic {
  const vscodeDiagnostic = new vscode.Diagnostic(
    toVscodeRange(diagnostic.range),
    diagnostic.message,
    mapDiagnosticSeverity(diagnostic.severity, vscode.DiagnosticSeverity)
  );
  vscodeDiagnostic.source = diagnostic.source;
  vscodeDiagnostic.code = diagnostic.ruleId;

  return vscodeDiagnostic;
}

function toVscodeRange(range: Range): vscode.Range {
  return new vscode.Range(
    range.start.line,
    range.start.character,
    range.end.line,
    range.end.character
  );
}
