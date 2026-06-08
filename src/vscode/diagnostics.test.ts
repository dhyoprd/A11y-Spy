import { describe, expect, it } from "vitest";

import { mapDiagnosticSeverity } from "./diagnostics";

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
