import type { ImageLayoutsSettings, OverlayMode } from "../types";

const OVERLAY_MODES: readonly string[] = ["never", "hover", "always"];

// Per-block `overlay` wins, then the older per-block `permanentOverlay`
// boolean, then the global setting (with the pre-0.16 toggle as fallback for
// settings saved before overlayMode existed).
export const resolveOverlayMode = (
  data: { overlay?: string; permanentOverlay?: boolean } | null | undefined,
  settings: ImageLayoutsSettings,
): OverlayMode => {
  if (data?.overlay && OVERLAY_MODES.includes(data.overlay)) {
    return data.overlay as OverlayMode;
  }
  if (typeof data?.permanentOverlay === "boolean") {
    return data.permanentOverlay ? "always" : "hover";
  }
  if (settings.overlayMode && OVERLAY_MODES.includes(settings.overlayMode)) {
    return settings.overlayMode;
  }
  return settings.shouldOverlayPermanently ? "always" : "hover";
};
