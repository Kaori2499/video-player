import type { DialConfig } from "dialkit";

export type PlaygroundDialKitMountOptions = {
  /** Nested DialKit folders start collapsed (e.g. combined `/` page). */
  foldersStartCollapsed?: boolean;
  /** Whole DialKit panel section starts collapsed. */
  panelCollapsed?: boolean;
};

export function dialKitPanelOptions(
  mountOptions?: PlaygroundDialKitMountOptions,
): { defaultCollapsed?: boolean } {
  if (!mountOptions?.panelCollapsed) {
    return {};
  }
  return { defaultCollapsed: true };
}

function isTypedControl(value: object): boolean {
  return "type" in value && typeof (value as { type: unknown }).type === "string";
}

function isDialFolder(value: unknown): value is DialConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  if (isTypedControl(value)) return false;
  return true;
}

/** Applies DialKit `_collapsed: true` on every nested folder in a panel config. */
export function withDialFoldersCollapsed<T extends DialConfig>(config: T): T {
  const next = { ...config } as DialConfig;

  for (const key of Object.keys(config)) {
    if (key === "_collapsed") continue;
    const value = config[key as keyof T];
    if (!isDialFolder(value)) continue;

    const folder: DialConfig = { ...value };
    folder._collapsed = true;

    for (const childKey of Object.keys(folder)) {
      if (childKey === "_collapsed") continue;
      const child = folder[childKey];
      if (isDialFolder(child)) {
        folder[childKey] = withDialFoldersCollapsed(child);
      }
    }

    next[key] = folder;
  }

  return next as T;
}

export function resolveDialConfig<T extends DialConfig>(
  config: T,
  options?: PlaygroundDialKitMountOptions,
): T {
  if (!options?.foldersStartCollapsed) return config;
  return withDialFoldersCollapsed(config);
}
