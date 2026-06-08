import type { DiagnosticResult, RuleContext } from "./types";
import { normalizeA11ySpyConfig } from "./config";
import { findHtmlImageCandidates } from "../parsers/html-parser";
import { findJsxImageCandidates } from "../parsers/jsx-parser";
import { runImgAltRule } from "../rules/img-alt";

export function runA11ySpy(context: RuleContext): DiagnosticResult[] {
  const config = normalizeA11ySpyConfig(context.config);

  if (!config.enabled || config.rules.imgAlt === "off") {
    return [];
  }

  if (context.languageId === "html") {
    return runImgAltRule(
      context.documentText,
      findHtmlImageCandidates(context.documentText),
      config.rules.imgAlt
    );
  }

  if (context.languageId === "javascriptreact" || context.languageId === "typescriptreact") {
    return runImgAltRule(
      context.documentText,
      findJsxImageCandidates(context.documentText, context.languageId, context.fileName),
      config.rules.imgAlt
    );
  }

  return [];
}
