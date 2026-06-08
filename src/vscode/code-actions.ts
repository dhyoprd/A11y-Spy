import * as vscode from "vscode";

import { FixRegistry, isEditableQuickFixScheme } from "./fix-registry";

export const A11Y_SPY_CODE_ACTION_KINDS = [vscode.CodeActionKind.QuickFix];

export function createA11ySpyCodeActionProvider(
  fixRegistry: FixRegistry
): vscode.CodeActionProvider<vscode.CodeAction> {
  return {
    provideCodeActions(document, _range, context) {
      if (!isEditableQuickFixScheme(document.uri.scheme)) {
        return [];
      }

      return context.diagnostics.flatMap((diagnostic) => {
        const fix = fixRegistry.get(document.uri.toString(), {
          code: diagnostic.code,
          message: diagnostic.message,
          range: diagnostic.range
        });

        if (!fix) {
          return [];
        }

        const action = new vscode.CodeAction(fix.title, vscode.CodeActionKind.QuickFix);
        action.diagnostics = [diagnostic];
        action.edit = new vscode.WorkspaceEdit();
        action.edit.insert(document.uri, document.positionAt(fix.offset), fix.insertText);

        return [action];
      });
    }
  };
}
