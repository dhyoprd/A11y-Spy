import { describe, expect, it } from "vitest";

import { FixRegistry, isEditableQuickFixScheme } from "./fix-registry";
import type { DiagnosticResult } from "../core/types";

const missingAltDiagnostic: DiagnosticResult = {
  ruleId: "a11y-spy/img-alt",
  source: "A11y-Spy",
  message: "Image element is missing an alt attribute.",
  severity: "warning",
  range: {
    start: { line: 0, character: 1 },
    end: { line: 0, character: 4 }
  },
  fix: {
    title: 'Add alt="" for decorative image',
    kind: "quickfix",
    insertText: ' alt=""',
    offset: 4
  }
};

describe("FixRegistry", () => {
  it("stores and retrieves fix payloads by diagnostic identity", () => {
    const registry = new FixRegistry();

    registry.replace("file:///index.html", [missingAltDiagnostic]);

    expect(
      registry.get("file:///index.html", {
        code: "a11y-spy/img-alt",
        message: "Image element is missing an alt attribute.",
        range: missingAltDiagnostic.range
      })
    ).toEqual(missingAltDiagnostic.fix);
  });

  it("does not return a fix when a diagnostic has no registered fix", () => {
    const registry = new FixRegistry();

    registry.replace("file:///index.html", [
      {
        ...missingAltDiagnostic,
        fix: undefined
      }
    ]);

    expect(
      registry.get("file:///index.html", {
        code: "a11y-spy/img-alt",
        message: "Image element is missing an alt attribute.",
        range: missingAltDiagnostic.range
      })
    ).toBeUndefined();
  });
});

describe("isEditableQuickFixScheme", () => {
  it("allows quick fixes only for file and untitled documents", () => {
    expect(isEditableQuickFixScheme("file")).toBe(true);
    expect(isEditableQuickFixScheme("untitled")).toBe(true);
    expect(isEditableQuickFixScheme("git")).toBe(false);
    expect(isEditableQuickFixScheme("readonly")).toBe(false);
  });
});
