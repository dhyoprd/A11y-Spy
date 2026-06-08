import type { A11ySpyConfig, A11ySpyConfigInput, RuleSeverity } from "./types";

export const DEFAULT_A11Y_SPY_CONFIG: A11ySpyConfig = {
  enabled: true,
  rules: {
    imgAlt: "warning"
  }
};

export function normalizeA11ySpyConfig(config?: A11ySpyConfigInput): A11ySpyConfig {
  return {
    enabled: typeof config?.enabled === "boolean" ? config.enabled : DEFAULT_A11Y_SPY_CONFIG.enabled,
    rules: {
      imgAlt: isRuleSeverity(config?.rules?.imgAlt)
        ? config.rules.imgAlt
        : DEFAULT_A11Y_SPY_CONFIG.rules.imgAlt
    }
  };
}

export function isRuleSeverity(value: unknown): value is RuleSeverity {
  return value === "off" || value === "info" || value === "warning" || value === "error";
}
