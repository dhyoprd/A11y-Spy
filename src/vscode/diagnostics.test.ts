import { describe, expect, it } from "vitest";

import { createDiagnosticCode, DOCS_BASE_URL, mapDiagnosticSeverity } from "./diagnostics";

describe("mapDiagnosticSeverity", () => {
  it("maps core severities to VS Code diagnostic severities", () => {
    const vscodeSeverity = {
      Error: 0,
      Warning: 1,
      Information: 2
    };

    expect(mapDiagnosticSeverity("error", vscodeSeverity)).toBe(vscodeSeverity.Error);
    expect(mapDiagnosticSeverity("warning", vscodeSeverity)).toBe(vscodeSeverity.Warning);
    expect(mapDiagnosticSeverity("info", vscodeSeverity)).toBe(vscodeSeverity.Information);
  });
});

describe("createDiagnosticCode", () => {
  it("builds a VS Code diagnostic code with a rule value and docs target", () => {
    const code = createDiagnosticCode("a11y-spy/img-alt", {
      parse: (value) => ({ href: value })
    });

    expect(code).toEqual({
      value: "a11y-spy/img-alt",
      target: {
        href: `${DOCS_BASE_URL}/rules/img-alt.md`
      }
    });
  });
});
