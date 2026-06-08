import { describe, expect, it } from "vitest";

import { runA11ySpy } from "./rule-engine";

describe("runA11ySpy", () => {
  it("reports an HTML image without an alt attribute", () => {
    const diagnostics = runA11ySpy({
      documentText: '<img src="/hero.png">',
      fileName: "index.html",
      languageId: "html"
    });

    expect(diagnostics).toEqual([
      {
        ruleId: "a11y-spy/img-alt",
        source: "A11y-Spy",
        message: "Image element is missing an alt attribute.",
        severity: "warning",
        range: {
          start: { line: 0, character: 1 },
          end: { line: 0, character: 4 }
        }
      }
    ]);
  });

  it("does not report HTML images with explicit alt attributes", () => {
    const diagnostics = runA11ySpy({
      documentText: [
        '<img src="/hero.png" alt="Hero image">',
        '<IMG src="/decor.png" ALT="">'
      ].join("\n"),
      fileName: "index.html",
      languageId: "html"
    });

    expect(diagnostics).toEqual([]);
  });

  it("does not report image-like text in comments, scripts, or styles", () => {
    const diagnostics = runA11ySpy({
      documentText: [
        '<!-- <img src="/comment.png"> -->',
        '<script>const markup = \'<img src="/script.png">\';</script>',
        '<style>.demo::before { content: "<img src=/style.png>"; }</style>'
      ].join("\n"),
      fileName: "index.html",
      languageId: "html"
    });

    expect(diagnostics).toEqual([]);
  });

  it("reports uppercase HTML image tags without alt", () => {
    const diagnostics = runA11ySpy({
      documentText: '<IMG src="/hero.png">',
      fileName: "index.html",
      languageId: "html"
    });

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.range).toEqual({
      start: { line: 0, character: 1 },
      end: { line: 0, character: 4 }
    });
  });

  it("reports paired HTML image elements without alt when parsed as an image element", () => {
    const diagnostics = runA11ySpy({
      documentText: '<img src="/hero.png"></img>',
      fileName: "index.html",
      languageId: "html"
    });

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.ruleId).toBe("a11y-spy/img-alt");
  });

  it("uses UTF-16 offsets when converting diagnostic ranges", () => {
    const diagnostics = runA11ySpy({
      documentText: '🙂 <img src="/hero.png">',
      fileName: "index.html",
      languageId: "html"
    });

    expect(diagnostics[0]?.range).toEqual({
      start: { line: 0, character: 4 },
      end: { line: 0, character: 7 }
    });
  });
});
