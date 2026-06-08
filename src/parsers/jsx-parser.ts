import ts from "typescript";

import type { ImageAttributeValue, ImageElementCandidate } from "./image-candidate";

export function findJsxImageCandidates(
  documentText: string,
  languageId: string,
  fileName: string
): ImageElementCandidate[] {
  const sourceFile = ts.createSourceFile(
    fileName,
    documentText,
    ts.ScriptTarget.Latest,
    true,
    getScriptKind(languageId)
  );

  const candidates: ImageElementCandidate[] = [];
  visitNode(sourceFile, sourceFile, candidates);
  return candidates;
}

function getScriptKind(languageId: string): ts.ScriptKind {
  return languageId === "typescriptreact" ? ts.ScriptKind.TSX : ts.ScriptKind.JSX;
}

function visitNode(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  candidates: ImageElementCandidate[]
): void {
  if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
    const candidate = toImageCandidate(node, sourceFile);

    if (candidate) {
      candidates.push(candidate);
    }
  }

  ts.forEachChild(node, (child) => visitNode(child, sourceFile, candidates));
}

function toImageCandidate(
  node: ts.JsxSelfClosingElement | ts.JsxOpeningElement,
  sourceFile: ts.SourceFile
): ImageElementCandidate | undefined {
  if (!ts.isIdentifier(node.tagName) || node.tagName.text !== "img") {
    return undefined;
  }

  const attributes = node.attributes.properties.flatMap((property) => {
    if (!ts.isJsxAttribute(property)) {
      return [];
    }

    return [
      {
        name: getAttributeName(property.name, sourceFile),
        value: getAttributeValue(property, sourceFile)
      }
    ];
  });

  return {
    attributes,
    hasSpreadAttribute: node.attributes.properties.some(ts.isJsxSpreadAttribute),
    tagNameStartOffset: node.tagName.getStart(sourceFile),
    tagNameEndOffset: node.tagName.getEnd()
  };
}

function getAttributeName(name: ts.JsxAttributeName, sourceFile: ts.SourceFile): string {
  return ts.isIdentifier(name) ? name.text : name.getText(sourceFile);
}

function getAttributeValue(
  attribute: ts.JsxAttribute,
  sourceFile: ts.SourceFile
): ImageAttributeValue {
  if (!attribute.initializer) {
    return { kind: "boolean", value: true };
  }

  if (ts.isStringLiteral(attribute.initializer)) {
    return { kind: "string", value: attribute.initializer.text };
  }

  if (!ts.isJsxExpression(attribute.initializer)) {
    return { kind: "expression", value: attribute.initializer.getText(sourceFile) };
  }

  const expression = attribute.initializer.expression;

  if (!expression) {
    return { kind: "expression", value: attribute.initializer.getText(sourceFile) };
  }

  if (expression.kind === ts.SyntaxKind.TrueKeyword) {
    return { kind: "boolean", value: true };
  }

  if (expression.kind === ts.SyntaxKind.FalseKeyword) {
    return { kind: "boolean", value: false };
  }

  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
    return { kind: "string", value: expression.text };
  }

  return { kind: "expression", value: expression.getText(sourceFile) };
}
