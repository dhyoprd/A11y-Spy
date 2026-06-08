import type { DiagnosticResult } from "../core/types";
import type { ImageElementCandidate } from "../parsers/image-candidate";
import { offsetsToRange } from "../utils/range";

export const IMG_ALT_RULE_ID = "a11y-spy/img-alt";
export const IMG_ALT_MESSAGE = "Image element is missing an alt attribute.";

export function runImgAltRule(
  documentText: string,
  candidates: ImageElementCandidate[]
): DiagnosticResult[] {
  return candidates.flatMap((candidate) => {
    if (hasAltAttribute(candidate)) {
      return [];
    }

    if (isAriaHiddenTrue(candidate)) {
      return [];
    }

    if (hasPresentationalRole(candidate)) {
      return [];
    }

    if (candidate.hasSpreadAttribute) {
      return [];
    }

    return [
      {
        ruleId: IMG_ALT_RULE_ID,
        source: "A11y-Spy",
        message: IMG_ALT_MESSAGE,
        severity: "warning",
        fix: {
          title: 'Add alt="" for decorative image',
          kind: "quickfix",
          insertText: ' alt=""',
          offset: candidate.tagNameEndOffset
        },
        range: offsetsToRange(
          documentText,
          candidate.tagNameStartOffset,
          candidate.tagNameEndOffset
        )
      }
    ];
  });
}

function hasAltAttribute(candidate: ImageElementCandidate): boolean {
  return candidate.attributes.some((attribute) => attribute.name.toLowerCase() === "alt");
}

function isAriaHiddenTrue(candidate: ImageElementCandidate): boolean {
  return candidate.attributes.some((attribute) => {
    if (attribute.name.toLowerCase() !== "aria-hidden") {
      return false;
    }

    if (attribute.value.kind === "boolean") {
      return attribute.value.value;
    }

    return attribute.value.kind === "string" && isNormalizedValue(attribute.value.value, ["true"]);
  });
}

function hasPresentationalRole(candidate: ImageElementCandidate): boolean {
  return hasStringAttributeValue(candidate, "role", ["none", "presentation"]);
}

function hasStringAttributeValue(
  candidate: ImageElementCandidate,
  attributeName: string,
  acceptedValues: string[]
): boolean {
  return candidate.attributes.some((attribute) => {
    return (
      attribute.name.toLowerCase() === attributeName &&
      attribute.value.kind === "string" &&
      isNormalizedValue(attribute.value.value, acceptedValues)
    );
  });
}

function isNormalizedValue(value: string, acceptedValues: string[]): boolean {
  return acceptedValues.includes(value.trim().toLowerCase());
}
