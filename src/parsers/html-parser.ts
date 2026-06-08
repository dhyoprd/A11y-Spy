import { parseFragment, type DefaultTreeAdapterMap } from "parse5";

import type { ImageAttributeValue, ImageElementCandidate } from "./image-candidate";

type HtmlNode = DefaultTreeAdapterMap["node"];
type HtmlElement = DefaultTreeAdapterMap["element"];

export function findHtmlImageCandidates(documentText: string): ImageElementCandidate[] {
  const fragment = parseFragment(documentText, {
    sourceCodeLocationInfo: true
  });

  const candidates: ImageElementCandidate[] = [];
  visitNodes(fragment.childNodes, candidates);
  return candidates;
}

function visitNodes(nodes: HtmlNode[], candidates: ImageElementCandidate[]): void {
  for (const node of nodes) {
    if (isElementNode(node)) {
      if (node.tagName.toLowerCase() === "img") {
        const candidate = toImageCandidate(node);

        if (candidate) {
          candidates.push(candidate);
        }
      }

      visitNodes(node.childNodes, candidates);
    }
  }
}

function isElementNode(node: HtmlNode): node is HtmlElement {
  return "tagName" in node && "attrs" in node && "childNodes" in node;
}

function toImageCandidate(element: HtmlElement): ImageElementCandidate | undefined {
  const startTag = element.sourceCodeLocation?.startTag ?? element.sourceCodeLocation;

  if (!startTag) {
    return undefined;
  }

  const tagNameStartOffset = startTag.startOffset + 1;

  return {
    attributes: element.attrs.map((attribute) => ({
      name: attribute.name,
      value: toAttributeValue(attribute.value)
    })),
    tagNameStartOffset,
    tagNameEndOffset: tagNameStartOffset + element.tagName.length
  };
}

function toAttributeValue(value: string): ImageAttributeValue {
  return value === "" ? { kind: "empty", value: "" } : { kind: "string", value };
}
