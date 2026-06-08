import type { DiagnosticResult, RuleContext } from "./types";
import { findHtmlImageCandidates } from "../parsers/html-parser";
import { findJsxImageCandidates } from "../parsers/jsx-parser";
import { runImgAltRule } from "../rules/img-alt";

export function runA11ySpy(context: RuleContext): DiagnosticResult[] {
  if (context.languageId === "html") {
    return runImgAltRule(context.documentText, findHtmlImageCandidates(context.documentText));
  }

  if (context.languageId === "javascriptreact" || context.languageId === "typescriptreact") {
    return runImgAltRule(
      context.documentText,
      findJsxImageCandidates(context.documentText, context.languageId, context.fileName)
    );
  }

  return [];
}
