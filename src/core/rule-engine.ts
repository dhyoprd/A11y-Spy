import type { DiagnosticResult, RuleContext } from "./types";
import { findHtmlImageCandidates } from "../parsers/html-parser";
import { runImgAltRule } from "../rules/img-alt";

export function runA11ySpy(context: RuleContext): DiagnosticResult[] {
  if (context.languageId !== "html") {
    return [];
  }

  return runImgAltRule(context.documentText, findHtmlImageCandidates(context.documentText));
}
