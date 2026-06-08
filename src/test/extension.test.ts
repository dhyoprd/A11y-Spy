import { describe, expect, it } from "vitest";
import type { ExtensionContext } from "vscode";

import { activate, deactivate } from "../extension";

describe("extension lifecycle", () => {
  it("activates and deactivates without registering commands", () => {
    const context = {
      subscriptions: []
    };

    expect(() => activate(context as unknown as ExtensionContext)).not.toThrow();
    expect(context.subscriptions).toHaveLength(0);
    expect(() => deactivate()).not.toThrow();
  });
});
