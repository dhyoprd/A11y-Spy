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
        fix: {
          title: 'Add alt="" for decorative image',
          kind: "quickfix",
          insertText: ' alt=""',
          offset: 4
        },
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

  it("uses one simple fix insertion strategy for multi-line HTML images", () => {
    const diagnostics = runA11ySpy({
      documentText: ['<img', '  src="/hero.png"', ">"].join("\n"),
      fileName: "index.html",
      languageId: "html"
    });

    expect(diagnostics[0]?.fix).toEqual({
      title: 'Add alt="" for decorative image',
      kind: "quickfix",
      insertText: ' alt=""',
      offset: 4
    });
  });

  it("reports a JSX image without an alt prop", () => {
    const diagnostics = runA11ySpy({
      documentText: '<img src="/hero.png" />',
      fileName: "component.jsx",
      languageId: "javascriptreact"
    });

    expect(diagnostics).toEqual([
      {
        ruleId: "a11y-spy/img-alt",
        source: "A11y-Spy",
        message: "Image element is missing an alt attribute.",
        severity: "warning",
        fix: {
          title: 'Add alt="" for decorative image',
          kind: "quickfix",
          insertText: ' alt=""',
          offset: 4
        },
        range: {
          start: { line: 0, character: 1 },
          end: { line: 0, character: 4 }
        }
      }
    ]);
  });

  it("reports a nested TSX image inside fragments", () => {
    const diagnostics = runA11ySpy({
      documentText: 'const View = () => <><section><img src="/hero.png" /></section></>;',
      fileName: "component.tsx",
      languageId: "typescriptreact"
    });

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.ruleId).toBe("a11y-spy/img-alt");
  });

  it("reports paired JSX image elements", () => {
    const diagnostics = runA11ySpy({
      documentText: 'const view = <img src="/hero.png"></img>;',
      fileName: "component.jsx",
      languageId: "javascriptreact"
    });

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.ruleId).toBe("a11y-spy/img-alt");
  });

  it("does not report JSX images with explicit alt props", () => {
    const diagnostics = runA11ySpy({
      documentText: [
        "const label = undefined;",
        "const view = <>",
        '  <img src="/empty.png" alt="" />',
        '  <img src="/undefined.png" alt={undefined} />',
        '  <img src="/dynamic.png" alt={label} />',
        "</>;"
      ].join("\n"),
      fileName: "component.jsx",
      languageId: "javascriptreact"
    });

    expect(diagnostics).toEqual([]);
  });

  it("does not report JSX images with spread props", () => {
    const diagnostics = runA11ySpy({
      documentText: "const view = <img src={heroUrl} {...imageProps} />;",
      fileName: "component.jsx",
      languageId: "javascriptreact"
    });

    expect(diagnostics).toEqual([]);
  });

  it("ignores component-like JSX image names", () => {
    const diagnostics = runA11ySpy({
      documentText: 'const view = <><Image src="/hero.png" /><IMG src="/hero.png" /></>;',
      fileName: "component.jsx",
      languageId: "javascriptreact"
    });

    expect(diagnostics).toEqual([]);
  });

  it("does not report JSX-looking text in strings or comments", () => {
    const diagnostics = runA11ySpy({
      documentText: [
        'const markup = \'<img src="/string.png" />\';',
        'const view = <>{/* <img src="/comment.png" /> */}</>;'
      ].join("\n"),
      fileName: "component.jsx",
      languageId: "javascriptreact"
    });

    expect(diagnostics).toEqual([]);
  });

  it("uses UTF-16 offsets for JSX diagnostic ranges", () => {
    const documentText = 'const view = <div>🙂 <img src="/hero.png" /></div>;';
    const diagnostics = runA11ySpy({
      documentText,
      fileName: "component.jsx",
      languageId: "javascriptreact"
    });
    const tagNameStart = documentText.indexOf("img");

    expect(diagnostics[0]?.range).toEqual({
      start: { line: 0, character: tagNameStart },
      end: { line: 0, character: tagNameStart + 3 }
    });
  });
});
